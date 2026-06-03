import React, { useState, useEffect } from "react";
import { Download, ArrowRight, Linkedin, Github, Mail } from "lucide-react";
import { content } from "../data/content";
import "../styles/App.css";

const Hero = () => {
  const [text, setText] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);
  const fullText = "Frontend Developer";

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);

    let index = 0;

    const startTyping = setTimeout(() => {
      const typeWriter = setInterval(() => {
        if (index <= fullText.length) {
          setText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(typeWriter);
        }
      }, 100);
      return () => clearInterval(typeWriter);
    }, 1000);

    return () => clearTimeout(startTyping);
  }, []);

  return (
    <section id="inicio" className="hero-container">
      <div className="hero-grid">
        <div className="hero-text-content">
          <h1
            className={`greeting slide-up ${isLoaded ? "visible" : ""}`}
            style={{ transitionDelay: "0.2s" }}
          >
            Hola, soy <span className="name-highlight">Jhefferson</span>
          </h1>

          <div
            className={`typing-wrapper slide-up ${isLoaded ? "visible" : ""}`}
            style={{ transitionDelay: "0.4s" }}
          >
            {text}
            <span className="cursor"></span>
          </div>

          <p
            className={`hero-desc slide-up ${isLoaded ? "visible" : ""}`}
            style={{ transitionDelay: "0.3s" }}
          >
            Egresado de {" "}
            <span style={{ fontWeight: "700" }}>
              Ingeniería de Software
            </span>{" "}
            y desarrollador web. Me apasiona crear, aprender y llevar mis ideas
            a la realidad a través de la programación y creatividad.
          </p>

          <div
            className={`hero-buttons slide-up ${isLoaded ? "visible" : ""}`}
            style={{ transitionDelay: "0.9s" }}
          >
            <a
              href="mailto:jheffer17x@gmail.com"
              className="btn-outline"
              aria-label="Enviar correo"
            >
              Contactar <ArrowRight size={18} />
            </a>
            <a href={content.hero.cvLink} download className="btn-dark">
              Descargar CV <Download size={18} />
            </a>
          </div>

          <div
            className={`follow-me slide-up ${isLoaded ? "visible" : ""}`}
            style={{ transitionDelay: "1.2s" }}
          >
            <span className="follow-label">SÍGUEME</span>
            <div className="hero-socials">
              <a href={content.socials.email}>
                <Mail size={25} />
              </a>
              <a
                href={content.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={25} />
              </a>
              <a
                href={content.socials.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={25} />
              </a>
            </div>
          </div>
        </div>

        <div
          className={`hero-image-container slide-left ${
            isLoaded ? "visible" : ""
          }`}
          style={{ transitionDelay: "0.2s" }}
        >
          <div className="hero-image-frame">
            <img
              src="/assets/projects/perfil.webp"
              alt="Jhefferson Guerrero"
              className="hero-img"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
