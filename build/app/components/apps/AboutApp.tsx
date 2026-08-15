export default function AboutApp() {
  return (
    <div className="aboutApp appPane">
      <p className="appKicker">Hello, world.</p>
      <h1>
        I turn fuzzy ideas into <em>useful digital things.</em>
      </h1>
      <div className="aboutGrid">
        <p>
          I’m Your Name, a product-minded engineer based in New York. I care
          about fast software, humane interfaces, and details that make a
          product memorable.
        </p>
        <div className="identityCard">
          <span>YN</span>
          <div>
            <b>Your Name</b>
            <small>Product Engineer</small>
            <small className="online">Available for the right role</small>
          </div>
        </div>
      </div>
      <div className="tagRow">
        <span>TypeScript</span>
        <span>React</span>
        <span>SQL</span>
        <span>Creative code</span>
        <span>Photography</span>
      </div>
    </div>
  );
}
