export type GolfHoleScore = {
  id: number;
  playerId: string;
  courseId: string;
  hole: number;
  score: number;
  fairwayHit: boolean;
  greenInRegulation: boolean;
  putts: number;
  penalties: number;
  bunkers: number;
  updatedAt: string;
};

export type GolfScoresResponse = {
  scores: GolfHoleScore[];
};
