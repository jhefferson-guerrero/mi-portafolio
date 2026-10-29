import { content } from "../data/content";
import Pane from "./Pane";

// Sobre mí: biografía y una línea de tiempo con las tarjetas a ambos lados de la línea central.
// Si el contenido no cabe, el panel hace scroll.
const About = ({ active }) => {
  const { bio, history } = content.about;

  return (
    <Pane id="about" active={active} file="sobre-mi.md">
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

        <section className="timeline" aria-label="Trayectoria">
          <span className="tl-now">actual</span>
          <ol className="tl-list">
            {history.map((entry, i) => (
              <li
                key={entry.title}
                className={`tl-item ${i % 2 === 0 ? "is-left" : "is-right"} ${i === 0 ? "is-current" : ""}`}
              >
                <article className="box tl-card">
                  <div className="box-label">{entry.kind}</div>
                  <div className="box-body">
                    <h3>{entry.title}</h3>
                    <p className="log-org">
                      {entry.org}
                      {entry.note && <span className="badge">{entry.note}</span>}
                    </p>
                    <p className="log-date">{entry.date}</p>
                    {entry.bullets && (
                      <ul className="bullets">
                        {entry.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
                <div className="tl-mark" aria-hidden="true">
                  <span className="tl-node" />
                  <span className="tl-year">{entry.year}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Pane>
  );
};

export default About;
