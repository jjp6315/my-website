export default function AboutApp() {
  return (
    <div className="aboutApp appPane">
      <p className="appKicker">Hello</p>
      <h1>
        I learn about the world through <em> technology</em>
      </h1>
      <div className="aboutGrid">
        <p>
          I am a Software Engineer based in Boston. My coding ideology is to build software that
          starts as an idea and grows into a product that is useful to people.
        </p>
        <div className="identityCard">
          <span>JP</span>
          <div>
            <b>Ji Woong John Park</b>
            <small>Software Engineer</small>
            <small className="online">Online</small>
          </div>
        </div>
      </div>
      <div className="tagRow">
        <span>TypeScript</span>
        <span>React</span>
        <span>SQL</span>
        <span>VB.Net</span>
        <span>Python</span>
        <span>C#</span>
      </div>
    </div>
  );
}
