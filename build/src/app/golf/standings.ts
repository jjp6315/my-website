import { golfCourses, golfPlayers } from "./data";
import type { GolfHoleScore } from "./types";

export type GolfStanding = {
  player: (typeof golfPlayers)[number];
  position: number;
  holesPlayed: number;
  grossStrokes: number;
  netStrokes: number;
  handicapStrokesApplied: number;
  grossRelativeToPar: number;
  relativeToPar: number;
  fairways: number;
  fairwayChances: number;
  greens: number;
  putts: number;
  penalties: number;
  bunkers: number;
};

export function buildStandings(scores: GolfHoleScore[]): GolfStanding[] {
  const standings = golfPlayers.map((player) => {
    const playerScores = scores.filter((score) => score.playerId === player.id);
    const parPlayed = playerScores.reduce((total, score) => {
      const course = golfCourses.find((item) => item.id === score.courseId);
      return total + (course?.pars[score.hole - 1] ?? 0);
    }, 0);
    const parFourOrFiveScores = playerScores.filter((score) => {
      const course = golfCourses.find((item) => item.id === score.courseId);
      return (course?.pars[score.hole - 1] ?? 0) > 3;
    });
    const grossStrokes = playerScores.reduce((total, score) => total + score.score, 0);
    const handicapStrokesApplied = playerScores.reduce((total, score) => {
      const course = golfCourses.find((item) => item.id === score.courseId);
      return total + (course ? handicapStrokesForHole(player.handicapStrokes, course.strokeIndexes[score.hole - 1]) : 0);
    }, 0);
    const netStrokes = grossStrokes - handicapStrokesApplied;

    return {
      player,
      position: 0,
      holesPlayed: playerScores.length,
      grossStrokes,
      netStrokes,
      handicapStrokesApplied,
      grossRelativeToPar: grossStrokes - parPlayed,
      relativeToPar: netStrokes - parPlayed,
      fairways: parFourOrFiveScores.filter((score) => score.fairwayHit).length,
      fairwayChances: parFourOrFiveScores.length,
      greens: playerScores.filter((score) => score.greenInRegulation).length,
      putts: playerScores.reduce((total, score) => total + score.putts, 0),
      penalties: playerScores.reduce((total, score) => total + score.penalties, 0),
      bunkers: playerScores.reduce((total, score) => total + score.bunkers, 0),
    };
  });

  standings.sort((a, b) => {
    if (a.holesPlayed === 0 && b.holesPlayed > 0) return 1;
    if (b.holesPlayed === 0 && a.holesPlayed > 0) return -1;
    return a.relativeToPar - b.relativeToPar || a.netStrokes - b.netStrokes || a.grossStrokes - b.grossStrokes;
  });

  return standings.map((standing, index) => ({ ...standing, position: index + 1 }));
}

export function handicapStrokesForHole(playingHandicap: number, strokeIndex: number) {
  if (!Number.isFinite(playingHandicap) || playingHandicap <= 0 || !strokeIndex) return 0;
  return Math.floor(playingHandicap / 18) + (strokeIndex <= playingHandicap % 18 ? 1 : 0);
}

export function formatToPar(value: number, holesPlayed: number) {
  if (holesPlayed === 0) return "—";
  if (value === 0) return "E";
  return value > 0 ? `+${value}` : String(value);
}

export function formatThru(holesPlayed: number) {
  if (holesPlayed === 0) return "—";
  if (holesPlayed === 36) return "F";
  if (holesPlayed > 18) return `R2 · ${holesPlayed - 18}`;
  if (holesPlayed === 18) return "R1 · F";
  return String(holesPlayed);
}
