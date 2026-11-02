import { useEffect, useId, useRef } from "react";
import { useMascot } from "../lib/mascot";

// El cuarto se dibujó primero con 60 de ancho; se ensanchó para dejar aire entre la mascota y los muebles.
// Lo que va a la derecha (monitor y escritorio) se corre SHIFT píxeles; la mascota queda centrada.
const BASE_WIDTH = 60;
const WIDTH = 70;
const SHIFT = WIDTH - BASE_WIDTH;
const FLOOR = 26;
const HEIGHT = FLOOR + 1; // la escena termina en la línea del suelo: así se puede alinear con otros elementos

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

// Aura: partículas alrededor del cuerpo, nunca por debajo de los pies (el suelo está en y=26). Es un arco por
// encima de la cabeza y dos costados que bajan hasta los pies. Su tamaño sale de la mascota (`aura` en creature.js).
const FEET_Y = 25; // ninguna partícula pasa de aquí hacia abajo
const rad = (degrees) => (degrees * Math.PI) / 180;
const shapeOf = (mascot) => ({
  cx: (WIDTH - mascot.cols) / 2 + 1 + mascot.cols / 2, // centro de la criatura
  half: mascot.cols / 2 + 1, // los costados quedan justo fuera del cuerpo
  ...mascot.aura,
});
const onArc = (shape, degrees, band = 1) => [
  Math.round(shape.cx + Math.cos(rad(degrees)) * shape.rx * band),
  Math.round(shape.cy + Math.sin(rad(degrees)) * shape.ry * band),
];

// Partículas fijas: cuatro sobre el arco y dos en los costados. [x, y, empuje en x, empuje en y]; con duración,
// retardo y tono distintos para que no titilen todas a la vez. Se calculan una vez por mascota.
const auraCache = new Map();
const auraOf = (mascot) => {
  if (!auraCache.has(mascot.name)) {
    const shape = shapeOf(mascot);
    const spots = [
      ...[215, 250, 290, 325].map((degrees) => [
        ...onArc(shape, degrees),
        Math.sign(Math.round(Math.cos(rad(degrees)) * 1.4)),
        Math.sign(Math.round(Math.sin(rad(degrees)) * 1.4)),
      ]),
      [shape.cx - shape.half, 21, -1, 0],
      [shape.cx + shape.half, 21, 1, 0],
    ];
    auraCache.set(
      mascot.name,
      spots.map(([x, y, pushX, pushY], i) => [x, y, pushX, pushY, 2.8 + (i % 4) * 0.5, -((i * 0.37) % 3), ["a", "b", "c"][i % 3]])
    );
  }
  return auraCache.get(mascot.name);
};

// Aura de cenizas (la del encapuchado): píxeles que se desprenden del borde del propio cuerpo y se van flotando
// hacia fuera y hacia arriba mientras se apagan. Cada uno nace en una celda del borde, con el color de esa celda.
// Los bordes salen del sprite: dx y dy indican hacia dónde da la cara libre de la celda.
const edgeCache = new Map();
const edgeOf = (mascot) => {
  if (!edgeCache.has(mascot.name)) {
    const body = new Set(mascot.cells.filter(({ char }) => char !== "s").map(({ x, y }) => `${x},${y}`));
    const has = (x, y) => body.has(`${x},${y}`);
    edgeCache.set(
      mascot.name,
      mascot.cells
        .filter(({ char, x, y }) => char !== "s" && (!has(x - 1, y) || !has(x + 1, y) || !has(x, y - 1)))
        .map(({ char, x, y }) => ({ char, x, y, dx: has(x + 1, y) ? (has(x - 1, y) ? 0 : -1) : 1, dy: has(x, y - 1) ? 0 : -1 }))
    );
  }
  return edgeCache.get(mascot.name);
};

