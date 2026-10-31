import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
// node glitch-estados.mjs <estados.html>  → los estados de la mascota "glitch" del sitio
// Lee el sprite, los cuerpos de cada cara y los ojos de src/lib/creature.js, así que siempre muestra lo que hay en el sitio.
const root = fileURLToPath(new URL("../../", import.meta.url));
const { MASCOTS } = await import(pathToFileURL(root + "src/lib/creature.js").href);
const M = MASCOTS.glitch;

// Paleta del sitio (--px-*, --accent, --ok en src/styles/shell.css). Los tonos tenues llevan su opacidad.
const P = { g: "#5a5680", r: "#2b2940", o: "#7a63c9", k: "#050508", m: "#3a3856", b: "#1d1c2c", a: "#bca6ff", u: "#bca6ff", v: "#7fdcaa", U: "#bca6ff", V: "#7fdcaa", p: "#7fdcaa" };
const ALPHA = { u: 0.3, v: 0.22, U: 0.16, V: 0.12 };
const TONES = { ok: ["#7fdcaa", 1], acc: ["#bca6ff", 1], dim: ["#bca6ff", 0.55], okd: ["#7fdcaa", 0.45], white: ["#e8e9f0", 1] };

const OX = 6, OY = 6; // hueco a los lados y arriba para las "z" y el salto
const W = M.cols + OX * 2, H = OY + M.rows + 1;
const S = 8;

const idle = M.eyes.idle;
const FACES = [
  { label: "reposo", eyes: idle },
  { label: "parpadeo", eyes: idle.filter(([, y]) => y === 7) },
  { label: "mira a la izquierda", eyes: idle.map(([x, y, t]) => [x - 1, y, t]) },
  { label: "mira a la derecha", eyes: idle.map(([x, y, t]) => [x + 1, y, t]) },
  { label: "curioso (cursor cerca)", face: "curious" },
  { label: "sorprendido (salta)", face: "surprised", jump: 1 },
  { label: "mareado (muchos clics)", face: "dizzy" },
  { label: "contento (sobre un botón)", face: "happy" },
  { label: "dormido", face: "sleeping", sleep: true },
  { label: "consola (escribe un comando)", face: "console" },
];

const R = (x, y, fill, o = 1, s = 1) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${fill}"${o < 1 ? ` fill-opacity="${o}"` : ""}/>`;

const Z = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [3, 1], [2, 2], [1, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4]];
const zzz = () => [[M.cols - 5, 1], [M.cols - 2, -4]].flatMap(([x, y]) => Z.map(([dx, dy]) => R(x + dx * 0.6 + OX, y + dy * 0.6 + OY, P.a, 0.8, 0.6))).join("");

const panel = (state) => {
  const jump = state.jump ?? 0;
  const cells = (state.face && M.faceCells[state.face]) || M.cells;
  const eyeCells = state.eyes ?? M.eyes[state.face];
  const body = cells.filter(({ char }) => char !== "s").map(({ char, x, y }) => ({
    x,
    y,
    fill: state.sleep && char === "o" ? P.r : P[char],
    o: (ALPHA[char] ?? 1) * (state.sleep && char === "p" ? 0.45 : 1),
  }));
  // dormido: el CSS pinta todos los ojos en gris
  const eyes = eyeCells.map(([x, y, tone]) => {
    const [fill, o] = state.sleep ? ["#827e9c", 1] : TONES[tone ?? "white"];
    return { x, y, fill, o };
  });
  const shadowCells = M.shadow.filter(({ x }) => !jump || (x > 5 && x < M.cols - 6));

  const out = [
    `<rect width="${W}" height="${H}" fill="#101018"/>`,
    ...shadowCells.map(({ x, y }) => R(x + OX, y + OY, P.a, 0.07)),
    ...[...body, ...eyes].map((c) => R(c.x + OX, c.y + OY - jump, c.fill, c.o)),
    // líneas de exploración sobre el cuerpo (una fila de cada tres, sin la sombra)
    ...Array.from({ length: M.rows - 1 }, (_, y) => y).filter((y) => y % 3 === 2).map((y) => `<rect x="${OX}" y="${y + OY - jump}" width="${M.cols}" height="1" fill="#000" fill-opacity="0.1"/>`),
    state.sleep ? zzz() : "",
    `<rect y="${H - 1}" width="${W}" height="1" fill="#2b2940"/>`,
  ];
  return `<svg width="${W * S}" height="${H * S}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${out.join("")}</svg>`;
};

const css = `<style>.g{display:grid;grid-template-columns:repeat(5,${W * S}px);gap:20px;padding:20px;width:max-content}figure{margin:0}figcaption{padding-top:8px;font-size:16px;text-align:center}</style>`;
writeFileSync(
  process.argv[2],
  `<body style="margin:0;background:#0a0a0f;font-family:monospace;color:#a9a4c4">${css}<div class="g">${FACES.map((state) => `<figure>${panel(state)}<figcaption>${state.label}</figcaption></figure>`).join("")}</div></body>`
);
