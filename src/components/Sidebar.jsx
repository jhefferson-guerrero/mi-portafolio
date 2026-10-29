import {
  Download,
  Gamepad2,
  Github,
  House,
  Layers,
  Linkedin,
  Mail,
  Folder,
  User,
  Wrench,
} from "lucide-react";
import { content } from "../data/content";

const ICONS = {
  house: House,
  user: User,
  layers: Layers,
  folder: Folder,
  wrench: Wrench,
  gamepad: Gamepad2,
  mail: Mail,
};

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
        <span className="chip chip--ok">
          <span className="status-dot" aria-hidden="true" />
          disponible
        </span>
      </div>

      <nav className="side-nav" aria-label="Secciones">
        <ul>
          {nav.map((item) => {
            const Icon = ICONS[item.icon];
            return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="side-link"
                aria-current={view === item.id ? "page" : undefined}
              >
                <Icon size={16} className="side-icon" aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            </li>
            );
          })}
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
