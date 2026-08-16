export default function ResumeApp() {
  return (
    <div className="resumeApp appPane">
      <span className="resumeBadge">PDF</span>
      <div>
        <p className="appKicker">Resume.pdf</p>
        <h1>
          Professional
          <br />
          experience
        </h1>
        <p>
          View my experience, technical background, and selected work.
        </p>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
          Open resume <b aria-hidden="true">↗</b>
        </a>
      </div>
    </div>
  );
}
