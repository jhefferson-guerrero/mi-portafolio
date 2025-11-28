import React, { useState, useEffect, useRef } from "react";
import { content } from "../data/content";
import "../styles/App.css";

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const thresholdValue = isMobile ? 0.3 : 0.6;

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

  const animations = ["slide-right", "slide-up", "slide-left"];

  return (
    <section id="servicios" ref={sectionRef}>
      <h2 className="section-title">Servicios</h2>

      <div className="services-grid">
        {content.services.map((service, i) => (
          <div
            key={i}
            className={`service-card ${animations[i]} ${
              isVisible ? "visible" : ""
            }`}

          >
            {/* Wrapper del icono */}
            <div className="service-icon-wrapper">
              <service.icon size={32} />
            </div>

            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
