"use client";

import { FormEvent, useEffect, useState } from "react";

type Score = { id: number; name: string; score: number };

const fallbackScores: Score[] = [
  { id: -1, name: "MIA", score: 12480 },
  { id: -2, name: "KAI", score: 10240 },
  { id: -3, name: "SAM", score: 8900 },
];

export default function LeaderboardApp() {
  const [scores, setScores] = useState<Score[]>(fallbackScores);
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/scores")
      .then((response) =>
        response.ok ? response.json() : Promise.reject(new Error("Scores unavailable")),
      )
      .then((data) => setScores(data.scores))
      .catch(() => {});
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("Saving…");

    const response = await fetch("/api/scores", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, score: Number(score) }),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setMessage(error?.error ?? "The score could not be saved. Please try again.");
      return;
    }

    const data = await response.json();
    setScores(data.scores);
    setName("");
    setScore("");
    setMessage("You’re on the board.");
  }

  return (
    <div className="leaderboardApp appPane">
      <div>
        <p className="appKicker">Experiment 001</p>
        <h1>Score Room</h1>
        <p className="appIntro">
          A tiny persistent leaderboard. The next step is connecting it to a
          playable browser game.
        </p>
      </div>
      <div className="scoreCard">
        <span>LIVE / SCORE ROOM</span>
        <ol>
          {scores.slice(0, 5).map((entry, index) => (
            <li key={entry.id}>
              <i>{String(index + 1).padStart(2, "0")}</i>
              <b>{entry.name}</b>
              <strong>{entry.score.toLocaleString()}</strong>
            </li>
          ))}
        </ol>
        <form onSubmit={submit}>
          <input
            aria-label="Player initials"
            maxLength={12}
            placeholder="INITIALS"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            aria-label="Score"
            min="0"
            max="99999999"
            placeholder="SCORE"
            required
            type="number"
            value={score}
            onChange={(event) => setScore(event.target.value)}
          />
          <button type="submit">
            Submit <b>→</b>
          </button>
        </form>
        <p className="formMessage" aria-live="polite">
          {message || "Enter a score to test the live board."}
        </p>
      </div>
    </div>
  );
}
