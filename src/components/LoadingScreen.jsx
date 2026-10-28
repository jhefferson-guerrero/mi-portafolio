import { useState, useEffect } from "react";
import PixelScene from "./PixelScene";

const BOOT_LINES = [
  "jg-shell v2026.10 · jhefferson guerrero",
  "Montando sistema de archivos ...",
  "Cargando perfil ...",
  "Iniciando terminal ...",
  "Listo. Escribe help para empezar.",
];

const pad = (n, size = 2) => String(n).padStart(size, "0");
const formatTime = (date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;

// Pantalla de arranque: un log corto con marcas de tiempo reales y la mascota trabajando.
const LoadingScreen = ({ onComplete }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (lines.length >= BOOT_LINES.length) {
      const done = setTimeout(onComplete, 420);
      return () => clearTimeout(done);
    }

    const next = setTimeout(
      () =>
        setLines((prev) => [
          ...prev,
          { time: formatTime(new Date()), message: BOOT_LINES[prev.length] },
        ]),
      lines.length === 0 ? 150 : 240
    );
    return () => clearTimeout(next);
  }, [lines.length, onComplete]);

  const progress = lines.length / BOOT_LINES.length;

  return (
    <div className="boot" role="status" aria-label="Cargando portafolio">
      <div className="boot-inner">
        <PixelScene mood="busy" className="boot-scene" />

        <p className="boot-title">iniciando<span className="cursor" aria-hidden="true" /></p>

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
