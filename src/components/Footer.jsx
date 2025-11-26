import { Linkedin, Github, Mail } from "lucide-react";
import { content } from "../data/content";
import "../styles/App.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Columna 1: Marca y Bio */}
        <div className="footer-brand">
          <h2>Jhefferson</h2>
          <p>
            Frontend Developer y estudiante de Ingeniería de Software. Creando
            soluciones innovadoras con código limpio y diseño moderno.
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div className="footer-column">
          <h3>ENLACES RÁPIDOS</h3>
          <ul className="footer-links">
            <li>
              <a href="#inicio">Inicio</a>
            </li>
            <li>
              <a href="#proyectos">Proyectos</a>
            </li>
            <li>
              <a href="#servicios">Servicios</a>
            </li>
            <li>
              <a href="#about">Acerca de mí</a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Redes Sociales */}
        <div className="footer-column">
          <h3>SÍGUEME</h3>
          <div className="social-icons">
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

      {/* Barra inferior */}
      <div className="footer-bottom">
        <p>© 2025 Jhefferson Guerrero. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
