const roles = [
  {
    period: "2024—NOW",
    title: "Product Engineer",
    company: "Your current company",
    description:
      "Describe the product, your ownership, and one measurable outcome. Recruiters care most about scope and impact.",
  },
  {
    period: "2022—2024",
    title: "Software Engineer",
    company: "Previous company",
    description:
      "Explain what you built, who it served, and how the work improved a useful metric.",
  },
  {
    period: "EARLIER",
    title: "The origin story",
    company: "Education or first role",
    description:
      "A short line about how you found your way into building software.",
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
