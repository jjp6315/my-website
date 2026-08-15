import { golfCourses, golfPlayers } from "./data";
import type { GolfHoleScore } from "./types";

export type GolfStanding = {
  player: (typeof golfPlayers)[number];
  position: number;
  holesPlayed: number;
  totalStrokes: number;
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
    const totalStrokes = playerScores.reduce((total, score) => total + score.score, 0);

    return {
      player,
      position: 0,
      holesPlayed: playerScores.length,
      totalStrokes,
      relativeToPar: totalStrokes - parPlayed,
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
    return a.relativeToPar - b.relativeToPar || a.totalStrokes - b.totalStrokes;
  });

  return standings.map((standing, index) => ({ ...standing, position: index + 1 }));
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
