import React from "react";
import { content } from "../data/content";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "../styles/App.css";

const Skills = () => {
  const [sectionRef, isVisible] = useScrollReveal();

  return (
    <section id="skills" ref={sectionRef}>
      <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>Mi Stack</h2>
      <p className={`slide-up ${isVisible ? "visible" : ""}`} style={{ color: "var(--color-text)", textAlign: "center", marginBottom: "2rem", fontSize: "1.1rem" }}>
        Tecnologías y herramientas que utilizo para construir experiencias digitales.
      </p>

      <div className={`skills-container slide-up ${isVisible ? "visible" : ""}`} style={{ transitionDelay: "0.1s" }}>
        <div className="skills-grid">
          {content.about.stack.map((skill, index) => (
            <div 
              key={index} 
              className={`slide-up ${isVisible ? "visible" : ""}`}
              style={{ 
                transitionDelay: `${0.1 + index * 0.1}s`,
                transitionDuration: "0.4s"
              }}
            >
              <div className="neu-key">
                <span style={{ fontWeight: 600 }}>{skill}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
