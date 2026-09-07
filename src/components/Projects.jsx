import React from "react";
import { content } from "../data/content";
import { ExternalLink, Github } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "../styles/App.css";

const Projects = () => {
  const [sectionRef, isVisible] = useScrollReveal();
  const animations = ["slide-right", "slide-up", "slide-left"];

  return (
    <section id="proyectos" ref={sectionRef}>
      <h2 className="section-title">Mis Proyectos</h2>

      <div className="projects-grid">
        {content.projects.map((project, i) => {
          const projectKey = project.id || `project-${project.title.replace(/\s+/g, '-').toLowerCase()}-${i}`;
          
          return (
            <div
              key={projectKey}
              className={`panel project-card slide-up ${
                isVisible ? "visible" : ""
              }`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="project-image-container">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-img"
                  loading="lazy"
                />
              </div>

              <div className="project-content">
                <h3 style={{ marginBottom: "0.5rem", fontSize: "1.4rem", color: "var(--color-primary)" }}>
                  {project.title}
                </h3>
                <p>
                  {project.desc}
                </p>

                <div style={{ marginBottom: "1.5rem" }}>
                  {project.tags.map((tag, j) => (
                    <span key={`tag-${j}`} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "auto" }}>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn project-btn"
                      aria-label={`Ver proyecto ${project.title}`}
                    >
                      <ExternalLink size={16} /> Ver Demo
                    </a>
                  )}
                  {project.code && (
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn project-btn"
                      aria-label={`Ver código ${project.title}`}
                    >
                      <Github size={16} /> Ver Código
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