const ASH_COUNT = 14;
const ashCache = new Map();
const ashOf = (mascot) => {
  if (!ashCache.has(mascot.name)) {
    const next = seeded(4711);
    const edge = [...edgeOf(mascot)];
    const picks = Array.from({ length: Math.min(ASH_COUNT, edge.length) }, () => edge.splice(Math.floor(next() * edge.length), 1)[0]);
    ashCache.set(
      mascot.name,
      picks.map((cell) => {
        const seconds = 3.2 + next() * 2.2;
        const tone = next() < 0.3 || "at".includes(cell.char) ? "acc" : cell.char === "m" ? "m" : "b";
        return {
          x: cell.x,
          y: cell.y,
          ax: Math.round(cell.dx * (4 + next() * 3) + (cell.dx === 0 ? (next() - 0.5) * 4 : 0)),
          ay: Math.round(cell.dy * (2 + next() * 2) - (2 + next() * 3)),
          tone,
          seconds,
          delay: -(next() * seconds),
        };
      })
    );
  }
  return ashCache.get(mascot.name);
};

// Aura de estática (la del glitch): píxeles que titilan en su sitio en una franja de 1 a 5 píxeles alrededor del
// cuerpo, como ruido de televisor. Son muchos y cada uno se enciende por ratos distintos, así que siempre hay
// unos cuantos visibles y cambian de sitio a cada instante.
const NOISE_COUNT = 28;
const haloCache = new Map();
const haloOf = (mascot) => {
  if (!haloCache.has(mascot.name)) {
    const body = new Set(mascot.cells.filter(({ char }) => char !== "s").map(({ x, y }) => `${x},${y}`));
    const near = (x, y) => {
      for (let dy = -5; dy <= 5; dy++) for (let dx = -5; dx <= 5; dx++) if (body.has(`${x + dx},${y + dy}`)) return true;
      return false;
    };
    const cells = [];
    for (let y = -6; y <= mascot.rows - 2; y++) {
      for (let x = -5; x < mascot.cols + 5; x++) if (!body.has(`${x},${y}`) && near(x, y)) cells.push([x, y]);
    }
    haloCache.set(mascot.name, cells);
  }
  return haloCache.get(mascot.name);
};

const noiseCache = new Map();
const noiseOf = (mascot) => {
  if (!noiseCache.has(mascot.name)) {
    const next = seeded(2024);
    const halo = [...haloOf(mascot)];
    const picks = Array.from({ length: Math.min(NOISE_COUNT, halo.length) }, () => halo.splice(Math.floor(next() * halo.length), 1)[0]);
    noiseCache.set(
      mascot.name,
      picks.map(([x, y]) => {
        const seconds = 1.2 + next() * 2.4;
        const tone = next();
        return { x, y, tone: tone < 0.45 ? "ok" : tone < 0.8 ? "a" : "b", level: 0.35 + next() * 0.5, seconds, delay: -(next() * seconds) };
      })
    );
  }
  return noiseCache.get(mascot.name);
};

// Aura de brillos (la de la campana): estrellitas en cruz de 3×3 que aparecen como un punto, crecen hasta la cruz,
// titilan y se apagan, en sitios repartidos a 2 a 5 píxeles de la cabeza y los hombros (nunca sobre el cuerpo ni
// cerca de la cadera). Cada una tiene su propia duración y retardo, así siempre hay algunas brillando.
const GLINT_COUNT = 6;
const GLINT_ARMS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const glintHaloCache = new Map();
const glintHaloOf = (mascot) => {
  if (!glintHaloCache.has(mascot.name)) {
    const body = new Set(mascot.cells.filter(({ char }) => char !== "s").map(({ x, y }) => `${x},${y}`));
    const distance = (x, y) => {
      let best = 9;
      for (let dy = -5; dy <= 5; dy++) {
        for (let dx = -5; dx <= 5; dx++) if (body.has(`${x + dx},${y + dy}`)) best = Math.min(best, Math.max(Math.abs(dx), Math.abs(dy)));
      }
      return best;
    };
    const cells = [];
    for (let y = -6; y <= mascot.rows - 6; y++) {
      for (let x = -6; x < mascot.cols + 6; x++) {
        const d = body.has(`${x},${y}`) ? 0 : distance(x, y);
        if (d >= 2 && d <= 5) cells.push([x, y]);
      }
    }
    glintHaloCache.set(mascot.name, cells);
  }
  return glintHaloCache.get(mascot.name);
};

