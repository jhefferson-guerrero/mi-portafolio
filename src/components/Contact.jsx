import { Download, Github, Linkedin, Mail } from "lucide-react";
import { content } from "../data/content";
import Pane from "./Pane";

// Cuatro canales de contacto en tarjetas. La tarjeta entera es el enlace; el botón
// de copiar ejecuta el comando "email" de la consola.
const Contact = ({ active, onRun }) => {
  const { socials, hero } = content;
  const email = socials.email.replace("mailto:", "");

  const channels = [
    { label: "Correo", value: email, href: socials.email, Icon: Mail, copy: true },
    { label: "GitHub", value: socials.githubLabel, href: socials.github, Icon: Github, external: true },
    { label: "LinkedIn", value: socials.linkedinLabel, href: socials.linkedin, Icon: Linkedin, external: true },
    { label: "CV", value: "CV-Jhefferson-Guerrero.pdf", href: hero.cvLink, Icon: Download, download: true },
  ];

  return (
    <Pane id="contacto" active={active} file="contacto.sh" hint="// hablemos" fill>
      <div className="contact-wrap">
        <div className="contact-intro">
          <h3 className="contact-title">Busco prácticas preprofesionales en desarrollo front-end.</h3>
          <p className="contact-lead">
            Si tienes una vacante o un proyecto, escríbeme. Respondo por correo.
          </p>
        </div>

        <ul className="contact-cards">
          {channels.map((channel) => {
            const { label, value, href, copy, external, download } = channel;
            const Icon = channel.Icon;
            return (
            <li key={label} className="contact-card">
              <span className="contact-icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div className="contact-info">
                <p className="contact-label">{label}</p>
                <a
                  href={href}
                  className="contact-value"
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(download ? { download: true } : {})}
                >
                  {value}
                  {external && " ↗"}
                </a>
              </div>
              {copy && (
                <button type="button" className="btn btn--small contact-copy" onClick={() => onRun("email")}>
                  copiar
                </button>
              )}
            </li>
            );
          })}
        </ul>

        <p className="legal">
          &copy; {new Date().getFullYear()} {content.meta.name} · Hecho con React y Vite
        </p>
      </div>
    </Pane>
  );
};

export default Contact;
