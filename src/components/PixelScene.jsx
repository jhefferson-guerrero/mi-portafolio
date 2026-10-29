import { useEffect, useRef } from "react";
import { CREATURE_CELLS, CREATURE_COLS, CREATURE_ROWS, EYES } from "../lib/creature";

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

// Aura: un anillo de partículas alrededor del cuerpo (centro en la criatura), también bajo los pies.
// El suelo está en y=26 y el dibujo mide 30 de alto, así que abajo el anillo se queda en y<=28.
const CENTER_X = 31;
const CENTER_Y = 17;
const toward = (angle, rx, ryUp, ryDown) => {
  const ry = Math.sin(angle) > 0 ? ryDown : ryUp;
  return [Math.round(CENTER_X + Math.cos(angle) * rx), Math.round(CENTER_Y + Math.sin(angle) * ry)];
};

// Partículas fijas del aura: [x, y, empuje en x, empuje en y, duración, retardo, tono].
const AURA = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2 + (i % 2) * 0.18;
  const jitter = 1 + (((i * 7) % 5) - 2) * 0.06;
  const [x, y] = toward(angle, 12 * jitter, 10 * jitter, 10.5 * jitter);
  return [x, Math.min(y, 28), Math.sign(Math.round(Math.cos(angle) * 1.4)), Math.sign(Math.round(Math.sin(angle) * 1.4)), 2.8 + (i % 4) * 0.5, -((i * 0.37) % 3), ["a", "b", "c"][i % 3]];
});

// Destello del clic: unos pocos píxeles aparecen al azar en la franja que rodea el cuerpo, titilan y se
// apagan. La semilla es el número de clic: cada clic dibuja un destello distinto pero estable.
const seeded = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const sparkle = (seed) => {
  const next = seeded(seed * 97 + 13);
  return Array.from({ length: 8 }, () => {
    const angle = next() * Math.PI * 2;
    const band = 1 + next() * 0.5;
    const [x, y] = toward(angle, 11 * band, 9.5 * band, 9.5 * band);
    const top = Math.min(y, 28);
    return {
      x,
      y: top,
      dx: Math.round(Math.cos(angle) * 2),
      dy: Math.sin(angle) > 0 ? Math.min(Math.round(Math.sin(angle) * 2), 28 - top) : Math.round(Math.sin(angle) * 2),
      tone: ["a", "b", "c"][Math.floor(next() * 3)],
      delay: `${(next() * 0.45).toFixed(2)}s`,
    };
  });
};

// Cuánto se pueden mover los ojos dentro del visor, en píxeles del dibujo, y a qué distancia
// del cursor (en píxeles de pantalla) llegan al máximo.
const GAZE_X = 2;
const GAZE_Y = 1;
const GAZE_REACH_X = 260;
const GAZE_REACH_Y = 160;
const clamp = (value) => Math.max(-1, Math.min(1, value));

// La criatura: cuerpo fijo y ojos que parpadean y miran a los lados. Mientras el cursor está
// en la ventana los ojos lo siguen de a un píxel; si sale, vuelven a mirar a los lados solos.
const Creature = ({ face = "idle" }) => {
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
      {/* Bajo los ojos hay visor: así no quedan huecos cuando los ojos cambian de forma o de sitio */}
      {CREATURE_CELLS.map(({ char, x, y }) => (
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
// burst = cuenta de clics: cada vez que sube, aparecen píxeles al azar alrededor del cuerpo. hop = salta un poco.
const PixelScene = ({ mood = "idle", face = "idle", burst = 0, hop = false, className = "" }) => (
  <svg
    className={`scene scene--${mood} face-${face}${hop ? " is-hop" : ""} ${className}`.trim()}
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

    {/* Destello del clic: píxeles al azar junto al cuerpo; la clave cambia con cada clic y la animación vuelve a empezar */}
    {burst > 0 && (
      <g key={burst} className="sc-flare">
        {sparkle(burst).map((bit, i) => (
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
    )}

    {/* Mascota, apoyada sobre el suelo */}
    <g transform={`translate(${(WIDTH - CREATURE_COLS) / 2 + 1} ${FLOOR - CREATURE_ROWS + 1})`}>
      <g className="scene-bot">
        <Creature face={face} />
      </g>
    </g>

    {/* Suelo */}
    <Px x={0} y={FLOOR} w={WIDTH} h={1} className="sc-floor" />
  </svg>
);

export default PixelScene;
