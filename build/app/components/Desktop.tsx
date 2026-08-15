"use client";

import { useEffect, useState } from "react";
import {
  AboutApp,
  BrainBitsApp,
  ExperienceApp,
  LeaderboardApp,
  NotesApp,
  PhotosApp,
  ProjectsApp,
  ResumeApp,
  SkillsApp,
  TerminalApp,
} from "./apps";
import AppIcon from "./desktop/AppIcon";
import DynamicSky from "./desktop/DynamicSky";
import SystemMonitor from "./desktop/SystemMonitor";
import {
  allApps,
  appIds,
  desktopApps,
  dockApps,
  mobileDockApps,
  utilityApps,
  type AppId,
} from "./desktop/appConfig";

export default function Desktop() {
  const [now, setNow] = useState<Date | null>(null);
  const [active, setActive] = useState<AppId | null>(null);

  useEffect(() => {
    const clockStart = window.setTimeout(() => setNow(new Date()), 0);
    const timer = window.setInterval(() => setNow(new Date()), 30_000);

    const syncFromUrl = () => {
      const id = window.location.hash.slice(1) as AppId;
      setActive(appIds.has(id) ? id : null);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
        window.history.pushState({}, "", window.location.pathname);
      }
    };

    const urlStart = window.setTimeout(syncFromUrl, 0);
    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener("hashchange", syncFromUrl);
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(clockStart);
      window.clearTimeout(urlStart);
      window.clearInterval(timer);
      window.removeEventListener("popstate", syncFromUrl);
      window.removeEventListener("hashchange", syncFromUrl);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function openApp(id: AppId) {
    if (id === "leaderboard") {
      window.location.assign("/golf");
      return;
    }

    setActive(id);
    window.history.pushState({ app: id }, "", `#${id}`);
  }

  function closeApp() {
    setActive(null);
    window.history.pushState({}, "", window.location.pathname);
  }

  function appContent(id: AppId) {
    switch (id) {
      case "about":
        return <AboutApp />;
      case "projects":
        return <ProjectsApp />;
      case "experience":
        return <ExperienceApp />;
      case "skills":
        return <SkillsApp />;
      case "leaderboard":
        return <LeaderboardApp />;
      case "brain-bits":
        return <BrainBitsApp />;
      case "photos":
        return <PhotosApp />;
      case "terminal":
        return <TerminalApp onOpenProjects={() => openApp("projects")} />;
      case "notes":
        return <NotesApp />;
      case "resume":
        return <ResumeApp />;
    }
  }

  return (
    <main className="desktop">
      <div className="spaceGlow" aria-hidden="true" />
      <DynamicSky />

      <header className="menuBar">
        <nav aria-label="Desktop menu">
          <button className="osName" onClick={() => openApp("about")}>
            JOHN OS
          </button>
          <span>Finder</span><span>File</span><span>View</span>
          <span>Go</span><span>Window</span><span>Help</span>
        </nav>
        <div className="statusArea">
          <span>▱</span><span>⌁</span><span>◖</span><span>▰</span>
          <time>
            {now
              ? now.toLocaleString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })
              : "Loading time…"}
          </time>
        </div>
      </header>

      <section className="mobileAppGrid" aria-label="Applications">
        {allApps.map((app) => <AppIcon app={app} key={app.id} onOpen={openApp} />)}
      </section>

      <section className="iconColumn leftIcons" aria-label="Portfolio applications">
        {desktopApps.map((app) => <AppIcon app={app} key={app.id} onOpen={openApp} />)}
      </section>
      <section className="iconColumn rightIcons" aria-label="Utility applications">
        {utilityApps.map((app) => <AppIcon app={app} key={app.id} onOpen={openApp} />)}
      </section>

      <SystemMonitor />

      {active && (
        <section
          key={active}
          className={`appWindow windowGlass ${active}Window`}
          aria-label={`${active} window`}
        >
          <div className="windowTitle">
            <div className="trafficLights">
              <button aria-label="Close window" onClick={closeApp} />
              <i /><i />
            </div>
            <strong>{allApps.find((app) => app.id === active)?.label}</strong>
            <span className="windowHint">ESC TO CLOSE</span>
          </div>
          <div className="appScroll">{appContent(active)}</div>
        </section>
      )}

      <nav className="dock desktopDock windowGlass" aria-label="Desktop application dock">
        {dockApps.map((app) => (
          <button
            key={app.id}
            className={`dockIcon ${app.tone} ${active === app.id ? "running" : ""}`}
            onClick={() => openApp(app.id)}
            aria-label={`Open ${app.label}`}
          >
            <span>{app.glyph}</span>
          </button>
        ))}
      </nav>

      <nav
        className="dock mobileDock windowGlass"
        aria-label="Phone application dock"
        style={{ gridTemplateColumns: `repeat(${mobileDockApps.length}, minmax(0, 1fr))` }}
      >
        {mobileDockApps.map((app) => (
          <button
            key={app.id}
            className={`dockIcon ${app.tone} ${active === app.id ? "running" : ""}`}
            onClick={() => openApp(app.id)}
            aria-label={`Open ${app.label}`}
          >
            <span>{app.glyph}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
