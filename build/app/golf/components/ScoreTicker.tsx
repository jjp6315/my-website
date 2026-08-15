"use client";

import { useEffect, useState } from "react";
import { buildStandings, formatThru, formatToPar } from "../standings";
import type { GolfHoleScore, GolfScoresResponse } from "../types";

export default function ScoreTicker() {
  const [scores, setScores] = useState<GolfHoleScore[]>([]);

  useEffect(() => {
    fetch("/api/golf", { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<GolfScoresResponse> : null)
      .then((data) => data && setScores(data.scores))
      .catch(() => undefined);
  }, []);

  const standings = buildStandings(scores);

  return (
    <aside className="golfTicker" aria-label="Live tournament scores">
      <LinkToLeaderboard />
      <div className="golfTickerTrack">
        {standings.map((standing) => (
          <div className="tickerPlayer" key={standing.player.id}>
            <span className="tickerPosition">{standing.position}</span>
            <span className="tickerAvatar">{standing.player.initials}</span>
            <span className="tickerIdentity"><b>{standing.player.name}</b><small>{formatThru(standing.holesPlayed)}</small></span>
            <strong className={standing.relativeToPar < 0 ? "underPar" : ""}>{formatToPar(standing.relativeToPar, standing.holesPlayed)}</strong>
          </div>
        ))}
      </div>
    </aside>
  );
}

function LinkToLeaderboard() {
  return <a className="tickerRound" href="/golf/leaderboard"><b>R2</b><span>LIVE</span></a>;
}
