import { useEffect, useRef } from "react";
import { CREATURE_CELLS, CREATURE_COLS, CREATURE_ROWS, EYES, SHADOW_CELLS } from "../lib/creature";

// El cuarto se dibujó primero con 60 de ancho; se ensanchó para dejar aire entre la mascota y los muebles.
// Lo que va a la derecha (monitor y escritorio) se corre SHIFT píxeles; la mascota queda centrada.
const BASE_WIDTH = 60;
const WIDTH = 70;
const SHIFT = WIDTH - BASE_WIDTH;
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

// Aura: partículas alrededor del cuerpo, nunca por debajo de los pies. El cuerpo ocupa x 20-41 e y 10-26
// (el suelo está en y=26); el aura es un arco por encima de la cabeza y dos costados que bajan hasta los pies.
const CENTER_X = (WIDTH - CREATURE_COLS) / 2 + 1 + CREATURE_COLS / 2; // centro de la criatura
const CENTER_Y = 17;
const FEET_Y = 25; // ninguna partícula pasa de aquí hacia abajo
const ARC_RX = 13;
const ARC_RY = 9.5;
const rad = (degrees) => (degrees * Math.PI) / 180;
const onArc = (degrees, band = 1) => [
  Math.round(CENTER_X + Math.cos(rad(degrees)) * ARC_RX * band),
  Math.round(CENTER_Y + Math.sin(rad(degrees)) * ARC_RY * band),
];

// Partículas fijas: cuatro sobre el arco y dos en los costados. [x, y, empuje en x, empuje en y].
const AURA_SPOTS = [
  ...[215, 250, 290, 325].map((degrees) => [
    ...onArc(degrees),
    Math.sign(Math.round(Math.cos(rad(degrees)) * 1.4)),
    Math.sign(Math.round(Math.sin(rad(degrees)) * 1.4)),
  ]),
  [CENTER_X - 12, 21, -1, 0],
  [CENTER_X + 12, 21, 1, 0],
];

// Con duración, retardo y tono distintos para que no titilen todas a la vez.
const AURA = AURA_SPOTS.map(([x, y, pushX, pushY], i) => [x, y, pushX, pushY, 2.8 + (i % 4) * 0.5, -((i * 0.37) % 3), ["a", "b", "c"][i % 3]]);

// Destello del clic: unos pocos píxeles aparecen al azar sobre el arco o en los costados, titilan y se
// apagan. La semilla es el número de clic: cada clic dibuja un destello distinto pero estable.
const seeded = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const sparkle = (seed) => {
  const next = seeded(seed * 97 + 13);
  return Array.from({ length: 5 }, () => {
    const tone = ["a", "b", "c"][Math.floor(next() * 3)];
    const delay = `${(next() * 0.45).toFixed(2)}s`;

    if (next() < 0.3) {
      // costado: pegado a la pared del cuerpo, de la altura de los ojos a los pies
      const left = next() < 0.5;
      const out = Math.floor(next() * 2);
      const y = Math.round(16 + next() * (FEET_Y - 16));
      return { x: left ? CENTER_X - 12 - out : CENTER_X + 12 + out, y, dx: left ? -1 : 1, dy: 0, tone, delay };
    }

    const degrees = 190 + next() * 160;
    const [x, y] = onArc(degrees, 1 + next() * 0.35);
    return {
      x,
      y: Math.min(y, FEET_Y),
      dx: Math.round(Math.cos(rad(degrees)) * 2),
      dy: Math.round(Math.sin(rad(degrees)) * 2),
      tone,
      delay,
    };
  });
};

// Cuántos clics seguidos pueden tener su destello a la vez; los más viejos ya se apagaron.
const MAX_FLARES = 6;

