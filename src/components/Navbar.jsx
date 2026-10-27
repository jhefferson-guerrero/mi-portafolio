import { useState, useEffect, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { content } from "../data/content";

// Barra superior tipo menú de aplicación. `active` viene de useActiveSection.
const Navbar = ({ active }) => {
  const navRef = useRef(null);
  // Siempre arranca en oscuro; el cambio de tema solo dura la sesión actual.
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // En móvil el menú se desplaza: mantiene visible el enlace activo.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || nav.scrollWidth <= nav.clientWidth) return;
    nav
      .querySelector('[aria-current="location"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [active]);

  const isDark = theme === "dark";

  return (
    <header className="menubar">
      <div className="menubar-inner">
        <a href="#inicio" className="brand" aria-label="Ir al inicio">
          <span className="brand-mark">JG</span>
          <span className="brand-name">portafolio</span>
        </a>

        <nav ref={navRef} className="menu" aria-label="Principal">
          <ul>
            {content.nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="menu-link"
                  aria-current={active === item.id ? "location" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="icon-btn"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
          <span className="icon-btn-label">{isDark ? "claro" : "oscuro"}</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
