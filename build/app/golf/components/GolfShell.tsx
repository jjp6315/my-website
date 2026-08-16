import Link from "next/link";
import type { ReactNode } from "react";
import ScoreTicker from "./ScoreTicker";

const navigation = [
  { href: "/golf", label: "Tournament" },
  { href: "/golf/players", label: "Players & Tee Times" },
  { href: "/golf/leaderboard", label: "Leaderboard" },
  { href: "/golf/scorecard", label: "Enter Score" },
];

export default function GolfShell({ children }: { children: ReactNode }) {
  return (
    <div className="golfSite">
      <ScoreTicker />
      <header className="golfHeader">
        <Link className="golfBack" href="/" aria-label="Back to John's OS">
          <span aria-hidden="true">←</span> JOHN&apos;S OS
        </Link>
        <Link className="golfBrand" href="/golf" aria-label="The West Chester Ultimate Masters Cup home">
          <span className="golfBrandMark" aria-hidden="true"><i /></span>
          <span><b>The CUM CUP</b></span>
        </Link>
        <nav className="golfNav" aria-label="Tournament navigation">
          {navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>
      </header>
      {children}
      <footer className="golfFooter">
        <div className="golfBrand golfBrandFooter"><span className="golfBrandMark" aria-hidden="true"><i /></span><span><b>C.U.M</b><i>Cup</i></span></div>
        <p>Annual duel of the best strokers.</p>
        <Link href="/">Return to John&apos;s OS</Link>
      </footer>
    </div>
  );
}
