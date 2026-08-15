# Personal Site + Lab

A recruiter-friendly portfolio that also leaves room for photographs, small games, data experiments, and a persistent leaderboard.

## Recommended stack

- **Language:** TypeScript. It catches mistakes early and works for both the interface and server code.
- **UI:** React with the Next.js App Router API, compiled by vinext for Cloudflare Workers.
- **Styling:** plain CSS plus Tailwind utilities when useful. The first version intentionally keeps most styling in one readable file.
- **Data:** Cloudflare D1 (SQLite) for scores and other structured data. Use R2 later for original photo uploads.
- **Hosting:** Cloudflare Workers, with D1 for persistent data. The application, server routes, and database run together without a separate backend.

## File organization

```text
app/
  api/scores/route.ts      # server endpoint for the live leaderboard
  api/daily-brief/         # reads stories and updates the private archive
  components/              # interactive pieces used by pages
  globals.css              # shared design system and responsive styles
  layout.tsx               # metadata, fonts, shared page shell
  page.tsx                 # home page composition and content
db/
  index.ts                 # database connection
  schema.ts                # D1/SQLite tables
drizzle/                   # generated, versioned database migrations
public/                    # optimized web images, resume, icons
worker/
  index.ts                 # Cloudflare request and scheduled-event entry point
  generate-daily-story.ts  # calls OpenAI and saves a story to D1
  story-prompt.ts          # the creative prompt you can edit
wrangler.jsonc             # Worker, custom domain, and D1 configuration
```

Keep experiments independent. When one grows beyond a component, give it a route such as `app/lab/game-name/page.tsx`. Put reusable UI in `app/components`, server endpoints in `app/api`, and never put secrets in `public` or commit an `.env` file.

## Run locally

Install Node.js 22.13 or newer, then:

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal. Before publishing, run `npm run build`.

## Make it yours

Search for `Your Name`, `YN`, `hello@example.com`, and the placeholder social links. Replace the three sample projects with concise case studies: problem, your role, decisions, measurable result, and a link. Add a PDF resume under `public/` and link it from the navigation.

For photographs, export display versions around 1600–2400 px wide as WebP or AVIF and keep originals outside Git. If you later want browser uploads, enable R2 and store photo metadata in D1.

## Suggested growth path

1. Personalize the homepage and ship it.
2. Add individual project routes with real outcomes and screenshots.
3. Turn the score-room placeholder into your first tiny game.
4. Add spam protection and rate limiting before sharing score submission broadly.
5. Add an owner-only admin surface when editing content in code becomes annoying.

The current score endpoint validates input and stores the top scores, but a public production leaderboard should also use server-side rate limits, bot protection, and—if scores matter—game-specific verification.

## Daily story job

The Daily Brief uses the same Cloudflare Worker and D1 database as the rest of
the site. A Cron Trigger runs at `12:00 UTC` every day, calls the OpenAI
Responses API, and inserts one story into `daily_stories`. The date column is
unique, so a completed date is skipped and cannot create a duplicate edition.

The API key and archive owner token are Worker secrets. Set them once before
deploying; never put their actual values in `wrangler.jsonc` or commit them:

```bash
npx wrangler secret put OPENAI_API_KEY
openssl rand -hex 32
npx wrangler secret put STORY_ADMIN_TOKEN
npm run release
```

Paste the random value printed by `openssl` when Wrangler asks for
`STORY_ADMIN_TOKEN`, and keep a copy in a password manager. The Daily Brief asks
for this token the first time you heart a story in each browser tab. Visitors
can read stories and the public favorite archive, but cannot change it.

To change what gets written, edit `worker/story-prompt.ts`. The model is set by
`OPENAI_STORY_MODEL` in `wrangler.jsonc`. The checked-in migration creates the
story table, and `npm run release` applies database migrations before deploying
code that uses them.

For local development, copy `.dev.vars.example` to `.dev.vars`, enter test
secret values, apply the local database migration, and start the Worker:

```bash
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run dev
```

To invoke the scheduled handler locally, open the scheduled test URL printed by
Wrangler (normally
`http://localhost:5173/cdn-cgi/handler/scheduled?cron=0+12+*+*+*`). Local D1
data is separate from production data. Cloudflare cron schedules use UTC and
can take several minutes to propagate after a deployment.

After the first deployment, you can create today's production edition without
waiting for the next cron. Enter the owner token when prompted; using `read -s`
keeps it out of the visible command:

```bash
read -s STORY_TOKEN
curl -X POST https://parkjiwoong.com/api/daily-brief \
  -H "Authorization: Bearer $STORY_TOKEN"
unset STORY_TOKEN
```

The request returns `202 Accepted` immediately while Cloudflare finishes the
story in the background. Wait about a minute and refresh the Daily Brief. You
can also inspect the saved row directly:

```bash
npx wrangler d1 execute DB --remote \
  --command "SELECT id, story_date, title, published_at FROM daily_stories ORDER BY id DESC LIMIT 3"
```

For generation diagnostics, leave this running in a second terminal before
sending the POST request:

```bash
npx wrangler tail parkjiwoong --format pretty
```

The log will show when generation starts, when D1 saves the story, or the exact
OpenAI error. The outbound model request is capped at 60 seconds.

This project uses a Cloudflare Cron Trigger rather than GitHub Actions because
the Worker already owns the D1 binding and runtime secrets. A GitHub Action
would need separate Cloudflare credentials, an HTTP publishing endpoint, and
another security boundary without improving this daily task.
