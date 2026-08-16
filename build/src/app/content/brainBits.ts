export type BrainBit = {
  id: number | null;
  bitDate: string;
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

export type BrainBitsResponse = {
  current: BrainBit;
  favorites: BrainBit[];
};

// The app shows this edition before the first scheduled Brain Bit has been saved.
export const fallbackBrainBit: BrainBit = {
  id: null,
  bitDate: "2026-08-15",
  edition: "Brain Bits · Welcome edition",
  section: "Build note",
  title: "A quiet briefing for a curious day.",
  introduction:
    "This is the opening edition of a personal learning archive—a place for one small, original Brain Bit each day.",
  body:
    "Personal software starts as an answer to a private question. What would I enjoy opening every morning? What could grow slowly, without needing to become a product?\n\nThis little newspaper is one answer. Each day, a background job will write a new story and place it here. The useful part is not only the automation. The archive becomes a record of changing prompts, interests, and experiments.\n\nTomorrow, this space can tell a different story. The shell stays familiar while the collection becomes entirely your own.",
  closingPrompt:
    "What is one small ritual you would enjoy turning into software?",
  readingTime: "1 min read",
  isFavorite: false,
  publishedAt: "2026-08-15T12:00:00.000Z",
};
