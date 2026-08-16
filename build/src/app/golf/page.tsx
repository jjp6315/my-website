import { coursePar, golfCourses, golfPlayers } from "./data";

export default function GolfHomePage() {
  return (
    <main>
      <section className="golfHero">
        <div className="golfHeroShade" />
        <div className="golfHeroContent">
          <p className="golfEyebrow">2026 CUM CUP · AUGUST 29–30</p>
          <h1>Two courses.<br />One champion.</h1>
          <p>Annual golf tournament held in West Chester, PA. Golfers from around the nation come to compete.</p>
          <div className="golfHeroActions">
            <a className="golfButton golfButtonGold" href="/golf/leaderboard">View leaderboard</a>
            <a className="golfButton golfButtonGhost" href="/golf/scorecard">Enter a score</a>
          </div>
        </div>
        <div className="golfHeroCard">
          <span>NEXT TEE TIME</span>
          <strong>{golfPlayers[0].teeTime}</strong>
          <p>{golfPlayers[0].group} · {golfCourses[0].name}</p>
        </div>
      </section>

      <section className="tournamentIntro golfSection">
        <div>
          <p className="golfEyebrow">THE WEEKEND AHEAD</p>
          <h2>Welcome to the Cup</h2>
          <p className="golfLead">Follow every group across 36 holes, view tee times, and track the numbers behind each round in one shared tournament home.</p>
        </div>
        <dl className="tournamentFacts">
          <div><dt>Players</dt><dd>{golfPlayers.length}</dd></div>
          <div><dt>Courses</dt><dd>{golfCourses.length}</dd></div>
          <div><dt>Holes</dt><dd>36</dd></div>
          <div><dt>Format</dt><dd>Stroke</dd></div>
        </dl>
      </section>

      <section className="courseFeature golfSection">
        <div className="sectionHeading"><div><p className="golfEyebrow">THE COURSES</p><h2>Two Pristine Locations</h2></div></div>
        <div className="courseGrid">
          {golfCourses.map((course, index) => (
            <article className="courseCard" key={course.id}>
              <span className="courseNumber">0{index + 1}</span>
              <p>{course.round}</p>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <div><span>18 HOLES</span><span>PAR {coursePar(course)}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="golfVideo golfSection" aria-labelledby="tournament-video-title">
        <div className="sectionHeading">
          <p className="golfEyebrow">LAST YEAR&apos;S TOURNAMENT</p>
          <h2 id="tournament-video-title">Relive the Cup</h2>
        </div>
        <div className="golfVideoFrame">
          <iframe
            src="https://www.youtube-nocookie.com/embed/cs-IigySoBw"
            title="Highlights from last year's CUM CUP tournament"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      <section className="golfCallout golfSection">
        <div><p className="golfEyebrow">MEET THE FIELD</p><h2>Explore Players<br />and Previous Winner</h2></div>
        <a className="golfButton golfButtonGold" href="/golf/players">Players & tee times</a>
      </section>
    </main>
  );
}
