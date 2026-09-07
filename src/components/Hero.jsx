import React, { useState, useEffect } from "react";
import { Download, ArrowRight, Linkedin, Github, Mail } from "lucide-react";
import { content } from "../data/content";
import "../styles/App.css";

const TypewriterText = ({ fullText }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    let index = 0;
    const startTyping = setTimeout(() => {
      const typeWriter = setInterval(() => {
        if (index <= fullText.length) {
          setText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(typeWriter);
        }
      }, 80);
      return () => clearInterval(typeWriter);
    }, 800);

    return () => clearTimeout(startTyping);
  }, [fullText]);

  return <>{text}</>;
};

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(loadTimer);
  }, []);

  return (
    <section id="inicio" className="hero-container">
      <div className="hero-grid">
        <div className="hero-text-content">
          <div className={`premium-reveal ${isLoaded ? "visible" : ""}`} style={{ transitionDelay: "0.1s" }}>
            <span className="hero-eyebrow">{'// Portafolio 2026'}</span>
          </div>

          <h1 className={`greeting premium-reveal ${isLoaded ? "visible" : ""}`} style={{ transitionDelay: "0.2s" }}>
            Hola, soy <br/>
            <span className="name-highlight">Jhefferson</span>
          </h1>

          <div className={`typing-wrapper premium-reveal ${isLoaded ? "visible" : ""}`} style={{ transitionDelay: "0.3s" }}>
            <TypewriterText fullText="> Frontend Developer_" />
          </div>

          <p className={`hero-desc premium-reveal ${isLoaded ? "visible" : ""}`} style={{ transitionDelay: "0.4s" }}>
            Egresado de Ingeniería de Software y desarrollador web. 
            Me apasiona crear, aprender y llevar mis ideas a la realidad a través del código y el diseño interactivo.
          </p>

          <div className={`hero-buttons premium-reveal ${isLoaded ? "visible" : ""}`} style={{ transitionDelay: "0.5s" }}>
            <a href="mailto:jheffer17x@gmail.com" className="btn" aria-label="Enviar correo">
              <Mail size={16} /> Contactar
            </a>
            <a href={content.hero.cvLink} download className="btn" aria-label="Descargar Curriculum">
              <Download size={16} /> Descargar CV
            </a>
          </div>

          <div className={`hero-socials premium-reveal ${isLoaded ? "visible" : ""}`} style={{ transitionDelay: "0.6s" }}>
            <a href={content.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={20} /></a>
            <a href={content.socials.github} target="_blank" rel="noopener noreferrer" aria-label="Github"><Github size={20} /></a>
          </div>
        </div>

        <div className={`hero-image-container premium-reveal ${isLoaded ? "visible" : ""}`} style={{ transitionDelay: "0.3s" }}>
          <div className="bezel-outer">
            <div className="bezel-inner">
              <img
                src="/assets/projects/perfil.webp"
                alt="Jhefferson Guerrero"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
