import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { content } from "../data/content";
import "../styles/App.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>JG</h2>
          <p>
            Construyendo experiencias digitales eficientes y escalables. 
            Especializado en Frontend y diseño de interfaces.
          </p>
        </div>

        <div className="footer-column">
          <h3>Navegación</h3>
          <ul className="footer-links">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#about">Acerca</a></li>
            <li><a href="#proyectos">Proyectos</a></li>
            <li><a href="#servicios">Servicios</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Contacto</h3>
          <ul className="footer-links">
            <li><a href={content.socials.github} target="_blank" rel="noopener noreferrer"><Github size={16} style={{display:'inline', marginRight:'8px'}}/> GitHub</a></li>
            <li><a href={content.socials.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={16} style={{display:'inline', marginRight:'8px'}}/> LinkedIn</a></li>
            <li><a href={content.socials.email}><Mail size={16} style={{display:'inline', marginRight:'8px'}}/> Email</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Jhefferson Guerrero. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
