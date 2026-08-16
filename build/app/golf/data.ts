export type GolfPlayer = {
  id: string;
  name: string;
  initials: string;
  hometown: string;
  nationality: {
    countryCode: string;
    countryName: string;
  };
  handicap: string;
  handicapStrokes: number;
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
  strokeIndexes: readonly number[];
  teeTimes?: readonly string[];
};

export const golfPlayers: readonly GolfPlayer[] = [
  {
    id: "john-park",
    name: "John Park",
    initials: "JP",
    hometown: "Boston, MA",
    nationality: { countryCode: "KR", countryName: "South Korea" },
    handicap: "18",
    handicapStrokes: 18,
    teeTime: "2:00 PM",
    group: "Group 1",
    photo: "/golf/john-park.webp",
  },
  {
    id: "matty-scoffone",
    name: "Matty Scoffone (Current Champion)",
    initials: "MS",
    hometown: "Baltimore, MD",
    nationality: { countryCode: "US", countryName: "United States" },
    handicap: "14.1",
    handicapStrokes: 14,
    teeTime: "2:00 PM",
    group: "Group 1",
    photo: "/golf/matty-scoffone.webp",
  },
  {
    id: "andrew-distefano",
    name: "Andrew Distefano",
    initials: "AD",
    hometown: "Penn Oaks, PA",
    nationality: { countryCode: "IT", countryName: "Italy" },
    handicap: "10.8",
    handicapStrokes: 11,
    teeTime: "2:00 PM",
    group: "Group 2",
    photo: "/golf/andrew-distefano.webp",
  },
  {
    id: "jack-szymanski",
    name: "Jack Szymanski",
    initials: "JS",
    hometown: "Philadelphia, PA",
    nationality: { countryCode: "US", countryName: "United States" },
    handicap: "16.0",
    handicapStrokes: 16,
    teeTime: "2:00 PM",
    group: "Group 2",
    photo: "/golf/jack-szymanski.webp",
  },
  {
    id: "matt-bosch",
    name: "Matt Bosch",
    initials: "MB",
    hometown: "West Chester, PA",
    nationality: { countryCode: "US", countryName: "United States" },
    handicap: "16.0",
    handicapStrokes: 16,
    teeTime: "2:00 PM",
    group: "Group 2",
    photo: "/golf/matt-bosch.webp",
  },
  {
    id: "arjun-chaudhary",
    name: "Arjun Chaudhary",
    initials: "AC",
    hometown: "Philadelphia, PA",
    nationality: { countryCode: "IN", countryName: "India" },
    handicap: "16.0",
    handicapStrokes: 16,
    teeTime: "2:00 PM",
    group: "Group 1",
    photo: "/golf/arjun-chaudhary.webp",
  },
  {
    id: "josh-berkowitz",
    name: "Josh Berkowitz (Amateur)",
    initials: "JB",
    hometown: "Pittsburgh, PA",
    nationality: { countryCode: "IL", countryName: "Israel" },
    handicap: "16.0",
    handicapStrokes: 16,
    teeTime: "2:00 PM",
    group: "Group 1",
    photo: "/golf/josh-berkowitz.webp",
  },
  {
    id: "bobby-bosch",
    name: "Bobby Bosch (Amateur)",
    initials: "BB",
    hometown: "West Chester, PA",
    nationality: { countryCode: "US", countryName: "United States" },
    handicap: "16.0",
    handicapStrokes: 16,
    teeTime: "2:00 PM",
    group: "Group 2",
    photo: "/golf/bobby-bosch.webp",
  },
];

export const golfCourses: readonly GolfCourse[] = [
  {
    id: "wyncote",
    name: "Wyncote",
    shortName: "Wyncote",
    round: "Round One",
    description: "A links course pushing golfers to their limits.",
    pars: [5, 3, 4, 4, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 5, 3, 4, 4],
    strokeIndexes: [
      8, 16, 12, 2, 10, 14, 6, 18, 4, 9, 1, 7, 3, 17, 13, 5, 11, 15,
    ],
    teeTimes: ["2:00 PM", "2:10 PM"],
  },
  {
    id: "downingtowncc",
    name: "Downingtown Country Club",
    shortName: "Downingtown CC",
    round: "Round Two",
    description:
      "Tree-lined fairways, strategic bunkers, and demanding par fives. Beautiful finish at the 18th green.",
    pars: [4, 4, 3, 5, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4, 3, 5, 4, 4],
    strokeIndexes: [
      11, 5, 17, 15, 9, 1, 3, 7, 13, 14, 2, 16, 6, 10, 18, 4, 12, 8,
    ],
    teeTimes: ["9:00 AM", "2:10 PM"],
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
