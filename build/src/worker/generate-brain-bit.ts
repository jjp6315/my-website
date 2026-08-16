import { BRAIN_BIT_PROMPT } from "./brain-bit-prompt";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.6-luna";

type BrainBitBindings = {
  DB: D1Database;
  OPENAI_API_KEY?: string;
  OPENAI_BRAIN_BITS_MODEL?: string;
};

type GeneratedBrainBit = {
  section: string;
  title: string;
  introduction: string;
  body: string;
  closingPrompt: string;
};

type ResponsesPayload = {
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

export async function generateBrainBit(
  env: BrainBitBindings,
  scheduledTime = Date.now(),
): Promise<{ created: boolean; bitDate: string }> {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const bitDate = new Date(scheduledTime).toISOString().slice(0, 10);
  const existing = await env.DB.prepare(
    "SELECT id FROM brain_bits WHERE bit_date = ? LIMIT 1",
  )
    .bind(bitDate)
    .first();

  // Cron deliveries can be retried. This check makes generation idempotent so
  // one date cannot accidentally create multiple API charges or duplicate rows.
  if (existing) return { created: false, bitDate };

  const model = env.OPENAI_BRAIN_BITS_MODEL || DEFAULT_MODEL;
  console.log("Brain Bit generation started", { bitDate, model });
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify({
      model,
      input: [
        {
          role: "developer",
          content: [{ type: "input_text", text: BRAIN_BIT_PROMPT }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Write the Brain Bit for ${bitDate}. Return only the requested structured result.`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "brain_bit",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              section: { type: "string" },
              title: { type: "string" },
              introduction: { type: "string" },
              body: { type: "string" },
              closingPrompt: { type: "string" },
            },
            required: [
              "section",
              "title",
              "introduction",
              "body",
              "closingPrompt",
            ],
          },
        },
      },
      max_output_tokens: 2200,
    }),
  });

  if (!response.ok) {
    const details = (await response.text()).slice(0, 500);
    throw new Error(`OpenAI request failed (${response.status}): ${details}`);
  }

  const payload = (await response.json()) as ResponsesPayload;
  const outputText = payload.output
    ?.find((item) => item.type === "message")
    ?.content?.find((item) => item.type === "output_text")?.text;

  if (!outputText) throw new Error("OpenAI returned no Brain Bit text");

  const brainBit = validateBrainBit(JSON.parse(outputText) as unknown);
  const wordCount = brainBit.body.trim().split(/\s+/).length;
  const readingTime = `${Math.max(1, Math.ceil(wordCount / 220))} min read`;
  const publishedAt = new Date(scheduledTime).toISOString();
  const edition = `Brain Bits · ${bitDate}`;

  await env.DB.prepare(
    `INSERT INTO brain_bits (
      bit_date, edition, section, title, introduction, body,
      closing_prompt, reading_time, model, source_prompt, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(bit_date) DO NOTHING`,
  )
    .bind(
      bitDate,
      edition,
      brainBit.section,
      brainBit.title,
      brainBit.introduction,
      brainBit.body,
      brainBit.closingPrompt,
      readingTime,
      model,
      BRAIN_BIT_PROMPT,
      publishedAt,
    )
    .run();

  console.log("Brain Bit saved", { bitDate, model });
  return { created: true, bitDate };
}

function validateBrainBit(value: unknown): GeneratedBrainBit {
  if (!value || typeof value !== "object") {
    throw new Error("OpenAI returned an invalid Brain Bit object");
  }

  const record = value as Record<string, unknown>;
  const fields = [
    "section",
    "title",
    "introduction",
    "body",
    "closingPrompt",
  ] as const;

  for (const field of fields) {
    if (typeof record[field] !== "string" || !record[field].trim()) {
      throw new Error(`OpenAI returned an invalid ${field}`);
    }
  }

  return {
    section: record.section as string,
    title: record.title as string,
    introduction: record.introduction as string,
    body: record.body as string,
    closingPrompt: record.closingPrompt as string,
  };
}
