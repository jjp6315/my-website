import ScorecardForm from "../components/ScorecardForm";

export default function ScorecardPage() {
  return (
    <main className="golfPage scorecardPage">
      <header className="golfPageHeader">
        <p className="golfEyebrow">LIVE SCORING</p>
        <h1>Enter a score</h1>
        <p>Select a player, course, and hole. Previously saved holes load automatically and can be corrected.</p>
      </header>
      <ScorecardForm />
    </main>
  );
}
