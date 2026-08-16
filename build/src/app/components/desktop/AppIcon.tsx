import type { AppId, DesktopApp } from "./appConfig";
import AppGlyph from "./AppGlyph";

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
      <span className={`appGlyph ${app.tone}`}>
        <AppGlyph icon={app.icon} />
      </span>
      <b>{app.label}</b>
    </button>
  );
}