// Ventana de la pared (9 de ancho por 7 de alto, desde y=1): marco, cruz de cuatro vidrios con tono de
// cielo nocturno, un par de estrellas que titilan y un reflejo en diagonal.
const WINDOW_PANES = [[0, 0], [4, 0], [0, 3], [4, 3]];
const Window = ({ x, stars }) => (
  <g>
    <Box x={x} y={1} w={9} h={7} />
    {WINDOW_PANES.map(([dx, dy]) => (
      <Px key={`${dx}-${dy}`} x={x + 1 + dx} y={2 + dy} w={3} h={2} className="sc-pane" />
    ))}
    <Px x={x + 4} y={2} w={1} h={5} className="sc-slot" />
    <Px x={x + 1} y={4} w={7} h={1} className="sc-slot" />
    {stars.map(([dx, dy], i) => (
      <Px key={`s${i}`} x={x + dx} y={dy} className={i ? "sc-star sc-star--b" : "sc-star"} />
    ))}
    <Px x={x + 7} y={2} className="sc-glint" />
    <Px x={x + 6} y={3} className="sc-glint" />
  </g>
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
export const Creature = ({ face = "idle" }) => {
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
        if (!rect.width) return; // la escena está en un panel oculto
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
      {/* Bajo los ojos hay visor: así no quedan huecos cuando los ojos cambian de forma o de sitio */}
      {CREATURE_CELLS.filter(({ char }) => char !== "s").map(({ char, x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className={`px px-${char === "E" ? "k" : char}`} />
      ))}
      <g className="creature-gaze" ref={gazeRef}>
        <g className="creature-look">
          <g className="creature-eyes">
            {(EYES[face] ?? EYES.idle).map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className="px px-E" />
            ))}
          </g>
        </g>
      </g>
    </g>
  );
};

// Escena: sala de servidores con racks, un escritorio con monitor y la mascota en medio.
// mood = "idle" (tranquila) o "busy" (el monitor trabaja más rápido).
// face = la cara de la mascota: "idle", "curious", "surprised", "sleeping", "happy" o "dizzy".
// burst = cuenta de clics: con cada clic aparecen píxeles al azar alrededor del cuerpo y se acumulan. hop = salta un poco.
const PixelScene = ({ mood = "idle", face = "idle", burst = 0, hop = false, className = "" }) => (
  <svg
    className={`scene scene--${mood} face-${face}${hop ? " is-hop" : ""} ${className}`.trim()}
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    shapeRendering="crispEdges"
    aria-hidden="true"
    focusable="false"
  >
    {/* Ventanas de la pared, a la misma distancia (14) del centro de la mascota y sin tocar el rack ni el monitor */}
    <Window x={CENTER_X - 18} stars={[[2, 3], [6, 5]]} />
    <Window x={CENTER_X + 10} stars={[[3, 2], [7, 6]]} />

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

    {/* Escritorio y monitor, corridos a la derecha para dejar sitio a la mascota */}
    <g transform={`translate(${SHIFT} 0)`}>
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
    </g>

    {/* Polvo flotando */}
    <Px x={24} y={6} className="sc-dust" />
    <Px x={40} y={8} className="sc-dust sc-dust--b" />
    <Px x={19} y={12} className="sc-dust sc-dust--c" />

    {/* Aura: partículas que envuelven el cuerpo. Van detrás de la mascota, así solo asoman por fuera. */}
    <g className="sc-aura-ring">
      {AURA.map(([x, y, pushX, pushY, seconds, delay, tone]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="1"
          height="1"
          className={`sc-aura sc-aura--${tone}`}
          style={{ "--ox": pushX, "--oy": pushY, animationDuration: `${seconds}s`, animationDelay: `${delay}s` }}
        />
      ))}
    </g>

    {/* Destello del clic: cada clic tiene su propio grupo (clave = número de clic), así los anteriores
        siguen su animación y los nuevos se acumulan en lugar de reiniciarse. */}
    {Array.from({ length: Math.min(burst, MAX_FLARES) }, (_, k) => burst - k).map((clic) => (
      <g key={clic} className="sc-flare">
        {sparkle(clic).map((bit, i) => (
          <rect
            key={i}
            x={bit.x}
            y={bit.y}
            width="1"
            height="1"
            className={`sc-bit sc-bit--${bit.tone}`}
            style={{ "--dx": bit.dx, "--dy": bit.dy, animationDelay: bit.delay }}
          />
        ))}
      </g>
    ))}

    {/* Mascota, apoyada sobre el suelo */}
    <g transform={`translate(${(WIDTH - CREATURE_COLS) / 2 + 1} ${FLOOR - CREATURE_ROWS + 1})`}>
      <g className="creature-shadow">
        {SHADOW_CELLS.map(({ x, y }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className="px px-s" />
        ))}
      </g>
      <g className="scene-bot">
        <Creature face={face} />
      </g>
    </g>

    {/* Suelo */}
    <Px x={0} y={FLOOR} w={WIDTH} h={1} className="sc-floor" />
  </svg>
);

export default PixelScene;
