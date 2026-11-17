import { useEffect } from "react";
import { MASCOTS } from "../lib/creature";
import { setMascot } from "../lib/mascot";
import { CreatureAura } from "./PixelScene";

// Margen que se deja en el dibujo para el aura (en píxeles del sprite): a los lados y arriba, porque abajo está el suelo.
const AURA_SIDE = 5;
const AURA_TOP = 6;

// Los tres retratos miden lo mismo (y con ellos las tres tarjetas) aunque los sprites no: cada uno se pinta a la escala que
// le da a todos la misma altura (la de REF_ROWS filas, la del más bajo) y se centra, apoyado en el suelo, en una caja común.
// La caja se mide en "píxeles de referencia": los de un sprite de REF_ROWS filas.
const ALL = Object.values(MASCOTS);
const REF_ROWS = Math.min(...ALL.map(({ rows }) => rows));
const BOX_W = Math.max(...ALL.map(({ cols, rows }) => (cols * REF_ROWS) / rows)) + AURA_SIDE * 2;
const BOX_H = REF_ROWS + AURA_TOP;

// Retrato de una mascota (cuerpo, ojos en reposo y su aura), independiente de la que esté en uso en el sitio.
// `--grow` es cuánto crece el dibujo por el margen del aura: así el sprite conserva su tamaño (ver .pick-art en shell.css).
const Portrait = ({ mascot }) => {
  const scale = REF_ROWS / mascot.rows; // píxeles de referencia por píxel del sprite
  const width = BOX_W / scale;
  const height = BOX_H / scale;

  return (
    <svg
      className={`pick-art mascot--${mascot.name}`}
      viewBox={`${-(width - mascot.cols) / 2} ${-(height - mascot.rows)} ${width} ${height}`}
      style={{ aspectRatio: `${BOX_W} / ${BOX_H}`, "--grow": BOX_H / REF_ROWS }}
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
        <CreatureAura mascot={mascot} />
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
};

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
    <div className="bios-pick" role="group" aria-label="Elige tu compañero">
      <p className="pick-title">Elige tu compañero<span className="cursor" aria-hidden="true" /></p>
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
