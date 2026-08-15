export default function ResumeApp() {
  return (
    <div className="resumeApp appPane">
      <span className="resumeBadge">PDF</span>
      <div>
        <p className="appKicker">Resume.pdf</p>
        <h1>
          Your experience,
          <br />
          one page.
        </h1>
        <p>
          Add your real resume as <code>public/resume.pdf</code>. This button
          will then open the PDF in a new tab.
        </p>
        <button type="button" disabled>
          Resume not uploaded yet
        </button>
      </div>
    </div>
  );
}
