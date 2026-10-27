import { useState, useEffect } from "react";
import { content } from "../data/content";

const limaClock = new Intl.DateTimeFormat("es-PE", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Lima",
});

const getLimaTime = () => limaClock.format(new Date());
const pad = (n) => String(n).padStart(2, "0");

// Barra de estado fija abajo: disponibilidad, sección actual y hora de Lima.
const StatusBar = ({ active }) => {
  const [time, setTime] = useState(getLimaTime);

  useEffect(() => {
    const timer = setInterval(() => setTime(getLimaTime()), 20000);
    return () => clearInterval(timer);
  }, []);

  const index = Math.max(0, content.nav.findIndex((item) => item.id === active));
  const current = content.nav[index];

  return (
    <footer className="statusbar">
      <div className="statusbar-inner">
        <span className="status-item status-live">
          <span className="status-dot" aria-hidden="true" />
          {content.meta.availability}
        </span>

        <span className="status-item status-section">
          sec {pad(index + 1)}/{pad(content.nav.length)} · {current.label}
        </span>

        <span className="status-spacer" />

        <span className="status-item status-extra">{content.meta.location}</span>
        <span className="status-item">
          <time>{time}</time> <span className="status-extra">UTC−5</span>
        </span>
        <span className="status-item status-extra">{content.meta.version}</span>
      </div>
    </footer>
  );
};

export default StatusBar;
