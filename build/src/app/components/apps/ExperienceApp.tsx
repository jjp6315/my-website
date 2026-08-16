const roles = [
  {
    period: "2024—NOW",
    title: "Associate Software Engineer",
    company: "Optum",
    description:
      'Full stack engineer working on inter application communication and data pipelines. \
      With experience in front end development.',
  },
  {
    period: "2022, 2023",
    title: "Summer Software Engineering Intern",
    company: "Optum",
    description:
      'Worked on projects emphasizing data driven design and ground up UI development. \
      Gained experience in full stack development and cloud computing.',
  },
  {
    period: "2020-2024",
    title: "Bachelor of Science in Computer Science/Minor in Mathematics",
    company: "Pennsylvania State University",
    description:
      "President of the Penn State Computer Science Club. \
      Graduated with a 3.69 GPA and Dean's List recognitions. \
      Completed coursework in software engineering, neural networks, and data structures.",
  },
];

export default function ExperienceApp() {
  return (
    <div className="experienceApp appPane">
      <p className="appKicker">Work history</p>
      <h1>Experience.log</h1>
      <div className="timeline">
        {roles.map((role) => (
          <article key={role.period}>
            <time>{role.period}</time>
            <div>
              <h2>{role.title}</h2>
              <b>{role.company}</b>
              <p>{role.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
