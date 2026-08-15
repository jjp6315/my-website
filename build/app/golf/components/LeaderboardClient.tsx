"use client";

import { useEffect, useMemo, useState } from "react";
import { golfCourses } from "../data";
import { buildStandings, formatThru, formatToPar } from "../standings";
import type { GolfHoleScore, GolfScoresResponse } from "../types";

type CourseFilter = "all" | (typeof golfCourses)[number]["id"];

export default function LeaderboardClient() {
  const [scores, setScores] = useState<GolfHoleScore[]>([]);
  const [filter, setFilter] = useState<CourseFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/golf", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Scores are temporarily unavailable.");
        return response.json() as Promise<GolfScoresResponse>;
      })
      .then((data) => setScores(data.scores))
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const visibleScores = useMemo(
    () => filter === "all" ? scores : scores.filter((score) => score.courseId === filter),
    [filter, scores],
  );
  const standings = buildStandings(visibleScores);
  const holes = Array.from({ length: 18 }, (_, index) => index + 1);

  return (
    <>
      <div className="leaderboardControls">
        <label>View
          <select value={filter} onChange={(event) => setFilter(event.target.value as CourseFilter)}>
            <option value="all">Overall · 36 holes</option>
            {golfCourses.map((course) => <option value={course.id} key={course.id}>{course.round} · {course.name}</option>)}
          </select>
        </label>
        <span className="livePill"><i /> LIVE SCORING</span>
      </div>

      {error && <p className="golfAlert">{error} Run the latest D1 migration, then refresh.</p>}

      <section className="leaderBoard" aria-busy={loading}>
        <div className="leaderBoardTitle"><span>THE PARK INVITATIONAL</span><h2>LEADERS</h2><p>{filter === "all" ? "OVERALL" : golfCourses.find((course) => course.id === filter)?.name.toUpperCase()}</p></div>
        <div className="leaderTableScroll">
          <table className="leaderTable">
            <thead><tr><th>POS</th><th>PLAYER</th><th>TOTAL</th><th>THRU</th>{filter !== "all" && holes.map((hole) => <th key={hole}>{hole}</th>)}</tr></thead>
            <tbody>
              {standings.map((standing) => (
                <tr key={standing.player.id}>
                  <td>{standing.position}</td>
                  <th><span className="leaderAvatar">{standing.player.initials}</span>{standing.player.name}</th>
                  <td className={standing.relativeToPar < 0 ? "underPar" : ""}>{formatToPar(standing.relativeToPar, standing.holesPlayed)}</td>
                  <td>{formatThru(standing.holesPlayed)}</td>
                  {filter !== "all" && holes.map((hole) => {
                    const result = visibleScores.find((score) => score.playerId === standing.player.id && score.hole === hole);
                    const course = golfCourses.find((item) => item.id === filter);
                    const difference = result ? result.score - (course?.pars[hole - 1] ?? 0) : 0;
                    return <td key={hole}><span className={difference < 0 ? "birdie" : difference > 0 ? "bogey" : ""}>{result?.score ?? "—"}</span></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="statGrid" aria-label="Tournament statistics">
        {standings.map((standing) => (
          <article key={standing.player.id}>
            <div><span className="leaderAvatar">{standing.player.initials}</span><h3>{standing.player.name}</h3></div>
            <dl>
              <div><dt>Fairways</dt><dd>{percentage(standing.fairways, standing.fairwayChances)}</dd></div>
              <div><dt>GIR</dt><dd>{percentage(standing.greens, standing.holesPlayed)}</dd></div>
              <div><dt>Putts</dt><dd>{standing.holesPlayed ? standing.putts : "—"}</dd></div>
              <div><dt>Penalties</dt><dd>{standing.holesPlayed ? standing.penalties : "—"}</dd></div>
              <div><dt>Bunkers</dt><dd>{standing.holesPlayed ? standing.bunkers : "—"}</dd></div>
            </dl>
          </article>
        ))}
      </section>
    </>
  );
}

function percentage(value: number, total: number) {
  return total ? `${Math.round((value / total) * 100)}%` : "—";
}
