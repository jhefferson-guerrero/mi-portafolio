import { useState, useEffect } from "react";
import { Download, Mail } from "lucide-react";
import { content } from "../data/content";
import Pane from "./Pane";

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

const SUGGESTED = ["help", "projects", "neofetch", "sudo hire me"];

// Vista de inicio. `onRun` ejecuta un comando en la consola; `navigate` cambia de vista;
// `openProject` abre un proyecto concreto.
const Hero = ({ active, onRun, navigate, openProject }) => {
  const { hero, socials, meta, projects } = content;

  const facts = [
    ["ubicación", meta.location],
    ["estudios", "UTP · Ing. Software"],
    ["stack", "React · Tailwind"],
    ["shell", `jg-shell ${meta.version}`],
  ];

  return (
    <Pane id="inicio" active={active} file="inicio.md" hint="// bienvenido" home>
      <div className="home">
        <div className="home-main">
        <p className="eyebrow">{hero.eyebrow} · {content.meta.location.toLowerCase()}</p>

        <h1>
          {hero.firstName}
          <br />
          <span className="h1-last">{hero.lastName}</span>
        </h1>

        <p className="prompt">
          <span className="prompt-sign" aria-hidden="true">&gt;</span>
          <TypewriterText fullText={hero.role} />
        </p>

        <p className="hero-desc">{hero.description}</p>

        <div className="actions">
          <button type="button" className="btn btn--primary" onClick={() => navigate("proyectos")}>
            Ver proyectos
          </button>
          <a href={socials.email} className="btn">
            <Mail size={15} /> Contactar
          </a>
          <a href={hero.cvLink} download className="btn">
            <Download size={15} /> CV
          </a>
        </div>

        <div className="hints">
          <span className="hints-label">prueba en la consola:</span>
          {SUGGESTED.map((command) => (
            <button key={command} type="button" className="hint" onClick={() => onRun(command)}>
              {command}
            </button>
          ))}
        </div>
        </div>

        <aside className="home-side" aria-label="Resumen">
          <div className="box">
            <div className="box-label">neofetch</div>
            <dl className="box-body side-facts">
              {facts.map(([key, value]) => (
                <div key={key} className="side-fact">
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              <div className="side-fact">
                <dt>estado</dt>
                <dd className="side-ok">
                  <span className="legend-dot legend-dot--ok" aria-hidden="true" />
                  disponible
                </dd>
              </div>
            </dl>
          </div>

          <div className="box side-projects-box">
            <div className="box-label">ls proyectos/</div>
            <ul className="box-body side-projects">
              {projects.map((project, index) => (
                <li key={project.short}>
                  <button type="button" className="side-project" onClick={() => openProject(index)}>
                    <span className="side-project-name">{project.short}/</span>
                    <span className="side-project-tag">{project.tags[0]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Pane>
  );
};

export default Hero;
