import { useState, useEffect } from "react";
import PixelBot from "./PixelBot";

const BOOT_LINES = [
  "portafolio · jhefferson guerrero · v2026.10",
  "Cargando tipografías ...",
  "Montando componentes ...",
  "Optimizando recursos ...",
  "Listo. Bienvenido.",
];

const pad = (n, size = 2) => String(n).padStart(size, "0");
const formatTime = (date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;

// Pantalla de arranque: un log corto con marcas de tiempo reales.
const LoadingScreen = ({ onComplete }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (lines.length >= BOOT_LINES.length) {
      const done = setTimeout(onComplete, 380);
      return () => clearTimeout(done);
    }

    const next = setTimeout(
      () =>
        setLines((prev) => [
          ...prev,
          { time: formatTime(new Date()), message: BOOT_LINES[prev.length] },
        ]),
      lines.length === 0 ? 150 : 230
    );
    return () => clearTimeout(next);
  }, [lines.length, onComplete]);

  const progress = lines.length / BOOT_LINES.length;

  return (
    <div className="boot" role="status" aria-label="Cargando portafolio">
      <div className="boot-inner">
        <div className="boot-head">
          <PixelBot size={56} />
          <p className="boot-title">iniciando<span className="cursor" aria-hidden="true" /></p>
        </div>

        <ol className="boot-log">
          {lines.map((line) => (
            <li key={line.time} className="boot-line">
              <span className="boot-time">{line.time}</span>
              <span>{line.message}</span>
            </li>
          ))}
        </ol>

        <div className="boot-bar" aria-hidden="true">
          <div className="boot-bar-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>

        <button type="button" className="boot-skip" onClick={onComplete}>
          saltar
        </button>
      </div>
    </div>
  );
};

export default LoadingScreen;
