import React, { useState, useEffect, useRef } from "react";
import "../styles/App.css";

const About = () => {
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
    <section id="about" ref={sectionRef}>
      <div className={`about-grid scroll-reveal ${isVisible ? "visible" : ""}`}>
        {/* Columna Izquierda: Imagen */}
        <div className="about-image-container">
          <img
            src="/assets/projects/sobre-mi.webp"
            alt="Jhefferson Guerrero"
            className="about-image"
          />
        </div>

        {/* Columna Derecha: Información */}
        <div className="about-content">
          {/* Título Principal */}
          <h2 className="section-title">Acerca de Mí</h2>

          {/* Bio General */}
          <p
            style={{ color: "#666", lineHeight: "1.7", marginBottom: "1.5rem" }}
          >
            Estudiante de Ingeniería de Software (9º ciclo) especializado en
            desarrollo web front-end. Me apasiona crear soluciones digitales
            escalables y experiencias de usuario fluidas, enfocándome siempre en
            el código limpio y el trabajo colaborativo.
          </p>

          {/* Sección: Educación */}
          <div className="pipe-title">Educación</div>
          <div className="info-item">
            <div className="institution">
              Universidad Tecnológica del Perú (UTP)
            </div>
            <div className="degree">Ingeniería de Software | 9º Ciclo</div>
            <div className="date">Actualmente estudiando</div>
          </div>

          {/* Sección: Experiencia */}
          <div className="pipe-title">Experiencia</div>
          <div className="info-item">
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

          {/* Sección: Habilidades Técnicas */}
          <div className="pipe-title">Habilidades Técnicas</div>
          <div className="skills-wrapper">
            {[
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
            ].map((skill) => (
              <span key={skill} className="skill-pill">
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
