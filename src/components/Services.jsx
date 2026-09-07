import React from "react";
import { content } from "../data/content";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "../styles/App.css";

const Services = () => {
  const [sectionRef, isVisible] = useScrollReveal();
  const animations = ["slide-right", "slide-up", "slide-left"];

  return (
    <section id="servicios" ref={sectionRef}>
      <h2 className="section-title">Mis Servicios</h2>

      <div className="services-grid">
        {content.services.map((service, i) => {
          const IconComponent = service.icon;
          return (
            <div
              key={`service-${service.title.replace(/\s+/g, '-').toLowerCase()}-${i}`}
              className={`panel service-card ${animations[i % animations.length]} ${
                isVisible ? "visible" : ""
              }`}
              style={{ transitionDelay: isVisible ? `${i * 0.1}s` : "0s" }}
            >
              <div className="service-icon-wrapper">
                <IconComponent size={28} />
              </div>
              <h3 style={{ marginBottom: "0.8rem", color: "var(--color-primary)" }}>{service.title}</h3>
              <p style={{ color: "var(--color-text)" }}>{service.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Services;
