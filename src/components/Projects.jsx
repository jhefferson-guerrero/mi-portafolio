import { useState } from "react";
import { content } from "../data/content";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const pad = (n) => String(n).padStart(2, "0");

const ProjectCard = ({ project, index }) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Reveal delay={index * 60}>
      <article className="panel project">
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
            <span className="project-idx" aria-hidden="true">{pad(index + 1)}</span>
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
    </Reveal>
  );
};

const Projects = () => (
  <section id="proyectos" className="section" aria-labelledby="proyectos-title">
    <div className="container">
      <SectionHead index="04" id="proyectos-title" title="proyectos" hint="// trabajo real, en producción" />

      <div className="project-list">
        {content.projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
