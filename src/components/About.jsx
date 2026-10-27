import { content } from "../data/content";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const About = () => {
  const { bio, metrics, history } = content.about;

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHead index="02" id="about-title" title="sobre mí" hint="// quién soy" />

        <div className="about-grid">
          <div className="about-col">
            <Reveal className="about-bio-wrap">
              <article className="panel">
                <div className="panel-head"><span>~/bio.md</span></div>
                <div className="panel-body prose">
                  {bio.map((paragraph, i) => (
                    <p key={i}>
                      {paragraph.map((part, j) =>
                        part.strong ? <strong key={j}>{part.text}</strong> : part.text
                      )}
                    </p>
                  ))}
                </div>
              </article>
            </Reveal>

            <Reveal delay={80}>
              <ul className="panel metrics">
                {metrics.map((metric) => (
                  <li key={metric.value} className="metric">
                    <span className="metric-num">{metric.value}</span>
                    <span className="metric-label">{metric.label}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="panel">
              <div className="panel-head"><span>~/historial.log</span></div>
              <ol className="panel-body log">
                {history.map((entry, i) => (
                  <li key={entry.title} className={`log-item ${i === 0 ? "is-current" : ""}`}>
                    <span className="log-dot" aria-hidden="true" />
                    <div className="log-body">
                      <p className="log-date">{entry.date}</p>
                      <h3>{entry.title}</h3>
                      <p className="log-org">
                        {entry.org}
                        {entry.note && <span className="badge">{entry.note}</span>}
                      </p>

                      {entry.bullets && (
                        <ul className="bullets">
                          {entry.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      )}

                      {entry.links && (
                        <p className="inline-links">
                          {entry.links.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.label} ↗
                            </a>
                          ))}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;
