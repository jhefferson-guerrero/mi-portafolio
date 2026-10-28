import { content } from "../data/content";
import Pane from "./Pane";

const About = ({ active }) => {
  const { bio, metrics, history } = content.about;

  return (
    <Pane id="about" active={active} file="sobre-mi.md" hint="// quién soy" fill>
      <div className="about-grid">
        <article className="box">
          <div className="box-label">bio.md</div>
          <div className="box-body prose">
            {bio.map((paragraph, i) => (
              <p key={i}>
                {paragraph.map((part, j) =>
                  part.strong ? <strong key={j}>{part.text}</strong> : part.text
                )}
              </p>
            ))}
          </div>
        </article>

        <ul className="box metrics">
          {metrics.map((metric) => (
            <li key={metric.value} className="metric">
              <span className="metric-num">{metric.value}</span>
              <span className="metric-label">{metric.label}</span>
            </li>
          ))}
        </ul>

        <div className="box about-history">
          <div className="box-label">historial.log</div>
          <ol className="box-body log">
            {history.map((entry, i) => (
              <li key={entry.title} className={`log-item ${i === 0 ? "is-current" : ""}`}>
                <span className="log-dot" aria-hidden="true" />
                <div className="log-body">
                  <div className="log-head">
                    <h3>{entry.title}</h3>
                    <p className="log-org">
                      {entry.org}
                      {entry.note && <span className="badge">{entry.note}</span>}
                    </p>
                    {entry.links && (
                      <p className="inline-links">
                        {entry.links.map((link) => (
                          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                            {link.label} ↗
                          </a>
                        ))}
                      </p>
                    )}
                    <p className="log-date">{entry.date}</p>
                  </div>

                  {entry.bullets && (
                    <ul className="bullets">
                      {entry.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Pane>
  );
};

export default About;
