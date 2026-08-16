const projectList = [
  {
    number: "01",
    title: "Neural Network Signature and Number Recognition",
    summary:
      "Configured images to train a Convolution Neural Network model. The model trains on handwritten signature and number images to recognize the author and number.",
    stack: "Stack · To be added",
    tone: "lime",
    url: "https://github.com/EE456FinalProject/ImageClassification",
  },
  {
    number: "02",
    title: "DevPSU Learning Terminal Website",
    summary:
      "Try out my terminal website to learn more about me! Developed in conjunction with Jude, Brian, Alex, and Me.",
    stack: "Stack · To be added",
    tone: "purple",
    url: "https://jjp6315.github.io/",
  },
  {
    number: "03",
    title: "Recishop",
    summary:
      "A shopping list builder that helps people make shopping lists from custom recipes. Worked as a team to develop a full stack web application. Learned valuable innovative motivation and skills",
    stack: "Stack · To be added",
    tone: "orange",
    url: "https://github.com/Recishop/Recishop",
  },
  {
    number: "04",
    title: "Twitter Clone App",
    summary:
      "Built Twitter clone through CodePath's Android University. Coded in Java and used Parse for backend API connection.",
    stack: "Stack · To be added",
    tone: "lime",
    url: "https://github.com/jjp6315/SimpleTweet",
  },
];

export default function ProjectsApp() {
  return (
    <div className="projectsApp appPane">
      <p className="appKicker">Selected work</p>
      <h1>Things I’ve shipped.</h1>
      <div className="projectList">
        {projectList.map((project) => (
          <a
            className={`projectCard ${project.tone}`}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            key={project.number}
          >
            <span>{project.number}</span>
            <div>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <small>{project.stack}</small>
            </div>
            <b aria-hidden="true">↗</b>
          </a>
        ))}
      </div>
    </div>
  );
}
