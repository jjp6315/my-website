"use client";

import { useEffect, useMemo, useState } from "react";
import { golfCourses, golfPlayers } from "../data";
import { handicapStrokesForHole } from "../standings";
import type { GolfHoleScore, GolfScoresResponse } from "../types";

type FormState = {
  score: number;
  fairwayHit: boolean;
  greenInRegulation: boolean;
  putts: number;
  penalties: number;
  bunkers: number;
};

const emptyForm: FormState = { score: 4, fairwayHit: false, greenInRegulation: false, putts: 2, penalties: 0, bunkers: 0 };

export default function ScorecardForm() {
  const [playerId, setPlayerId] = useState(golfPlayers[0].id);
  const [courseId, setCourseId] = useState(golfCourses[0].id);
  const [hole, setHole] = useState(1);
  const [scores, setScores] = useState<GolfHoleScore[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const course = golfCourses.find((item) => item.id === courseId) ?? golfCourses[0];
  const player = golfPlayers.find((item) => item.id === playerId) ?? golfPlayers[0];
  const handicapStrokes = handicapStrokesForHole(player.handicapStrokes, course.strokeIndexes[hole - 1]);
  const netScore = form.score - handicapStrokes;
  const selectedScore = useMemo(
    () => scores.find((score) => score.playerId === playerId && score.courseId === courseId && score.hole === hole),
    [courseId, hole, playerId, scores],
  );

  useEffect(() => {
    fetch("/api/golf", { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<GolfScoresResponse> : null)
      .then((data) => {
        if (!data) return;
        setScores(data.scores);
        applySelection(playerId, courseId, hole, data.scores);
      })
      .catch(() => setStatus("Scores could not be loaded. Check your local D1 migration."));
    // The initial player, course, and hole are intentionally loaded once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applySelection(nextPlayerId: string, nextCourseId: string, nextHole: number, availableScores = scores) {
    const saved = availableScores.find((score) => score.playerId === nextPlayerId && score.courseId === nextCourseId && score.hole === nextHole);
    const nextCourse = golfCourses.find((item) => item.id === nextCourseId) ?? golfCourses[0];
    if (saved) {
      setForm({
        score: saved.score,
        fairwayHit: saved.fairwayHit,
        greenInRegulation: saved.greenInRegulation,
        putts: saved.putts,
        penalties: saved.penalties,
        bunkers: saved.bunkers,
      });
    } else {
      setForm({ ...emptyForm, score: nextCourse.pars[nextHole - 1] });
    }
    setStatus("");
  }

  function choosePlayer(nextPlayerId: string) {
    setPlayerId(nextPlayerId);
    applySelection(nextPlayerId, courseId, hole);
  }

  function chooseCourse(nextCourseId: string) {
    setCourseId(nextCourseId);
    applySelection(playerId, nextCourseId, hole);
  }

  function chooseHole(nextHole: number) {
    setHole(nextHole);
    applySelection(playerId, courseId, nextHole);
  }

  async function saveScore(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/golf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ playerId, courseId, hole, ...form }),
      });
      const data = await response.json() as GolfScoresResponse & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "The score could not be saved.");
      setScores(data.scores);
      window.dispatchEvent(new Event("golf:scores-updated"));
      setStatus(selectedScore ? "Hole updated." : "Hole saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The score could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  const playerCourseScores = scores.filter((score) => score.playerId === playerId && score.courseId === courseId);
  const frontTotal = totalForRange(playerCourseScores, 1, 9, player.handicapStrokes, course.strokeIndexes);
  const backTotal = totalForRange(playerCourseScores, 10, 18, player.handicapStrokes, course.strokeIndexes);

  return (
    <div className="scorecardLayout">
      <aside className="roundSetup">
        <p className="golfEyebrow">ROUND SETUP</p>
        <label>Player<select value={playerId} onChange={(event) => choosePlayer(event.target.value)}>{golfPlayers.map((player) => <option value={player.id} key={player.id}>{player.name}</option>)}</select></label>
        <label>Course<select value={courseId} onChange={(event) => chooseCourse(event.target.value)}>{golfCourses.map((item) => <option value={item.id} key={item.id}>{item.round} · {item.name}</option>)}</select></label>
        <div className="roundProgress"><span><b>{playerCourseScores.length}</b> / 18 holes</span><div><i style={{ width: `${(playerCourseScores.length / 18) * 100}%` }} /></div></div>
        <dl><div><dt>Playing handicap</dt><dd>{player.handicapStrokes}</dd></div><div><dt>Front nine · net (gross)</dt><dd>{formatTotals(frontTotal)}</dd></div><div><dt>Back nine · net (gross)</dt><dd>{formatTotals(backTotal)}</dd></div><div><dt>Round · net (gross)</dt><dd>{formatCombinedTotals(frontTotal, backTotal)}</dd></div></dl>
      </aside>

      <section className="scoreEntry">
        <div className="holePicker" aria-label="Choose a hole">
          {course.pars.map((par, index) => {
            const number = index + 1;
            const completed = playerCourseScores.some((score) => score.hole === number);
            return <button type="button" className={`${hole === number ? "active" : ""} ${completed ? "complete" : ""}`} onClick={() => chooseHole(number)} key={number}><b>{number}</b><small>PAR {par}</small></button>;
          })}
        </div>

        <form onSubmit={saveScore} className="holeForm">
          <header><div><p>{course.name.toUpperCase()}</p><h2>Hole {hole}</h2></div><span>PAR <b>{course.pars[hole - 1]}</b></span></header>
          <div className="scoreStepper"><span>Gross score</span><button type="button" onClick={() => setForm((current) => ({ ...current, score: Math.max(1, current.score - 1) }))} aria-label="Decrease score">−</button><strong>{form.score}</strong><button type="button" onClick={() => setForm((current) => ({ ...current, score: Math.min(15, current.score + 1) }))} aria-label="Increase score">+</button><em>NET {netScore} · {scoreLabel(netScore - course.pars[hole - 1])}{handicapStrokes > 0 ? ` · −${handicapStrokes}` : ""}</em></div>

          <fieldset className="statChecks"><legend>Accuracy</legend><label className={form.fairwayHit ? "checked" : ""}><input type="checkbox" checked={form.fairwayHit} onChange={(event) => setForm((current) => ({ ...current, fairwayHit: event.target.checked }))} /><span>Fairway hit</span><small>Drive finished in fairway</small></label><label className={form.greenInRegulation ? "checked" : ""}><input type="checkbox" checked={form.greenInRegulation} onChange={(event) => setForm((current) => ({ ...current, greenInRegulation: event.target.checked }))} /><span>Green in regulation</span><small>Reached green at least two under par</small></label></fieldset>

          <fieldset className="numberStats"><legend>Hole statistics</legend><NumberStat label="Putts" value={form.putts} setValue={(value) => setForm((current) => ({ ...current, putts: value }))} /><NumberStat label="Penalties" value={form.penalties} setValue={(value) => setForm((current) => ({ ...current, penalties: value }))} /><NumberStat label="Bunkers" value={form.bunkers} setValue={(value) => setForm((current) => ({ ...current, bunkers: value }))} /></fieldset>

          <div className="scoreSubmit"><p className={status.includes("saved") || status.includes("updated") ? "success" : ""}>{status || (selectedScore ? "This hole already has a score. Saving will update it." : "All players can update this shared scorecard.")}</p><button className="golfButton golfButtonGreen" disabled={saving}>{saving ? "Saving…" : selectedScore ? "Update hole" : "Save hole"}</button></div>
        </form>
      </section>
    </div>
  );
}