const glintCache = new Map();
const glintsOf = (mascot) => {
  if (!glintCache.has(mascot.name)) {
    const next = seeded(909);
    const halo = glintHaloOf(mascot);
    const picks = [];
    for (let attempt = 0; attempt < 400 && picks.length < GLINT_COUNT; attempt++) {
      const cell = halo[Math.floor(next() * halo.length)];
      if (picks.every(([x, y]) => Math.max(Math.abs(x - cell[0]), Math.abs(y - cell[1])) >= 4)) picks.push(cell);
    }
    glintCache.set(
      mascot.name,
      picks.map(([x, y]) => {
        const seconds = 3.2 + next() * 2.8;
        return { x, y, tone: next() < 0.6 ? "b" : "a", seconds, delay: -(next() * seconds) };
      })
    );
  }
  return glintCache.get(mascot.name);
};

// Franjas de la falla (la del glitch): [arriba, abajo] de cada una, a partir de las filas de corte; la primera y la
// última se extienden de sobra para cubrir toda la mascota.
const tearBands = (mascot) => {
  const edges = [-12, ...mascot.tear, mascot.rows + 12];
  return edges.slice(0, -1).map((top, i) => [top, edges[i + 1]]);
};

// Destello del clic: unos pocos píxeles aparecen al azar sobre el arco o en los costados, titilan y se
// apagan. La semilla es el número de clic: cada clic dibuja un destello distinto pero estable.
const seeded = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const sparkle = (seed, shape, mascot) => {
  const next = seeded(seed * 97 + 13);

  if (mascot.aura.glint) {
    // tres brillos en cruz a la vez, en sitios al azar de la misma franja
    const halo = glintHaloOf(mascot);
    const originX = (WIDTH - mascot.cols) / 2 + 1;
    const originY = FLOOR - mascot.rows + 1;
    return Array.from({ length: 3 }, () => {
      const [x, y] = halo[Math.floor(next() * halo.length)];
      const tone = next() < 0.6 ? "b" : "a";
      const delay = `${(next() * 0.45).toFixed(2)}s`;
      return [[0, 0], ...GLINT_ARMS].map(([dx, dy]) => ({ x: originX + x + dx, y: originY + y + dy, dx: 0, dy: 0, tone, delay }));
    }).flat();
  }

  if (mascot.aura.noise) {
    // ráfaga de nieve: píxeles que titilan en su sitio dentro de la franja de estática
    const halo = haloOf(mascot);
    const originX = (WIDTH - mascot.cols) / 2 + 1;
    const originY = FLOOR - mascot.rows + 1;
    return Array.from({ length: 10 }, () => {
      const [x, y] = halo[Math.floor(next() * halo.length)];
      const tone = next();
      const delay = `${(next() * 0.45).toFixed(2)}s`;
      return { x: originX + x, y: originY + y, dx: 0, dy: 0, tone: tone < 0.45 ? "ok" : tone < 0.8 ? "a" : "b", delay };
    });
  }

  if (mascot.aura.ash) {
    // se desprenden más píxeles del borde del cuerpo, con más empuje hacia fuera
    const edge = edgeOf(mascot);
    const originX = (WIDTH - mascot.cols) / 2 + 1;
    const originY = FLOOR - mascot.rows + 1;
    return Array.from({ length: 7 }, () => {
      const cell = edge[Math.floor(next() * edge.length)];
      const tone = next() < 0.35 ? "a" : "m";
      const delay = `${(next() * 0.45).toFixed(2)}s`;
      const dx = cell.dx === 0 ? Math.round((next() - 0.5) * 3) : Math.round(cell.dx * (2 + next() * 2));
      return { x: originX + cell.x, y: originY + cell.y, dx, dy: Math.round(cell.dy * 2 - 1 - next() * 2), tone, delay };
    });
  }
  return Array.from({ length: 5 }, () => {
    const tone = ["a", "b", "c"][Math.floor(next() * 3)];
    const delay = `${(next() * 0.45).toFixed(2)}s`;

    if (next() < 0.3) {
      // costado: pegado a la pared del cuerpo, de la altura de los ojos a los pies
      const left = next() < 0.5;
      const out = Math.floor(next() * 2);
      const y = Math.round(16 + next() * (FEET_Y - 16));
      return { x: left ? shape.cx - shape.half - out : shape.cx + shape.half + out, y, dx: left ? -1 : 1, dy: 0, tone, delay };
    }

    const degrees = 190 + next() * 160;
    const [x, y] = onArc(shape, degrees, 1 + next() * 0.35);
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

// Decoración de la pared: una pieza de la mascota (mascot.wall, ver creature.js) en un hueco de 9×7 píxeles desde y=1,
// con marco o sin él. Cada letra del dibujo es un color (clase sc-art--<letra> en shell.css).
const WallArt = ({ x, piece }) => {
  const inset = piece.frame ? 1 : 0;
  return (
    <g>
      {piece.frame && <Box x={x} y={1} w={9} h={7} />}
      {piece.rows.flatMap((row, dy) =>
        [...row].map((char, dx) =>
          char === "." ? null : <Px key={`${dx}-${dy}`} x={x + inset + dx} y={1 + inset + dy} className={`sc-art sc-art--${char}`} />
        )
      )}
    </g>
  );
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
export const Creature = ({ face = "idle", id }) => {
  const mascot = useMascot();
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
    <g id={id} ref={bodyRef} className={`mascot--${mascot.name}`}>
      {/* Bajo los ojos hay visor: así no quedan huecos cuando los ojos cambian de forma o de sitio */}
      {(mascot.faceCells[face] ?? mascot.cells).filter(({ char }) => char !== "s").map(({ char, x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className={`px px-${char === "E" ? "k" : char}`} />
      ))}
      <g className="creature-gaze" ref={gazeRef}>
        <g className="creature-look">
          <g className="creature-eyes">
            {(mascot.eyes[face] ?? mascot.eyes.idle).map(([x, y, tone]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className={`px px-E${tone ? ` eye-${tone}` : ""}`} />
            ))}
          </g>
        </g>
      </g>
      {/* Líneas de exploración: una fila tenue de cada tres, sobre el cuerpo y los ojos (sin la sombra) */}
      {mascot.scan && Array.from({ length: mascot.rows - 1 }, (_, y) => y).filter((y) => y % 3 === 2).map((y) => (
        <rect key={y} x="0" y={y} width={mascot.cols} height="1" className="px-scan" />
      ))}
    </g>
  );
};

// Escena: sala de servidores con racks, un escritorio con monitor y la mascota en medio.
// mood = "idle" (tranquila) o "busy" (el monitor trabaja más rápido).
// face = la cara de la mascota: "idle", "curious", "surprised", "sleeping", "happy", "dizzy", "angry" o "console".
// flares = números de los clics cuyo destello sigue en marcha (el más nuevo al final): con cada clic aparecen píxeles
// al azar alrededor del cuerpo y se acumulan. Quien la usa los retira cuando terminan: un destello que se queda
// dibujado vuelve a animarse cada vez que el panel se oculta y se muestra. hop = hace su animación del clic (1 o -1: hacia
// qué lado se corre, si la mascota se desliza).
const PixelScene = ({ mood = "idle", face = "idle", flares = [], hop = false, className = "" }) => {
  const mascot = useMascot();
  const botId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const shape = shapeOf(mascot);
  const aura = auraOf(mascot);

  return (
    <svg
      className={`scene scene--${mood} face-${face} bot-${mascot.name}${hop ? " is-hop" : ""} ${className}`.trim()}
      style={hop ? { "--dash": hop } : undefined}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {/* Decoración de la pared (de cada mascota), a la misma distancia (14) del centro y sin tocar el rack ni el monitor */}
      <WallArt x={shape.cx - 18} piece={mascot.wall[0]} />
      <WallArt x={shape.cx + 10} piece={mascot.wall[1]} />

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

      {/* Aura: partículas que envuelven el cuerpo. Van detrás de la mascota, así solo asoman por fuera. */}
      {!(mascot.aura.ash || mascot.aura.noise || mascot.aura.glint) && (
        <g className="sc-aura-ring">
          {aura.map(([x, y, pushX, pushY, seconds, delay, tone]) => (
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
      )}

      {/* Destello del clic: cada clic tiene su propio grupo (clave = número de clic), así los anteriores
          siguen su animación y los nuevos se acumulan en lugar de reiniciarse. */}
      {flares.map((clic) => (
        <g key={clic} className="sc-flare">
          {sparkle(clic, shape, mascot).map((bit, i) => (
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
      <g transform={`translate(${(WIDTH - mascot.cols) / 2 + 1} ${FLOOR - mascot.rows + 1})`}>
        <g className="creature-shadow">
          {mascot.shadow.map(({ x, y }) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className="px px-s" />
          ))}
        </g>
        <g className="scene-bot">
          {mascot.aura.ash && (
            <g className="sc-aura-ring">
              {ashOf(mascot).map(({ x, y, ax, ay, tone, seconds, delay }) => (
                <rect
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  width="1"
                  height="1"
                  className={`sc-ash sc-ash--${tone}`}
                  style={{ "--ax": ax, "--ay": ay, animationDuration: `${seconds}s`, animationDelay: `${delay}s` }}
                />
              ))}
            </g>
          )}
          {mascot.aura.glint && (
            <g className="sc-aura-ring">
              {glintsOf(mascot).map(({ x, y, tone, seconds, delay }) => (
                <g
                  key={`${x}-${y}`}
                  className={`sc-shine sc-shine--${tone}`}
                  style={{ "--secs": `${seconds}s`, "--delay": `${delay}s` }}
                >
                  <rect x={x} y={y} width="1" height="1" />
                  {GLINT_ARMS.map(([dx, dy]) => (
                    <rect key={`${dx}${dy}`} x={x + dx} y={y + dy} width="1" height="1" className="sc-shine-arm" />
                  ))}
                </g>
              ))}
            </g>
          )}
          {mascot.aura.noise && (
            <g className="sc-aura-ring">
              {noiseOf(mascot).map(({ x, y, tone, level, seconds, delay }) => (
                <rect
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  width="1"
                  height="1"
                  className={`sc-noise sc-noise--${tone}`}
                  style={{ "--o": level, animationDuration: `${seconds}s`, animationDelay: `${delay}s` }}
                />
              ))}
            </g>
          )}
          {mascot.trail && <use href={`#${botId}`} className="sc-ghost" />}
          <g className="sc-dash">
            <Creature face={face} id={botId} />
          </g>
          {mascot.tear && (
            <>
              {/* Falla: tres copias del cuerpo, cada una recortada a una franja, que solo se ven mientras dura el clic */}
              <defs>
                {tearBands(mascot).map(([top, bottom], i) => (
                  <clipPath key={i} id={`${botId}-tear${i}`}>
                    <rect x={-12} y={top} width={mascot.cols + 24} height={bottom - top} />
                  </clipPath>
                ))}
              </defs>
              {tearBands(mascot).map((_, i) => (
                <g key={i} className="sc-tear" clipPath={`url(#${botId}-tear${i})`}>
                  <use href={`#${botId}`} className={`sc-tear-band sc-tear-band--${i}`} />
                </g>
              ))}
            </>
          )}
        </g>
      </g>

      {/* Suelo */}
      <Px x={0} y={FLOOR} w={WIDTH} h={1} className="sc-floor" />
    </svg>
  );
};

export default PixelScene;
