const projects = [
  {
    number: "01",
    title: "Realtime Score Room",
    summary: "A durable leaderboard for small browser games.",
    stack: "React · D1 · Workers",
    tone: "lime",
  },
  {
    number: "02",
    title: "Desktop Arcade",
    summary: "Tiny games built to make the web feel playful again.",
    stack: "Canvas · TypeScript",
    tone: "purple",
  },
  {
    number: "03",
    title: "Field Notes",
    summary: "A quiet home for photographs and observations.",
    stack: "Photography · Web",
    tone: "orange",
  },
];

export default function ProjectsApp() {
  return (
    <div className="projectsApp appPane">
      <p className="appKicker">Selected work / 2024—now</p>
      <h1>Things I’ve shipped.</h1>
      <div className="projectList">
        {projects.map((project) => (
          <article className={project.tone} key={project.number}>
            <span>{project.number}</span>
            <div>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <small>{project.stack}</small>
            </div>
            <b>↗</b>
          </article>
        ))}
      </div>
    </div>
  );
}