function NumberStat({ label, value, setValue }: { label: string; value: number; setValue: (value: number) => void }) {
  return <label><span>{label}</span><button type="button" onClick={() => setValue(Math.max(0, value - 1))}>−</button><b>{value}</b><button type="button" onClick={() => setValue(Math.min(10, value + 1))}>+</button></label>;
}

type ScoreTotals = { gross: number; net: number };

function totalForRange(scores: GolfHoleScore[], start: number, end: number, playingHandicap: number, strokeIndexes: readonly number[]): ScoreTotals | null {
  const relevant = scores.filter((score) => score.hole >= start && score.hole <= end);
  if (!relevant.length) return null;
  const gross = relevant.reduce((total, score) => total + score.score, 0);
  const strokes = relevant.reduce((total, score) => total + handicapStrokesForHole(playingHandicap, strokeIndexes[score.hole - 1]), 0);
  return { gross, net: gross - strokes };
}

function formatTotals(totals: ScoreTotals | null) {
  return totals ? `${totals.net} (${totals.gross})` : "—";
}

function formatCombinedTotals(front: ScoreTotals | null, back: ScoreTotals | null) {
  if (!front && !back) return "—";
  return `${(front?.net ?? 0) + (back?.net ?? 0)} (${(front?.gross ?? 0) + (back?.gross ?? 0)})`;
}

function scoreLabel(relative: number) {
  if (relative <= -2) return "Eagle";
  if (relative === -1) return "Birdie";
  if (relative === 0) return "Par";
  if (relative === 1) return "Bogey";
  return `+${relative}`;
}
