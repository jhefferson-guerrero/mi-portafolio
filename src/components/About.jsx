import React, { useState, useEffect, useRef } from "react";
import "../styles/App.css";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const thresholdValue = isMobile ? 0.2 : 0.3;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: thresholdValue,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  const skills = [
    "React",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Firebase",
    "MySQL",
    "SQL Server",
    "Git",
    "Figma",
  ];

  return (
    <section id="about" ref={sectionRef}>
      <div className="about-grid">
        <div
          className={`about-image-container slide-right ${
            isVisible ? "visible" : ""
          }`}
        >
          <img
            src="/assets/projects/sobre-mi.webp"
            alt="Jhefferson Guerrero"
            className="about-image"
          />
        </div>

        <div className="about-content">
          <h2
            className={`section-title ${isVisible ? "visible" : ""}`}
            style={{ transitionDelay: "0.1s" }}
          >
            Acerca de Mí
          </h2>

          <p
            className={`slide-up ${isVisible ? "visible" : ""}`}
            style={{
              lineHeight: "1.7",
              marginBottom: "1.5rem",
              transitionDelay: "0.2s",
            }}
          >
            Estudiante de Ingeniería de Software (9º ciclo) especializado en
            desarrollo web front-end. Me apasiona crear soluciones digitales
            escalables y experiencias de usuario fluidas, enfocándome siempre en
            el código limpio y el trabajo colaborativo.
          </p>

          <div
            className={`pipe-title slide-up ${isVisible ? "visible" : ""}`}
            style={{ transitionDelay: "0.3s" }}
          >
            Educación
          </div>

          <div
            className={`info-item slide-up ${isVisible ? "visible" : ""}`}
            style={{ transitionDelay: "0.4s" }}
          >
            <div className="institution">
              Universidad Tecnológica del Perú (UTP)
            </div>
            <div className="degree">Ingeniería de Software | 9º Ciclo</div>
            <div className="date">Actualmente estudiando</div>
          </div>

          <div
            className={`pipe-title slide-up ${isVisible ? "visible" : ""}`}
            style={{ transitionDelay: "0.5s" }}
          >
            Experiencia
          </div>

          <div
            className={`info-item slide-up ${isVisible ? "visible" : ""}`}
            style={{ transitionDelay: "0.6s" }}
          >
            <div className="institution">
              Desarrollador Web & Asistente - Academia Fertex
            </div>
            <p className="degree">
              Diseñé y desarrollé el sitio web institucional con React y
              Tailwind CSS. Gestioné contenido digital para 150+ familias y
              optimicé el proceso de captación de alumnos mediante estrategia
              digital y atención personalizada.
            </p>
            <div className="date">Febrero 2023 - Diciembre 2023</div>
          </div>

          <div
            className={`pipe-title slide-up ${isVisible ? "visible" : ""}`}
            style={{ transitionDelay: "0.7s" }}
          >
            Habilidades Técnicas
          </div>

          <div className="skills-wrapper">
            {skills.map((skill, index) => (
              <span
                key={skill}
                className={`skill-pill slide-up ${isVisible ? "visible" : ""}`}
                style={{
                  transitionDelay: isVisible ? `${0.8 + index * 0.1}s` : "0s",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
