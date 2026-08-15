# Personal Site + Lab

A recruiter-friendly portfolio that also leaves room for photographs, small games, data experiments, and a persistent leaderboard.

## Recommended stack

- **Language:** TypeScript. It catches mistakes early and works for both the interface and server code.
- **UI:** React with the Next.js App Router API, compiled by vinext for Cloudflare Workers.
- **Styling:** plain CSS plus Tailwind utilities when useful. The first version intentionally keeps most styling in one readable file.
- **Data:** Cloudflare D1 (SQLite) for scores and other structured data. Use R2 later for original photo uploads.
- **Hosting:** OpenAI Sites / Cloudflare. It keeps the page, server routes, and database close together and avoids running a separate backend.

## File organization

```text
app/
  api/scores/route.ts      # server endpoint for the live leaderboard
  components/              # interactive pieces used by pages
  globals.css              # shared design system and responsive styles
  layout.tsx               # metadata, fonts, shared page shell
  page.tsx                 # home page composition and content
db/
  index.ts                 # database connection
  schema.ts                # D1/SQLite tables
drizzle/                   # generated, versioned database migrations
public/                    # optimized web images, resume, icons
worker/                    # Cloudflare entry point
.openai/hosting.json       # database and file-storage declarations
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
