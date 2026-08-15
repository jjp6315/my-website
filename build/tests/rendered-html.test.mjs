import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the desktop portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>John(?:&apos;|&#x27;|')s OS<\/title>/i);
  assert.match(html, /class="desktop"/);
  assert.match(html, /class="dynamicSky"/);
  assert.match(html, /class="mobileAppGrid" aria-label="Applications"/);
  assert.match(html, /System Monitor/);
  assert.match(html, /aria-label="Application dock"/);
  assert.match(html, /Open Brain Bits/);
  assert.doesNotMatch(html, /codex-preview|_sites-preview/i);
});

test("server-renders every golf tournament page", async () => {
  const pages = [
    ["/golf", /Two courses/],
    ["/golf/players", /Players &amp; tee times/],
    ["/golf/leaderboard", /Live tournament/i],
    ["/golf/scorecard", /Enter a score/],
  ];

  for (const [pathname, expected] of pages) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    assert.match(html, /PARK/);
    assert.match(html, expected);
  }
});

test("keeps the removed Sites integration out of the project", async () => {
  const [packageJson, viteConfig, readme] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(packageJson, /@openai\/sites-vite-plugin/);
  assert.doesNotMatch(viteConfig, /sites-vite-plugin|\bsites\(\)/);
  assert.doesNotMatch(readme, /OpenAI Sites|\.openai\/hosting\.json/);

  await Promise.all([
    assert.rejects(access(new URL(".openai/hosting.json", projectRoot))),
    assert.rejects(access(new URL("app/_sites-preview", projectRoot))),
  ]);
});
