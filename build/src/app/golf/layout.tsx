import type { Metadata } from "next";
import type { ReactNode } from "react";
import GolfShell from "./components/GolfShell";
import "./golf.css";

export const metadata: Metadata = {
  title: "The CUM CUP",
  description: "Players, tee times, live scoring, and tournament statistics for The CUM CUP.",
};

export default function GolfLayout({ children }: { children: ReactNode }) {
  return <GolfShell>{children}</GolfShell>;
}
