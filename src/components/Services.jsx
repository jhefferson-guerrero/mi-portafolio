import React, { useState, useEffect, useRef } from "react";
import { content } from "../data/content";
import "../styles/App.css";

const Services = () => {
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
    <section id="servicios" ref={sectionRef}>
      <h2 className="section-title">Servicios</h2>

      <div
        className={`services-grid scroll-reveal ${isVisible ? "visible" : ""}`}
      >
        {content.services.map((service, i) => (
          <div key={i} className="service-card">
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
