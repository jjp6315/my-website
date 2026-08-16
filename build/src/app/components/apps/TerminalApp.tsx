"use client";

import { FormEvent, useState } from "react";

type TerminalAppProps = {
  onOpenProjects: () => void;
};

const responses: Record<string, string> = {
  help: "Commands: about, projects, skills, contact, clear",
  about: "Product engineer. Curious generalist. Builder of useful, playful things.",
  projects: "Opening /projects…",
  skills: "TypeScript · React · SQL · product thinking · creative code",
  contact: "hello@example.com",
};

export default function TerminalApp({ onOpenProjects }: TerminalAppProps) {
  const [command, setCommand] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "JOHN OS [Version 1.0.0]",
    "Type `help` to explore.",
  ]);

  function runCommand(event: FormEvent) {
    event.preventDefault();
    const input = command.trim().toLowerCase();
    if (!input) return;

    if (input === "clear") {
      setTerminalLines([]);
    } else {
      setTerminalLines((lines) => [
        ...lines,
        `visitor@john-os ~ % ${command}`,
        responses[input] ?? `command not found: ${input}`,
      ]);
    }

    if (input === "projects") window.setTimeout(onOpenProjects, 250);
    setCommand("");
  }

  return (
    <div className="terminalApp">
      <div className="terminalOutput">
        {terminalLines.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
      <form onSubmit={runCommand}>
        <label htmlFor="command">visitor@john-os ~ %</label>
        <input
          id="command"
          autoComplete="off"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
        />
      </form>
    </div>
  );
}
