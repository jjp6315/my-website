"use client";

import { useEffect, useState } from "react";
import type { DailyBrief } from "../../content/dailyBrief";

type BriefState =
  | { status: "loading" }
  | { status: "ready"; brief: DailyBrief }
  | { status: "error" };

export default function DailyBriefApp() {
  const [state, setState] = useState<BriefState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/daily-brief", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Daily brief unavailable");
        return response.json() as Promise<{ brief: DailyBrief }>;
      })
      .then(({ brief }) => setState({ status: "ready", brief }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "error" });
      });

    return () => controller.abort();
  }, []);

  if (state.status === "loading") {
    return <div className="dailyBriefStatus">Preparing today’s edition…</div>;
  }

  if (state.status === "error") {
    return (
      <div className="dailyBriefStatus">
        Today’s edition could not be loaded. Please try again shortly.
      </div>
    );
  }

  const { brief } = state;
  const publishedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(brief.publishedAt));

  return (
    <article className="dailyBriefApp">
      <header className="briefMasthead">
        <div>
          <p className="briefEyebrow">The Daily Signal</p>
          <p className="briefEdition">{brief.edition}</p>
        </div>
        <time dateTime={brief.publishedAt}>{publishedDate}</time>
      </header>

      <section className="briefLead">
        <p>Good morning.</p>
        <h1>{brief.title}</h1>
        <p>{brief.introduction}</p>
      </section>

      <div className="briefStories">
        {brief.stories.map((story, index) => (
          <section className="briefStory" key={`${story.section}-${story.headline}`}>
            <div className="briefStoryMeta">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{story.section}</span>
              <span>{story.readingTime}</span>
            </div>
            <h2>{story.headline}</h2>
            <p>{story.summary}</p>
          </section>
        ))}
      </div>

      <footer className="briefPrompt">
        <span>Question for today</span>
        <p>{brief.closingPrompt}</p>
      </footer>
    </article>
  );
}
