const skills = [
  ["Product engineering", 88, "green"],
  ["TypeScript", 84, "blue"],
  ["React", 82, "cyan"],
  ["Creative code", 76, "violet"],
  ["Systems thinking", 91, "amber"],
] as const;

const birthDate = new Date(2001, 5, 28);
const today = new Date();

let age = today.getFullYear() - birthDate.getFullYear();

const birthdayHasPassed =
  today.getMonth() > birthDate.getMonth() ||
  (today.getMonth() === birthDate.getMonth() &&
    today.getDate() >= birthDate.getDate());

if (!birthdayHasPassed) {
  age--;
}

export default function SystemMonitor() {
  return (
    <section className="monitor windowGlass" aria-label="System monitor">
      <div className="windowTitle">
        <div className="trafficLights"><i /><i /><i /></div>
        <strong>System Monitor</strong>
        <span />
      </div>
      <div className="monitorBody">
        <dl className="systemStats">
          <div><dt><i>◷</i> Uptime</dt><dd>Always learning</dd></div>
          <div><dt><i>▧</i> Current process</dt><dd>Training in Soccer</dd></div>
          <div><dt><i>◇</i> Background</dt><dd>Photos, Studying, Ideas</dd></div>
          <div><dt><i>◉</i> Memory usage</dt><dd>{age} years of HDD</dd></div>
        </dl>
        <div className="skillBars">
          {skills.map(([label, value, color]) => (
            <div className="skillRow" key={label}>
              <b>{label}</b>
              <span className="barTrack"><i className={color} style={{ width: `${value}%` }} /></span>
              <em>{value}%</em>
            </div>
          ))}
        </div>
        <p className="monitorMotto">Code. Learn. Build. Play. Repeat.</p>
      </div>
    </section>
  );
}
