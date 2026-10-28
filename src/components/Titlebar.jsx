import { useState, useEffect } from "react";
import { content } from "../data/content";

const limaClock = new Intl.DateTimeFormat("es-PE", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Lima",
});

const getLimaTime = () => limaClock.format(new Date());

// Barra superior de la "ventana": ruta actual, disponibilidad y hora de Lima.
const Titlebar = ({ view }) => {
  const [time, setTime] = useState(getLimaTime);

  useEffect(() => {
    const timer = setInterval(() => setTime(getLimaTime()), 20000);
    return () => clearInterval(timer);
  }, []);

  const current = content.nav.find((item) => item.id === view) ?? content.nav[0];

  return (
    <header className="titlebar">
      <div className="titlebar-inner">
        <span className="tb-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <a href="#inicio" className="tb-brand" aria-label="Ir al inicio">jg-shell</a>
        <span className="tb-path">
          ~/portafolio/<strong>{current.cmd}</strong>
        </span>

        <span className="tb-spacer" />

        <span className="tb-item tb-live">
          <span className="status-dot" aria-hidden="true" />
          {content.meta.availability}
        </span>
        <span className="tb-item tb-extra">
          <time>{time}</time> Lima
        </span>
        <span className="tb-item tb-extra">{content.meta.version}</span>
      </div>
    </header>
  );
};

export default Titlebar;
