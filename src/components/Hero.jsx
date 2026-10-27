import { useState, useEffect } from "react";
import { Download, Linkedin, Github, Mail } from "lucide-react";
import { content } from "../data/content";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TypewriterText = ({ fullText }) => {
  const [reduced] = useState(prefersReducedMotion);
  const [text, setText] = useState(() => (reduced ? fullText : ""));

  useEffect(() => {
    if (reduced) return;

    let index = 0;
    let typeWriter;
    const startTyping = setTimeout(() => {
      typeWriter = setInterval(() => {
        index++;
        setText(fullText.slice(0, index));
        if (index >= fullText.length) clearInterval(typeWriter);
      }, 70);
    }, 700);

    return () => {
      clearTimeout(startTyping);
      clearInterval(typeWriter);
    };
  }, [fullText, reduced]);

  return (
    <>
      <span aria-label={fullText}>{text}</span>
      <span className="cursor" aria-hidden="true" />
    </>
  );
};

const Hero = () => {
  const { hero, socials, meta } = content;

  return (
    <section id="inicio" className="hero" aria-label="Presentación">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-text">
            <p className="eyebrow rise" style={{ "--d": "60ms" }}>
              <span>{hero.eyebrow}</span>
              <span className="chip chip--ok">
                <span className="status-dot" aria-hidden="true" />
                {meta.availability}
              </span>
            </p>

            <h1 className="rise" style={{ "--d": "140ms" }}>
              {hero.firstName}
              <br />
              <span className="h1-last">{hero.lastName}</span>
            </h1>

            <p className="prompt rise" style={{ "--d": "240ms" }}>
              <span className="prompt-sign" aria-hidden="true">&gt;</span>
              <TypewriterText fullText={hero.role} />
            </p>

            <p className="hero-desc rise" style={{ "--d": "320ms" }}>
              {hero.description}
            </p>

            <div className="actions rise" style={{ "--d": "400ms" }}>
              <a href={socials.email} className="btn btn--primary">
                <Mail size={15} /> Contactar
              </a>
              <a href={hero.cvLink} download className="btn">
                <Download size={15} /> Descargar CV
              </a>
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
                aria-label="GitHub (se abre en otra pestaña)"
              >
                <Github size={15} /> GitHub
              </a>
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
                aria-label="LinkedIn (se abre en otra pestaña)"
              >
                <Linkedin size={15} /> LinkedIn
              </a>
            </div>
          </div>

          <figure className="photo-panel panel rise" style={{ "--d": "260ms" }}>
            <figcaption className="panel-head">
              <span>~/perfil.webp</span>
            </figcaption>
            <div className="photo-frame">
              <img
                src="/assets/projects/perfil.webp"
                alt="Retrato de Jhefferson Guerrero"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </figure>
        </div>

        <dl className="statgrid rise" style={{ "--d": "480ms" }}>
          {hero.stats.map((stat) => (
            <div key={stat.label} className="stat">
              <dt className="stat-label">{stat.label}</dt>
              <dd className={`stat-value ${stat.tone === "ok" ? "is-ok" : ""}`}>
                {stat.tone === "ok" && <span className="status-dot" aria-hidden="true" />}
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Hero;
