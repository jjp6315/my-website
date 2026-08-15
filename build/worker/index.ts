/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { generateBrainBit } from "./generate-brain-bit";
import { isBrainBitsOwner } from "./brain-bit-auth";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  OPENAI_API_KEY?: string;
  OPENAI_BRAIN_BITS_MODEL?: string;
  STORY_ADMIN_TOKEN?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/brain-bits" && request.method === "POST") {
      if (!env.STORY_ADMIN_TOKEN || !env.OPENAI_API_KEY) {
        return Response.json(
          { error: "Brain Bits generation secrets are not configured" },
          { status: 503 },
        );
      }

      if (!(await isBrainBitsOwner(request, env.STORY_ADMIN_TOKEN))) {
        return Response.json({ error: "Invalid owner token" }, { status: 401 });
      }

      ctx.waitUntil(
        generateBrainBit(env)
          .then((result) => console.log("Manual Brain Bits job complete", result))
          .catch((error: unknown) =>
            console.error("Manual Brain Bits job failed", error),
          ),
      );

      return Response.json(
        {
          accepted: true,
          message: "Brain Bit generation is running in the background",
        },
        { status: 202 },
      );
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },

  async scheduled(
    controller: { scheduledTime: number; cron: string },
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    ctx.waitUntil(
      generateBrainBit(env, controller.scheduledTime)
        .then((result) => console.log("Brain Bits job complete", result))
        .catch((error: unknown) => {
          console.error("Brain Bits job failed", error);
          throw error;
        }),
    );
  },
};

export default worker;
