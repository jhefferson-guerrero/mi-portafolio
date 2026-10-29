import { useEffect, useRef } from "react";
import { CREATURE_CELLS, CREATURE_COLS, CREATURE_ROWS } from "../lib/creature";

const WIDTH = 60;
const HEIGHT = 30;
const FLOOR = 26;

// Rectángulo con borde de 1 px alineado a la cuadrícula de píxeles.
const Box = ({ x, y, w, h, className = "" }) => (
  <rect
    x={x + 0.5}
    y={y + 0.5}
    width={w - 1}
    height={h - 1}
    className={`sc-box ${className}`.trim()}
  />
);

const Px = ({ x, y, w = 1, h = 1, className }) => (
  <rect x={x} y={y} width={w} height={h} className={className} />
);

// Cuánto se pueden mover los ojos dentro del visor, en píxeles del dibujo, y a qué distancia
// del cursor (en píxeles de pantalla) llegan al máximo.
const GAZE_X = 2;
const GAZE_Y = 1;
const GAZE_REACH_X = 260;
const GAZE_REACH_Y = 160;
const clamp = (value) => Math.max(-1, Math.min(1, value));

// La criatura: cuerpo fijo y ojos que parpadean y miran a los lados. Mientras el cursor está
// en la ventana los ojos lo siguen de a un píxel; si sale, vuelven a mirar a los lados solos.
const Creature = () => {
  const bodyRef = useRef(null);
  const gazeRef = useRef(null);

  useEffect(() => {
    const body = bodyRef.current;
    const gaze = gazeRef.current;
    if (!body || !gaze || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;

    const look = (x, y) => {
      gaze.style.setProperty("--gaze-x", x);
      gaze.style.setProperty("--gaze-y", y);
    };

    const onMove = (event) => {
      if (frame) return;
      const { clientX, clientY } = event;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = body.getBoundingClientRect();
        const dx = (clientX - (rect.left + rect.width / 2)) / GAZE_REACH_X;
        const dy = (clientY - (rect.top + rect.height / 2)) / GAZE_REACH_Y;
        gaze.dataset.tracking = "true";
        look(Math.round(clamp(dx) * GAZE_X), Math.round(clamp(dy) * GAZE_Y));
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      delete gaze.dataset.tracking;
      look(0, 0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <g ref={bodyRef}>
      {CREATURE_CELLS.filter(({ char }) => char !== "E").map(({ char, x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className={`px px-${char}`} />
      ))}
      <g className="creature-gaze" ref={gazeRef}>
        <g className="creature-look">
          <g className="creature-eyes">
            {CREATURE_CELLS.filter(({ char }) => char === "E").map(({ x, y }) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className="px px-E" />
            ))}
          </g>
        </g>
      </g>
    </g>
  );
};

// La criatura sola, por ejemplo para el logo de la pantalla de arranque.
export const Mascot = ({ size = 96 }) => (
  <svg
    viewBox={`0 0 ${CREATURE_COLS} ${CREATURE_ROWS}`}
    width={size}
    height={Math.round((size * CREATURE_ROWS) / CREATURE_COLS)}
    shapeRendering="crispEdges"
    aria-hidden="true"
    focusable="false"
  >
    <Creature />
  </svg>
);

// Escena: sala de servidores con racks, un escritorio con monitor y la mascota en medio.
// mood = "idle" (tranquila) o "busy" (el monitor trabaja más rápido).
const PixelScene = ({ mood = "idle", className = "" }) => (
  <svg
    className={`scene scene--${mood} ${className}`.trim()}
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    shapeRendering="crispEdges"
    aria-hidden="true"
    focusable="false"
  >
    {/* Marcos en la pared */}
    <Box x={9} y={2} w={9} h={5} />
    <Box x={42} y={2} w={11} h={5} />
    <Px x={11} y={4} w={4} className="sc-line" />
    <Px x={44} y={4} w={7} className="sc-line" />

    {/* Rack alto */}
    <Box x={1} y={8} w={10} h={FLOOR - 8} />
    {[11, 14, 17, 20, 23].map((y) => (
      <Px key={y} x={3} y={y} w={4} className="sc-slot" />
    ))}
    <Px x={8} y={11} className="sc-led" />
    <Px x={8} y={14} className="sc-led sc-led--b" />
    <Px x={8} y={17} className="sc-led sc-led--ok" />
    <Px x={8} y={20} className="sc-led sc-led--c" />

    {/* Rack bajo */}
    <Box x={11} y={16} w={7} h={FLOOR - 16} />
    {[19, 22].map((y) => (
      <Px key={y} x={13} y={y} w={3} className="sc-slot" />
    ))}
    <Px x={16} y={19} className="sc-led sc-led--b" />
    <Px x={16} y={22} className="sc-led sc-led--ok" />

    {/* Escritorio y monitor */}
    <Box x={44} y={10} w={14} h={11} />
    <Px x={45} y={11} w={12} h={9} className="sc-screen" />
    <Px x={46} y={12} w={5} className="sc-line sc-line--a l1" />
    <Px x={46} y={14} w={9} className="sc-line l2" />
    <Px x={46} y={16} w={6} className="sc-line l3" />
    <Px x={46} y={18} w={4} className="sc-line sc-line--a l4" />
    <Px x={51} y={18} className="sc-cursor" />
    <Px x={50} y={21} w={2} h={1} className="sc-slot" />
    <Px x={43} y={22} w={17} h={1} className="sc-desk" />
    <Px x={44} y={23} w={1} h={FLOOR - 23} className="sc-desk" />
    <Px x={58} y={23} w={1} h={FLOOR - 23} className="sc-desk" />

    {/* Polvo flotando */}
    <Px x={24} y={6} className="sc-dust" />
    <Px x={40} y={8} className="sc-dust sc-dust--b" />
    <Px x={19} y={12} className="sc-dust sc-dust--c" />

    {/* Mascota, apoyada sobre el suelo */}
    <g transform={`translate(${(WIDTH - CREATURE_COLS) / 2 + 1} ${FLOOR - CREATURE_ROWS + 1})`}>
      <g className="scene-bot">
        <Creature />
      </g>
    </g>

    {/* Suelo */}
    <Px x={0} y={FLOOR} w={WIDTH} h={1} className="sc-floor" />
  </svg>
);

export default PixelScene;
