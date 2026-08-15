"use client";

import { useEffect, useState } from "react";
import type {
  DailyBriefResponse,
  DailyStory,
} from "../../content/dailyBrief";

type BriefState =
  | { status: "loading" }
  | { status: "ready"; current: DailyStory; favorites: DailyStory[] }
  | { status: "error" };

const TOKEN_STORAGE_KEY = "daily-story-owner-token";

export default function DailyBriefApp() {
  const [state, setState] = useState<BriefState>({ status: "loading" });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/daily-brief", { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Daily brief unavailable");
        return response.json() as Promise<DailyBriefResponse>;
      })
      .then(({ current, favorites }) =>
        setState({ status: "ready", current, favorites }),
      )
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "error" });
      });

    return () => controller.abort();
  }, []);

  const activeStory =
    state.status === "ready"
      ? state.favorites.find((story) => story.id === selectedId) ?? state.current
      : null;

  if (state.status === "loading") {
    return <div className="dailyBriefStatus">Preparing today’s edition…</div>;
  }

  if (state.status === "error" || !activeStory) {
    return (
      <div className="dailyBriefStatus">
        Today’s edition could not be loaded. Please try again shortly.
      </div>
    );
  }

  const publishedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(activeStory.publishedAt));

  async function toggleFavorite() {
    if (state.status !== "ready" || !activeStory?.id || saving) return;

    let token = sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? "";
    if (!token) {
      token = window.prompt("Enter your story owner token:")?.trim() ?? "";
    }
    if (!token) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/daily-brief", {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: activeStory.id,
          isFavorite: !activeStory.isFavorite,
        }),
      });
      const result = (await response.json()) as {
        story?: DailyStory;
        error?: string;
      };

      if (!response.ok || !result.story) {
        if (response.status === 401) sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        throw new Error(result.error || "The story could not be saved");
      }

      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      const updated = result.story;
      setState((previous) => {
        if (previous.status !== "ready") return previous;
        const favorites = updated.isFavorite
          ? [updated, ...previous.favorites.filter((item) => item.id !== updated.id)]
          : previous.favorites.filter((item) => item.id !== updated.id);
        return {
          status: "ready",
          current:
            previous.current.id === updated.id ? updated : previous.current,
          favorites,
        };
      });
      if (!updated.isFavorite) setSelectedId(null);
      setMessage(updated.isFavorite ? "Saved to your archive." : "Removed from archive.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="dailyBriefApp">
      <header className="briefMasthead">
        <button
          className="briefBrand"
          type="button"
          onClick={() => setSelectedId(null)}
          aria-label="Read today's story"
        >
          <span className="briefEyebrow">The Daily Signal</span>
          <span className="briefEdition">{activeStory.edition}</span>
        </button>
        <time dateTime={activeStory.publishedAt}>{publishedDate}</time>
      </header>

      <div className="briefToolbar">
        <span>{activeStory.section} · {activeStory.readingTime}</span>
        <button
          className={activeStory.isFavorite ? "briefHeartButton isFavorite" : "briefHeartButton"}
          type="button"
          onClick={toggleFavorite}
          disabled={!activeStory.id || saving}
          title={!activeStory.id ? "Available after the first generated story" : undefined}
        >
          <span aria-hidden="true">{activeStory.isFavorite ? "♥" : "♡"}</span>
          {saving ? "Saving…" : activeStory.isFavorite ? "Saved" : "Save story"}
        </button>
      </div>
      {message && <p className="briefMessage" role="status">{message}</p>}

      <section className="briefLead">
        <p>Today’s story</p>
        <h1>{activeStory.title}</h1>
        <p>{activeStory.introduction}</p>
      </section>

      <section className="briefStoryBody">
        {activeStory.body.split(/\n\s*\n/).map((paragraph, index) => (
          <p key={`${activeStory.id ?? "fallback"}-${index}`}>{paragraph}</p>
        ))}
      </section>

      <footer className="briefPrompt">
        <span>Question for today</span>
        <p>{activeStory.closingPrompt}</p>
      </footer>

      <aside className="briefArchive" aria-label="Favorite story archive">
        <div className="briefArchiveHeading">
          <span>Favorite archive</span>
          <span>{state.favorites.length} saved</span>
        </div>
        {state.favorites.length === 0 ? (
          <p className="briefArchiveEmpty">Heart a generated story to keep it here.</p>
        ) : (
          <div className="briefArchiveList">
            {state.favorites.map((story) => (
              <button
                type="button"
                key={story.id}
                className={story.id === activeStory.id ? "isActive" : ""}
                onClick={() => setSelectedId(story.id)}
              >
                <time dateTime={story.publishedAt}>{story.storyDate}</time>
                <span>{story.title}</span>
              </button>
            ))}
          </div>
        )}
      </aside>
    </article>
  );
}
