import LeaderboardClient from "../components/LeaderboardClient";

export default function LeaderboardPage() {
  return (
    <main className="golfPage leaderboardPage">
      <header className="golfPageHeader golfPageHeaderSplit">
        <div><p className="golfEyebrow">LIVE TOURNAMENT</p><h1>Leaderboard</h1><p>Scores and performance stats update after every saved hole.</p></div>
        <a className="golfButton golfButtonGreen" href="/golf/scorecard">Enter a score</a>
      </header>
      <LeaderboardClient />
    </main>
  );
}
