import React, { useState, useEffect, useRef } from "react";
import { content } from "../data/content";
import { ExternalLink } from "lucide-react";
import "../styles/App.css";

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  return (
    <section id="proyectos" ref={sectionRef}>
      <h2 className="section-title">Mis Proyectos</h2>

      <div
        className={`projects-grid scroll-reveal ${isVisible ? "visible" : ""}`}
      >
        {content.projects.map((project, i) => (
          <div key={i} className="card project-card">
            {/* Contenedor de Imagen */}
            <div className="project-img-wrapper">
              <img
                src={project.image}
                alt={project.title}
                className="project-img"
              />
            </div>

            {/* Contenido del Card */}
            <div className="project-content">
              <h3 style={{ marginBottom: "0.5rem", fontSize: "1.4rem" }}>
                {project.title}
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "#666",
                  marginBottom: "1.5rem",
                  flexGrow: 1,
                }}
              >
                {project.desc}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "1.5rem",
                }}
              >
                {project.tags.map((tag, j) => (
                  <span key={j} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Ver Proyecto <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
