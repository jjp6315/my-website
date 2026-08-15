export type DailyBriefStory = {
  section: string;
  headline: string;
  summary: string;
  readingTime: string;
};

export type DailyBrief = {
  edition: string;
  publishedAt: string;
  title: string;
  introduction: string;
  stories: DailyBriefStory[];
  closingPrompt: string;
};

// Temporary source: edit this object manually until scheduled publishing is connected.
export const dailyBrief: DailyBrief = {
  edition: "Morning edition · No. 001",
  publishedAt: "2026-08-15T08:00:00-04:00",
  title: "A quiet briefing for a curious day.",
  introduction:
    "A small collection of ideas worth carrying into the day—technology, design, culture, and one question to keep in the background.",
  stories: [
    {
      section: "Technology",
      headline: "Small software is having a useful moment",
      summary:
        "Personal tools are becoming easier to build, host, and refine. The interesting shift is not only technical—it is that more people can shape software around their own habits.",
      readingTime: "2 min",
    },
    {
      section: "Design",
      headline: "Interfaces can feel familiar without becoming imitation",
      summary:
        "A desktop metaphor works best when it borrows recognizable behavior while keeping navigation direct, accessible, and unmistakably web-native.",
      readingTime: "3 min",
    },
    {
      section: "Build note",
      headline: "Separate the shell from the content",
      summary:
        "Keeping each experiment in its own component makes the surrounding portfolio easier to evolve. The desktop coordinates; each app owns its own story.",
      readingTime: "2 min",
    },
  ],
  closingPrompt:
    "What is one small thing you could build today that would make tomorrow easier?",
};
