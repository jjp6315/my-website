"use client";

import { useEffect, useState } from "react";
import type {
  BrainBitsResponse,
  BrainBit,
} from "../../content/brainBits";

type BriefState =
  | { status: "loading" }
  | { status: "ready"; current: BrainBit; favorites: BrainBit[] }
  | { status: "error" };

export default function BrainBitsApp() {
  const [state, setState] = useState<BriefState>({ status: "loading" });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/brain-bits", { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Brain Bits unavailable");
        return response.json() as Promise<BrainBitsResponse>;
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

  const activeBit =
    state.status === "ready"
      ? state.favorites.find((bit) => bit.id === selectedId) ?? state.current
      : null;

  if (state.status === "loading") {
    return <div className="brainBitsStatus">Preparing today’s bit…</div>;
  }

  if (state.status === "error" || !activeBit) {
    return (
      <div className="brainBitsStatus">
        Today’s Brain Bit could not be loaded. Please try again shortly.
      </div>
    );
  }

  const publishedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(activeBit.publishedAt));

  async function toggleFavorite() {
    if (
      state.status !== "ready" ||
      !activeBit?.id ||
      saving
    ) return;

    const nextFavoriteState = !activeBit.isFavorite;
    setMessage("");
    setSaving(true);

    try {
      const response = await fetch("/api/brain-bits", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: activeBit.id,
          isFavorite: nextFavoriteState,
        }),
      });
      const result = (await response.json()) as {
        story?: BrainBit;
        error?: string;
      };

      if (!response.ok || !result.story) {
        throw new Error(result.error || "The Brain Bit could not be saved");
      }

      const updated = result.story;
      setState((previous) => {
        if (previous.status !== "ready") return previous;
        return {
          status: "ready",
          current:
            previous.current.id === updated.id ? updated : previous.current,
          favorites: updated.isFavorite
            ? [
                updated,
                ...previous.favorites.filter((item) => item.id !== updated.id),
              ]
            : previous.favorites.filter((item) => item.id !== updated.id),
        };
      });
      if (!updated.isFavorite) setSelectedId(null);
      setMessage(
        updated.isFavorite
          ? "Saved to the shared archive."
          : "Removed from the shared archive.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="brainBitsApp">
      <header className="briefMasthead">
        <button
          className="briefBrand"
          type="button"
          onClick={() => setSelectedId(null)}
          aria-label="Read today's Brain Bit"
        >
          <span className="briefEyebrow">Brain Bits</span>
          <span className="briefEdition">{activeBit.edition}</span>
        </button>
        <time dateTime={activeBit.publishedAt}>{publishedDate}</time>
      </header>

      <div className="briefToolbar">
        <span>{activeBit.section} · {activeBit.readingTime}</span>
        <button
          className={activeBit.isFavorite ? "briefHeartButton isFavorite" : "briefHeartButton"}
          type="button"
          onClick={toggleFavorite}
          disabled={!activeBit.id || saving}
          title={!activeBit.id ? "Available after the first generated Brain Bit" : undefined}
        >
          <span aria-hidden="true">{activeBit.isFavorite ? "♥" : "♡"}</span>
          {saving
            ? activeBit.isFavorite ? "Removing…" : "Saving…"
            : activeBit.isFavorite ? "Unsave" : "Save Brain Bit"}
        </button>
      </div>
      {message && <p className="briefMessage" role="status">{message}</p>}

      <section className="briefLead">
        <p>Today’s Brain Bit</p>
        <h1>{activeBit.title}</h1>
        <p>{activeBit.introduction}</p>
      </section>

      <section className="briefStoryBody">
        {activeBit.body.split(/\n\s*\n/).map((paragraph, index) => (
          <p key={`${activeBit.id ?? "fallback"}-${index}`}>{paragraph}</p>
        ))}
      </section>

      <footer className="briefPrompt">
        <span>Question for today</span>
        <p>{activeBit.closingPrompt}</p>
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
            {state.favorites.map((bit) => (
              <button
                type="button"
                key={bit.id}
                className={bit.id === activeBit.id ? "isActive" : ""}
                onClick={() => setSelectedId(bit.id)}
              >
                <time dateTime={bit.publishedAt}>{bit.bitDate}</time>
                <span>{bit.title}</span>
              </button>
            ))}
          </div>
        )}
      </aside>
    </article>
  );
}
