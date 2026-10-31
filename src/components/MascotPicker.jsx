import { useEffect } from "react";
import { MASCOTS } from "../lib/creature";
import { setMascot } from "../lib/mascot";

// Retrato de una mascota (cuerpo y ojos en reposo), independiente de la que esté en uso en el sitio.
const Portrait = ({ mascot }) => (
  <svg
    className={`pick-art mascot--${mascot.name}`}
    viewBox={`0 0 ${mascot.cols} ${mascot.rows}`}
    style={{ aspectRatio: `${mascot.cols} / ${mascot.rows}` }}
    shapeRendering="crispEdges"
    aria-hidden="true"
    focusable="false"
  >
    <g className="creature-shadow">
      {mascot.shadow.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className="px px-s" />
      ))}
    </g>
    <g className="pick-bot">
      {mascot.cells.filter(({ char }) => char !== "s").map(({ char, x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className={`px px-${char === "E" ? "k" : char}`} />
      ))}
      <g className="creature-eyes">
        {mascot.eyes.idle.map(([x, y, tone]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className={`px px-E${tone ? ` eye-${tone}` : ""}`} />
        ))}
      </g>
      {mascot.scan && Array.from({ length: mascot.rows - 1 }, (_, y) => y).filter((y) => y % 3 === 2).map((y) => (
        <rect key={y} x="0" y={y} width={mascot.cols} height="1" className="px-scan" />
      ))}
    </g>
  </svg>
);

// Pantalla de elección de mascota del arranque. El arranque no sigue hasta que la persona elige una
// (con un clic o con la tecla 1, 2, 3...). La elección se recuerda para el resto del sitio.
const MascotPicker = ({ onPick }) => {
  const mascots = Object.values(MASCOTS);

  const pick = (name) => {
    setMascot(name);
    onPick();
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const mascot = mascots[Number(event.key) - 1];
      if (mascot) pick(mascot.name);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="bios-pick" role="group" aria-label="Elige la mascota">
      <p className="pick-title">Elige tu mascota<span className="cursor" aria-hidden="true" /></p>
      <p className="pick-hint">Te acompañará mientras recorres el portafolio</p>

      <div className="pick-list">
        {mascots.map((mascot, i) => (
          <button key={mascot.name} type="button" className="pick-card" onClick={() => pick(mascot.name)}>
            <Portrait mascot={mascot} />
            <span className="pick-name">{mascot.label}</span>            <span className="pick-key">[{i + 1}]</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MascotPicker;
