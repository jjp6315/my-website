import PlayerPortrait from "../components/PlayerPortrait";
import { golfCourses, golfPlayers } from "../data";

export default function PlayersPage() {
  return (
    <main className="golfPage">
      <header className="golfPageHeader">
        <p className="golfEyebrow">THE FIELD</p>
        <h1>Players & tee times</h1>
        <p>Meet this year&apos;s competitors and see when each group begins its round.</p>
      </header>

      <section className="teeTimeBand" aria-label="Tournament tee time summary">
        {golfCourses.map((course) => (
          <div key={course.id}>
            <span>{course.round}</span>
            <strong>{course.name}</strong>
            <small>First tee · 8:10 AM</small>
          </div>
        ))}
      </section>

      <section className="playerGrid" aria-label="Tournament players">
        {golfPlayers.map((player, index) => (
          <article className="playerCard" key={player.id}>
            <PlayerPortrait player={player} />
            <div className="playerCardBody">
              <div className="playerMeta"><span>🇺🇸 UNITED STATES</span><b>0{index + 1}</b></div>
              <h2>{player.name}</h2>
              <p>{player.hometown}</p>
              <dl>
                <div><dt>Tee time</dt><dd>{player.teeTime}</dd></div>
                <div><dt>Group</dt><dd>{player.group}</dd></div>
                <div><dt>Handicap</dt><dd>{player.handicap}</dd></div>
              </dl>
            </div>
          </article>
        ))}
      </section>

      <aside className="photoNote">
        <span aria-hidden="true">◎</span>
        <div><strong>Ready for your real photos</strong><p>Add images under <code>public/golf/players</code>, then set each player&apos;s <code>photo</code> in <code>app/golf/data.ts</code>.</p></div>
      </aside>
    </main>
  );
}
