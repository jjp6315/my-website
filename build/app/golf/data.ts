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

export const golfPlayers: readonly GolfPlayer[] = [
  {
    id: "john-park",
    name: "John Park",
    initials: "JP",
    hometown: "Boston, MA",
    nationality: { countryCode: "KR", countryName: "South Korea" },
    handicap: "18",
    teeTime: "8:10 AM",
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
    teeTime: "8:10 AM",
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
    teeTime: "8:20 AM",
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
    teeTime: "8:20 AM",
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
    teeTime: "8:20 AM",
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
    teeTime: "8:20 AM",
    group: "Group 2",
    photo: "/golf/arjun-chaudhary.webp",
  },
  {
    id: "josh-berkowitz",
    name: "Josh Berkowitz (Amateur)",
    initials: "JB",
    hometown: "Pittsburgh, PA",
    nationality: { countryCode: "IL", countryName: "Israel" },
    handicap: "16.0",
    teeTime: "8:20 AM",
    group: "Group 2",
    photo: "/golf/josh-berkowitz.webp",
  },
  {
    id: "bobby-bosch",
    name: "Bobby Bosch (Amateur)",
    initials: "BB",
    hometown: "West Chester, PA",
    nationality: { countryCode: "US", countryName: "United States" },
    handicap: "16.0",
    teeTime: "8:20 AM",
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
    pars: [4, 5, 4, 3, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 5, 3, 4, 4],
  },
  {
    id: "downingtowncc",
    name: "Downingtown Country Club",
    shortName: "Downingtown CC",
    round: "Round Two",
    description:
      "Tree-lined fairways, strategic bunkers, and demanding par fives. Beautiful finish at the 18th green.",
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
