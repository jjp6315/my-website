import { DAILY_STORY_PROMPT } from "./story-prompt";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.6-luna";

type StoryBindings = {
  DB: D1Database;
  OPENAI_API_KEY?: string;
  OPENAI_STORY_MODEL?: string;
};

type GeneratedStory = {
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

export async function generateDailyStory(
  env: StoryBindings,
  scheduledTime = Date.now(),
): Promise<{ created: boolean; storyDate: string }> {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const storyDate = new Date(scheduledTime).toISOString().slice(0, 10);
  const existing = await env.DB.prepare(
    "SELECT id FROM daily_stories WHERE story_date = ? LIMIT 1",
  )
    .bind(storyDate)
    .first();

  // Cron deliveries can be retried. This check makes generation idempotent so
  // one date cannot accidentally create multiple API charges or duplicate rows.
  if (existing) return { created: false, storyDate };

  const model = env.OPENAI_STORY_MODEL || DEFAULT_MODEL;
  console.log("Daily story generation started", { storyDate, model });
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
          content: [{ type: "input_text", text: DAILY_STORY_PROMPT }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Write the daily edition for ${storyDate}. Return only the requested structured result.`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "daily_story",
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

  if (!outputText) throw new Error("OpenAI returned no story text");

  const story = validateStory(JSON.parse(outputText) as unknown);
  const wordCount = story.body.trim().split(/\s+/).length;
  const readingTime = `${Math.max(1, Math.ceil(wordCount / 220))} min read`;
  const publishedAt = new Date(scheduledTime).toISOString();
  const edition = `Daily story · ${storyDate}`;

  await env.DB.prepare(
    `INSERT INTO daily_stories (
      story_date, edition, section, title, introduction, body,
      closing_prompt, reading_time, model, source_prompt, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(story_date) DO NOTHING`,
  )
    .bind(
      storyDate,
      edition,
      story.section,
      story.title,
      story.introduction,
      story.body,
      story.closingPrompt,
      readingTime,
      model,
      DAILY_STORY_PROMPT,
      publishedAt,
    )
    .run();

  console.log("Daily story saved", { storyDate, model });
  return { created: true, storyDate };
}

function validateStory(value: unknown): GeneratedStory {
  if (!value || typeof value !== "object") {
    throw new Error("OpenAI returned an invalid story object");
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
