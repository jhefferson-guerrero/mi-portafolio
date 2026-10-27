import { useState, useEffect, useRef } from "react";
import { Check, Copy, Download } from "lucide-react";
import { content } from "../data/content";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import PixelBot from "./PixelBot";

const Contact = () => {
  const { socials, hero } = content;
  const email = socials.email.replace("mailto:", "");
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sin acceso al portapapeles: abre el cliente de correo.
      window.location.href = socials.email;
    }
  };

  return (
    <section id="contacto" className="section section--last" aria-labelledby="contacto-title">
      <div className="container">
        <SectionHead index="06" id="contacto-title" title="contacto" hint="// hablemos" />

        <div className="contact-grid">
          <Reveal>
            <div className="panel">
              <div className="panel-head"><span>~/contacto.sh</span></div>
              <div className="panel-body">
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
                      <button type="button" className="btn btn--small" onClick={copyEmail}>
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? "copiado" : "copiar"}
                      </button>
                      <span className="sr-only" role="status" aria-live="polite">
                        {copied ? "Correo copiado al portapapeles" : ""}
                      </span>
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
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="panel bot-panel">
              <PixelBot size={128} />
              <p className="bot-say" aria-hidden="true">
                &gt; esperando tu mensaje<span className="cursor" />
              </p>
            </div>
          </Reveal>
        </div>

        <p className="legal">
          &copy; {new Date().getFullYear()} {content.meta.name} · Hecho con React y Vite
        </p>
      </div>
    </section>
  );
};

export default Contact;
