export type AppId =
  | "about"
  | "projects"
  | "experience"
  | "skills"
  | "leaderboard"
  | "brain-bits"
  | "photos"
  | "terminal"
  | "notes"
  | "resume";

export type DesktopApp = {
  id: AppId;
  label: string;
  glyph: string;
  tone: string;
};

export const desktopApps: DesktopApp[] = [
  { id: "about", label: "About Me", glyph: "●", tone: "blue" },
  { id: "projects", label: "Projects", glyph: "</>", tone: "cyan" },
  { id: "experience", label: "Experience", glyph: "▣", tone: "indigo" },
  { id: "skills", label: "Skills", glyph: "✦", tone: "green" },
  { id: "leaderboard", label: "Golf Tournament", glyph: "▥", tone: "violet" },
];

export const utilityApps: DesktopApp[] = [
  { id: "resume", label: "Resume.pdf", glyph: "PDF", tone: "pdf" },
  { id: "terminal", label: "Terminal", glyph: ">_", tone: "terminal" },
  { id: "photos", label: "Photos", glyph: "◒", tone: "photo" },
  { id: "notes", label: "Notes.txt", glyph: "≡", tone: "paper" },
];

export const brainBitsApp: DesktopApp = {
  id: "brain-bits",
  label: "Brain Bits",
  glyph: "◉",
  tone: "news",
};

export const allApps = [...desktopApps, ...utilityApps, brainBitsApp];
export const appIds = new Set<AppId>(allApps.map((app) => app.id));

export const dockApps = [
  desktopApps[0],
  desktopApps[1],
  desktopApps[2],
  utilityApps[1],
  desktopApps[4],
  utilityApps[2],
  utilityApps[3],
  brainBitsApp,
];
