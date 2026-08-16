const skillCards = [
  ["01", "Product thinking", "Turn ambiguity into a testable, shippable path."],
  ["02", "Frontend systems", "Build interfaces that stay coherent as they grow."],
  ["03", "Backend fluency", "Design the small APIs and data models a product needs."],
  ["04", "Creative technology", "Use motion, sound, and interaction with purpose."],
] as const;

export default function SkillsApp() {
  return (
    <div className="skillsApp appPane">
      <p className="appKicker">Capability profiler</p>
      <h1>How I work.</h1>
      <div className="skillCards">
        {skillCards.map(([number, title, description]) => (
          <article key={number}>
            <span>{number}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
