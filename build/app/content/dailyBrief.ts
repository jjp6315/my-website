export type DailyStory = {
  id: number | null;
  storyDate: string;
  edition: string;
  section: string;
  title: string;
  introduction: string;
  body: string;
  closingPrompt: string;
  readingTime: string;
  isFavorite: boolean;
  publishedAt: string;
};

export type DailyBriefResponse = {
  current: DailyStory;
  favorites: DailyStory[];
};

// The app shows this edition before the first scheduled story has been saved.
export const fallbackDailyStory: DailyStory = {
  id: null,
  storyDate: "2026-08-15",
  edition: "Welcome edition · No. 001",
  section: "Build note",
  title: "A quiet briefing for a curious day.",
  introduction:
    "This is the opening edition of a personal reading archive—a place for one small, original story each day.",
  body:
    "Personal software starts as an answer to a private question. What would I enjoy opening every morning? What could grow slowly, without needing to become a product?\n\nThis little newspaper is one answer. Each day, a background job will write a new story and place it here. The useful part is not only the automation. The archive becomes a record of changing prompts, interests, and experiments.\n\nTomorrow, this space can tell a different story. The shell stays familiar while the collection becomes entirely your own.",
  closingPrompt:
    "What is one small ritual you would enjoy turning into software?",
  readingTime: "1 min read",
  isFavorite: false,
  publishedAt: "2026-08-15T12:00:00.000Z",
};
