export type GolfPlayer = {
  id: string;
  name: string;
  initials: string;
  hometown: string;
  handicap: string;
  teeTime: string;
  group: string;
  photo?: string;
};

export type GolfCourse = {
  id: string;
  name: string;
  shortName: string;
  round: string;
  description: string;
  pars: readonly number[];
};

// Replace these sample names and add photo paths such as
// `/golf/players/john.jpg` as your tournament roster becomes final.
export const golfPlayers: readonly GolfPlayer[] = [
  {
    id: "john-park",
    name: "John Park",
    initials: "JP",
    hometown: "New York, NY",
    handicap: "12.4",
    teeTime: "8:10 AM",
    group: "Group 1",
  },
  {
    id: "daniel-kim",
    name: "Daniel Kim",
    initials: "DK",
    hometown: "Boston, MA",
    handicap: "14.1",
    teeTime: "8:10 AM",
    group: "Group 1",
  },
  {
    id: "andrew-lee",
    name: "Andrew Lee",
    initials: "AL",
    hometown: "Jersey City, NJ",
    handicap: "10.8",
    teeTime: "8:20 AM",
    group: "Group 2",
  },
  {
    id: "chris-choi",
    name: "Chris Choi",
    initials: "CC",
    hometown: "Philadelphia, PA",
    handicap: "16.0",
    teeTime: "8:20 AM",
    group: "Group 2",
  },
];

export const golfCourses: readonly GolfCourse[] = [
  {
    id: "azalea",
    name: "Azalea Ridge",
    shortName: "Azalea",
    round: "Round One",
    description: "A generous opening nine gives way to a precise finishing stretch.",
    pars: [4, 5, 4, 3, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 5, 3, 4, 4],
  },
  {
    id: "pine",
    name: "Pine Valley Links",
    shortName: "Pine",
    round: "Round Two",
    description: "Tree-lined fairways, strategic bunkers, and demanding par fives.",
    pars: [4, 4, 3, 5, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4, 3, 5, 4, 4],
  },
];

export function findGolfPlayer(id: string) {
  return golfPlayers.find((player) => player.id === id);
}

export function findGolfCourse(id: string) {
  return golfCourses.find((course) => course.id === id);
}

export function coursePar(course: GolfCourse) {
  return course.pars.reduce((total, par) => total + par, 0);
}
