import { Download } from "lucide-react";
import { content } from "../data/content";
import Pane from "./Pane";
import PixelScene from "./PixelScene";

// El botón de copiar vive en la consola (comando "email"); aquí basta el enlace.
const Contact = ({ active, onRun }) => {
  const { socials, hero } = content;
  const email = socials.email.replace("mailto:", "");

  return (
    <Pane id="contacto" active={active} file="contacto.sh" hint="// hablemos">
      <div className="contact-grid">
        <div className="contact-main">
          <h3 className="contact-title">
            Busco prácticas preprofesionales en desarrollo front-end.
          </h3>
          <p className="contact-lead">
            Si tienes una vacante o un proyecto, escríbeme. Respondo por correo.
          </p>

          <dl className="kv-list kv-list--compact">
            <div className="kv">
              <dt>Correo</dt>
              <dd>
                <a href={socials.email} className="kv-link">{email}</a>
                <button type="button" className="btn btn--small" onClick={() => onRun("email")}>
                  copiar
                </button>
              </dd>
            </div>
            <div className="kv">
              <dt>GitHub</dt>
              <dd>
                <a href={socials.github} target="_blank" rel="noopener noreferrer" className="kv-link">
                  {socials.githubLabel} ↗
                </a>
              </dd>
            </div>
            <div className="kv">
              <dt>LinkedIn</dt>
              <dd>
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="kv-link">
                  {socials.linkedinLabel} ↗
                </a>
              </dd>
            </div>
            <div className="kv">
              <dt>CV</dt>
              <dd>
                <a href={hero.cvLink} download className="kv-link">
                  <Download size={14} /> CV-Jhefferson-Guerrero.pdf
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <figure className="scene-wrap">
          <PixelScene />
          <figcaption className="bot-say" aria-hidden="true">
            &gt; esperando tu mensaje<span className="cursor" />
          </figcaption>
        </figure>
      </div>

      <p className="legal">
        &copy; {new Date().getFullYear()} {content.meta.name} · Hecho con React y Vite
      </p>
    </Pane>
  );
};

export default Contact;
