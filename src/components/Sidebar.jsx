import { Download, Github, Linkedin, Mail } from "lucide-react";
import { content } from "../data/content";

// Columna lateral: perfil siempre visible, navegación y accesos directos.
const Sidebar = ({ view }) => {
  const { meta, hero, socials, nav } = content;

  return (
    <aside className="sidebar" aria-label="Perfil y navegación">
      <div className="profile">
        <div className="avatar">
          <img
            src="/assets/projects/perfil.webp"
            alt={`Retrato de ${meta.name}`}
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="profile-id">
          <p className="profile-name">{meta.name}</p>
          <p className="profile-role">{hero.role}</p>
          <span className="chip chip--ok">
            <span className="status-dot" aria-hidden="true" />
            disponible
          </span>
        </div>
      </div>

      <dl className="profile-kv">
        <div>
          <dt>ubicación</dt>
          <dd>{meta.location}</dd>
        </div>
        <div>
          <dt>estudios</dt>
          <dd>{meta.studies}</dd>
        </div>
        <div>
          <dt>busco</dt>
          <dd>{meta.seeking}</dd>
        </div>
      </dl>

      <nav className="side-nav" aria-label="Secciones">
        <ul>
          {nav.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="side-link"
                aria-current={view === item.id ? "page" : undefined}
              >
                <span className="side-key" aria-hidden="true">{i + 1}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="side-actions">
        <a href={hero.cvLink} download className="btn btn--small">
          <Download size={14} /> CV
        </a>
        <a
          href={socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-link"
          aria-label="GitHub (se abre en otra pestaña)"
        >
          <Github size={16} />
        </a>
        <a
          href={socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-link"
          aria-label="LinkedIn (se abre en otra pestaña)"
        >
          <Linkedin size={16} />
        </a>
        <a href={socials.email} className="icon-link" aria-label="Enviar correo">
          <Mail size={16} />
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
