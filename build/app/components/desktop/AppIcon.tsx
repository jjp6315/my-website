import type { AppId, DesktopApp } from "./appConfig";

type AppIconProps = {
  app: DesktopApp;
  onOpen: (id: AppId) => void;
};

export default function AppIcon({ app, onOpen }: AppIconProps) {
  return (
    <button
      className="desktopIcon"
      onClick={() => onOpen(app.id)}
      aria-label={`Open ${app.label}`}
    >
      <span className={`appGlyph ${app.tone}`}>{app.glyph}</span>
      <b>{app.label}</b>
    </button>
  );
}
