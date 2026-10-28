import { useState, useRef } from "react";
import { content } from "../data/content";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const pad = (n) => String(n).padStart(2, "0");

const ProjectDetail = ({ project, index, selected }) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article
      id={`project-panel-${index}`}
      role="tabpanel"
      aria-labelledby={`project-tab-${index}`}
      className={`project ${selected ? "is-selected" : ""}`}
    >
      <div className="project-thumb">
        {imageFailed ? (
          <div className="thumb-fallback" role="img" aria-label={`Vista previa pendiente de ${project.title}`}>
            <span>&lt;{project.short} /&gt;</span>
          </div>
        ) : (
          <img
            src={project.image}
            alt={`Captura del proyecto ${project.title}`}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>

      <div className="project-body">
        <div className="project-top">
          <h3>{project.title}</h3>
          <span className={`badge ${project.link ? "badge--live" : ""}`}>
            {project.link ? "en línea" : "solo código"}
          </span>
        </div>

        <p className="project-desc">{project.desc}</p>

        {project.highlights && (
          <ul className="bullets">
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        {project.result && (
          <p className="project-result">
            <span className="arrow" aria-hidden="true">→</span> {project.result}
          </p>
        )}

        <ul className="tag-row">
          {project.tags.map((tag) => (
            <li key={tag} className="tag">{tag}</li>
          ))}
        </ul>

        <div className="project-actions">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--accent"
              aria-label={`Ver demo de ${project.title} (se abre en otra pestaña)`}
            >
              Ver demo ↗
            </a>
          )}
          {project.code && (
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              aria-label={`Ver código de ${project.title} (se abre en otra pestaña)`}
            >
              Código ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

const Projects = () => {
  const { projects } = content;
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef([]);

  const select = (index) => {
    setSelected(index);
    tabRefs.current[index]?.focus();
  };

  // Teclado de pestañas: flechas, Inicio y Fin.
  const onKeyDown = (event) => {
    const last = projects.length - 1;
    const keys = {
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    select(keys[event.key]);
  };

  return (
    <section id="proyectos" className="section" aria-labelledby="proyectos-title">
      <div className="container">
        <SectionHead index="04" id="proyectos-title" title="proyectos" hint="// trabajo real, en producción" />

        <Reveal>
          <div className="panel">
            <div className="tabs" role="tablist" aria-label="Proyectos" onKeyDown={onKeyDown}>
              {projects.map((project, i) => (
                <button
                  key={project.title}
                  ref={(node) => { tabRefs.current[i] = node; }}
                  type="button"
                  role="tab"
                  id={`project-tab-${i}`}
                  aria-selected={selected === i}
                  aria-controls={`project-panel-${i}`}
                  tabIndex={selected === i ? 0 : -1}
                  className="tab"
                  onClick={() => setSelected(i)}
                >
                  <span className="tab-idx" aria-hidden="true">{pad(i + 1)}</span>
                  {project.short}
                </button>
              ))}
            </div>

            {/* Todos los paneles comparten la misma celda: la altura es la del más alto
                y la sección no se mueve al cambiar de pestaña. */}
            <div className="project-stack">
              {projects.map((project, i) => (
                <ProjectDetail key={project.title} project={project} index={i} selected={selected === i} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Projects;
