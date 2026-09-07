import React from "react";
import { Code2, Terminal } from "lucide-react";
import { content } from "../data/content";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "../styles/App.css";

const About = () => {
  const [sectionRef, isVisible] = useScrollReveal();
  const [eduRef, isEduVisible] = useScrollReveal();
  const [expRef, isExpVisible] = useScrollReveal();

  return (
    <section id="about" ref={sectionRef}>
      <h2 className="section-title">Acerca de Mí</h2>

      <div className={`profile-card slide-up ${isVisible ? "visible" : ""}`} style={{ transitionDelay: "0.1s" }}>
        
        {/* Sidebar: Icono 3D Neumórfico en lugar de foto */}
        <div className="profile-sidebar">
          <div className="neu-3d-icon-container">
            <div className="neu-3d-icon">
              <div className="neu-icon-inner">
                <Code2 size={72} strokeWidth={1.5} className="icon-main" />
              </div>
            </div>
            
            <div className="neu-badges">
              <span className="neu-badge"><Terminal size={14}/> Frontend</span>
            </div>
          </div>
        </div>

        {/* Content: Bio y Timeline */}
        <div className="profile-content">
          <p style={{ color: "var(--color-text)", fontSize: "1.1rem", lineHeight: "1.7", marginBottom: "2rem" }}>
            Soy <strong style={{color: "var(--color-accent)"}}>Jhefferson Guerrero</strong>, desarrollador web enfocado en el ecosistema 
            <strong style={{color: "var(--color-accent)"}}> Frontend</strong>. Me especializo en crear interfaces modernas, optimizadas 
            y accesibles. Mi objetivo es combinar diseño técnico (UI/UX) con código limpio para ofrecer experiencias de alto nivel.
          </p>

          <div className="timeline-container">
            {/* Timeline Item: Experiencia */}
            <div ref={expRef} className={`timeline-item slide-up ${isExpVisible ? "visible" : ""}`} style={{ transitionDelay: "0.1s" }}>
              <div className="timeline-dot"></div>
              <h3 style={{ marginTop: 0, marginBottom: "0.5rem", color: "var(--color-accent)", fontSize: "1.1rem" }}>{content.about.experience.title}</h3>
              <p className="institution">{content.about.experience.role}</p>
              <p className="degree">{content.about.experience.company}</p>
              <p className="date">{content.about.experience.date}</p>
              <p style={{ marginTop: "0.5rem", color: "var(--color-text)", fontSize: "0.95rem" }}>
                {content.about.experience.desc}
              </p>
              <div style={{ marginTop: "1rem", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <a href={content.about.experience.linkLive} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}>
                  Ver Proyecto en Vivo →
                </a>
                <a href={content.about.experience.linkCode} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}>
                  Ver Código →
                </a>
              </div>
            </div>

            {/* Timeline Item: Educación */}
            <div ref={eduRef} className={`timeline-item slide-up ${isEduVisible ? "visible" : ""}`} style={{ transitionDelay: "0.2s" }}>
              <div className="timeline-dot"></div>
              <h3 style={{ marginTop: 0, marginBottom: "0.5rem", color: "var(--color-accent)", fontSize: "1.1rem" }}>{content.about.education.title}</h3>
              <p className="institution">{content.about.education.institution}</p>
              <p className="degree">{content.about.education.degree}</p>
              <p className="date" style={{ marginBottom: "0" }}>{content.about.education.date}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
