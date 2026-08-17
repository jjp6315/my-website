"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { golfCourses, playingHandicapForCourse } from "../data";
import { buildStandings, formatThru, formatToPar, handicapStrokesForHole } from "../standings";
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
  const selectedCourse = filter === "all" ? null : golfCourses.find((course) => course.id === filter) ?? null;

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
        <div className="leaderBoardTitle"><span>THE CUM CUP</span><h2>LEADERS</h2><p>{filter === "all" ? "OVERALL" : golfCourses.find((course) => course.id === filter)?.name.toUpperCase()}</p></div>
        <div className="leaderTableScroll">
          <table className={`leaderTable ${filter === "all" ? "leaderTableOverall" : ""}`}>
            <thead><tr><th>POS</th><th>PLAYER</th><th>TOTAL</th><th>THRU</th>{selectedCourse && holes.map((hole) => <Fragment key={hole}><th className="leaderHoleHeader"><span>{hole}</span><small>HCP {selectedCourse.strokeIndexes[hole - 1]}</small></th>{hole === 9 && <th className="leaderSubtotal">FRONT 9</th>}{hole === 18 && <th className="leaderSubtotal">TOTAL</th>}</Fragment>)}</tr></thead>
            <tbody>
              {standings.map((standing) => {
                const playerScores = visibleScores.filter((score) => score.playerId === standing.player.id);
                const playingHandicap = selectedCourse
                  ? playingHandicapForCourse(standing.player, selectedCourse.id)
                  : 0;
                const frontNine = selectedCourse ? scoreTotal(playerScores, selectedCourse, playingHandicap, 1, 9) : null;
                const roundTotal = selectedCourse ? scoreTotal(playerScores, selectedCourse, playingHandicap, 1, 18) : null;

                return <tr key={standing.player.id}>
                  <td>{standing.position}</td>
                  <th>{standing.player.name}</th>
                  <td className={standing.relativeToPar < 0 ? "underPar" : ""}>
                    <b>{formatToPar(standing.relativeToPar, standing.holesPlayed)}</b>
                    <small>Gross {formatToPar(standing.grossRelativeToPar, standing.holesPlayed)}</small>
                  </td>
                  <td>{formatThru(standing.holesPlayed)}</td>
                  {selectedCourse && holes.map((hole) => {
                    const result = visibleScores.find((score) => score.playerId === standing.player.id && score.hole === hole);
                    const handicapStrokes = result
                      ? handicapStrokesForHole(playingHandicap, selectedCourse.strokeIndexes[hole - 1])
                      : 0;
                    const netScore = result ? result.score - handicapStrokes : null;
                    const difference = netScore === null ? 0 : netScore - selectedCourse.pars[hole - 1];
                    return <Fragment key={hole}>
                      <td><span className={scoreMarkerClass(difference)}>{netScore ?? "—"}</span>{result && <small className="grossHoleScore">({result.score})</small>}</td>
                      {hole === 9 && <TotalCell total={frontNine} />}
                      {hole === 18 && <TotalCell total={roundTotal} />}
                    </Fragment>;
                  })}
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </section >

      <section className="statGrid" aria-label="Tournament statistics">
        {standings.map((standing) => (
          <article key={standing.player.id}>
            <div><h3>{standing.player.name}</h3></div>
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

function scoreMarkerClass(difference: number) {
  if (difference === -2) return "eagle";
  if (difference === -1) return "birdie";
  if (difference === 1) return "bogey";
  if (difference === 2) return "doubleBogey";
  return "";
}

type ScoreTotal = { gross: number; net: number };

function scoreTotal(scores: GolfHoleScore[], course: (typeof golfCourses)[number], playingHandicap: number, start: number, end: number): ScoreTotal | null {
  const relevantScores = scores.filter((score) => score.hole >= start && score.hole <= end);
  if (!relevantScores.length) return null;

  return relevantScores.reduce<ScoreTotal>((total, score) => {
    const handicapStrokes = handicapStrokesForHole(playingHandicap, course.strokeIndexes[score.hole - 1]);
    return { gross: total.gross + score.score, net: total.net + score.score - handicapStrokes };
  }, { gross: 0, net: 0 });
}

function TotalCell({ total }: { total: ScoreTotal | null }) {
  return <td className="leaderSubtotal"><b>{total?.net ?? "—"}</b>{total && <small className="grossHoleScore">({total.gross})</small>}</td>;
}
