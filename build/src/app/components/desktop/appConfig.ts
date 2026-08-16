export type AppId =
  | "about"
  | "projects"
  | "experience"
  | "skills"
  | "spotify"
  | "leaderboard"
  | "brain-bits"
  | "photos"
  | "terminal"
  | "notes"
  | "resume";

export type DesktopApp = {
  id: AppId;
  label: string;
  icon: string;
  tone: string;
};

export const desktopApps: DesktopApp[] = [
  { id: "about", label: "About Me", icon: "/icon/profile.svg", tone: "blue" },
  { id: "projects", label: "Projects", icon: "/icon/code.svg", tone: "cyan" },
  {
    id: "experience",
    label: "Experience",
    icon: "/icon/experience.svg",
    tone: "indigo",
  },
  { id: "skills", label: "Skills", icon: "/icon/skills.svg", tone: "green" },
  {
    id: "leaderboard",
    label: "Golf Tournament",
    icon: "/icon/trophy.svg",
    tone: "violet",
  },
];

export const utilityApps: DesktopApp[] = [
  { id: "resume", label: "Resume.pdf", icon: "/icon/resume.svg", tone: "pdf" },
  {
    id: "terminal",
    label: "Terminal",
    icon: "/icon/terminal.svg",
    tone: "terminal",
  },
  { id: "photos", label: "Photos", icon: "/icon/camera.svg", tone: "photo" },
  { id: "notes", label: "Notes.txt", icon: "/icon/notes.svg", tone: "paper" },
  {
    id: "brain-bits",
    label: "Brain Bits",
    icon: "/icon/brain.svg",
    tone: "news",
  },
  {
    id: "spotify",
    label: "Spotify",
    icon: "/icon/spotify.svg",
    tone: "spotify",
  },
];

export const allApps = [...desktopApps, ...utilityApps];
export const appIds = new Set<AppId>(allApps.map((app) => app.id));

export const dockApps = [
  desktopApps[0],
  desktopApps[1],
  desktopApps[2],
  utilityApps[1],
  desktopApps[4],
  utilityApps[2],
  utilityApps[3],
  utilityApps[4],
  utilityApps[5],
];

// Edit this list to choose which apps appear in the phone dock.
// The order here is also the left-to-right order in the dock.
export const mobileDockAppIds: AppId[] = [
  "about",
  "projects",
  "leaderboard",
  "brain-bits",
];

export const mobileDockApps = mobileDockAppIds.map((id) => {
  const app = allApps.find((item) => item.id === id);
  if (!app) throw new Error(`Unknown mobile dock app: ${id}`);
  return app;
});
