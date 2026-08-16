import PlayerPortrait from "../components/PlayerPortrait";
import { golfCourses, golfPlayers } from "../data";

export default function PlayersPage() {
  return (
    <main className="golfPage">
      <header className="golfPageHeader">
        <p className="golfEyebrow">THE FIELD</p>
        <h1>Players & tee times</h1>
        <p>Returning 6 players and 2 amateurs fight for the cup.</p>
      </header>

      <section className="teeTimeBand" aria-label="Tournament tee time summary">
        {golfCourses.map((course) => (
          <div key={course.id}>
            <span>{course.round}</span>
            <strong>{course.name}</strong>
            <small>First tee · {course.teeTimes?.[0] || "TBD"}</small>
          </div>
        ))}
      </section>

      <section className="playerGrid" aria-label="Tournament players">
        {golfPlayers.map((player, index) => (
          <article className="playerCard" key={player.id}>
            <PlayerPortrait player={player} />
            <div className="playerCardBody">
              <div className="playerMeta">
                <span>
                  <span className="playerFlag" role="img" aria-label={`${player.nationality.countryName} flag`}>
                    {countryFlag(player.nationality.countryCode)}
                  </span>
                  {player.nationality.countryName.toUpperCase()}
                </span>
                <b>{String(index + 1).padStart(2, "0")}</b>
              </div>
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
    </main>
  );
}

function countryFlag(countryCode: string) {
  return [...countryCode.toUpperCase()]
    .map((character) => String.fromCodePoint(127397 + character.charCodeAt(0)))
    .join("");
}
