import { useEffect, useRef } from "react";
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
import NavMascot from "./NavMascot";

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
  const navRef = useRef(null);

  // En el celular el menú se desliza: la sección activa se centra para que nunca quede tapada por el borde.
  useEffect(() => {
    const list = navRef.current?.querySelector("ul");
    const link = list?.querySelector("[aria-current='page']");
    if (!list || !link || list.scrollWidth <= list.clientWidth) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const offset = link.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft;
    list.scrollTo({ left: offset - (list.clientWidth - link.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  }, [view]);

  return (
    <aside className="sidebar" aria-label="Perfil y navegación">
      <div className="profile">
        {/* La foto en blanco y negro; al pasar el mouse recupera su color. */}
        <div className="avatar">
          <img
            className="avatar-photo"
            src={meta.photo}
            alt={`Retrato de ${meta.name}`}
            fetchPriority="high"
            decoding="async"
          />
          <svg className="avatar-defs" width="0" height="0" aria-hidden="true" focusable="false">
            <filter id="photo-gray" colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="table" tableValues="0.04 0.84" />
                <feFuncG type="table" tableValues="0.04 0.84" />
                <feFuncB type="table" tableValues="0.04 0.84" />
              </feComponentTransfer>
            </filter>
          </svg>
        </div>
        <span className="chip chip--ok">
          <span className="status-dot" aria-hidden="true" />
          disponible
        </span>
      </div>

      <nav ref={navRef} className="side-nav" aria-label="Secciones">
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
                <span className="side-label">{item.label}</span>
              </a>
            </li>
            );
          })}
        </ul>
        <NavMascot nav={navRef} view={view} />
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
