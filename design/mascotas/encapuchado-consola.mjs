import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
// node encapuchado-consola.mjs <salida.html>  → opciones para la cara "consola" (cuando se escribe un comando) del encapuchado
// Lee el sprite de src/lib/creature.js. El visor mide x 6-15, y 6-9; el centro está entre x 10 y 11.
const root = fileURLToPath(new URL("../../", import.meta.url));
const { MASCOTS } = await import(pathToFileURL(root + "src/lib/creature.js").href);
const M = MASCOTS.encapuchado;
const COLS = M.cols;

const P = { m: ["#3a3856", 1], b: ["#1d1c2c", 1], r: ["#2b2940", 1], k: ["#050508", 1], a: ["#bca6ff", 1], t: ["#7a63c9", 0.7] };
const TONES = { ok: ["#7fdcaa", 1], okd: ["#7fdcaa", 0.45], acc: ["#bca6ff", 1], dim: ["#bca6ff", 0.55], eye: ["#bca6ff", 1] };
const OX = 6, OY = 3, S = 8;
const W = COLS + OX * 2, H = OY + M.rows + 1;

const as = (list, tone) => list.map(([x, y]) => [x, y, tone]);
const mirror = (list) => [...list, ...list.map(([x, y]) => [COLS - 1 - x, y])];
const SLIT = [[7, 7], [8, 7], [8, 8], [9, 8]];
const slitDown = [[7, 8], [8, 8], [8, 9], [9, 9]];

// el cuerpo con los circuitos encendidos en verde (la tela "trabaja")
const greenCircuits = { t: ["#7fdcaa", 0.6], a: ["#7fdcaa", 1] };

const OPTIONS = [
  { label: "actual · prompt con cursor", eyes: M.eyes.console },
  {
    label: "A · texto que se escribe",
    eyes: [...as([[7, 6], [8, 6], [9, 6], [10, 6], [11, 6], [12, 6], [13, 6], [14, 6]], "okd"), ...as([[7, 8], [8, 8], [9, 8], [10, 8], [11, 8]], "ok"), ...as([[13, 8], [13, 9]], "acc")],
  },
  {
    label: "B · mira el teclado",
    eyes: [...as(mirror(slitDown), "eye"), ...as([[8, 6], [10, 6], [11, 6], [13, 6]], "okd")],
  },
  { label: "C · los circuitos se encienden", eyes: as(mirror(SLIT), "eye"), body: greenCircuits },
  {
    label: "D · los ojos son el prompt",
    eyes: [...as([[7, 6], [8, 7], [7, 8]], "ok"), ...as([[12, 8], [13, 8], [14, 8]], "ok"), ...as([[15, 6], [15, 7], [15, 8]], "acc")],
  },
  { label: "E · mira el teclado + circuitos", eyes: as(mirror(slitDown), "eye"), body: greenCircuits },
  {
    label: "F · circuitos + texto en el visor",
    eyes: [...as([[7, 7], [8, 7], [9, 7], [10, 7], [11, 7], [12, 7]], "ok"), ...as([[7, 9], [8, 9], [9, 9]], "okd"), ...as([[11, 9], [11, 8]], "acc")],
    body: greenCircuits,
  },
];

const R = (x, y, fill, o = 1) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"${o < 1 ? ` fill-opacity="${o}"` : ""}/>`;
const panel = (option) => {
  const body = M.cells.filter(({ char }) => char !== "s").map(({ char, x, y }) => [x, y, ...((option.body?.[char]) ?? P[char])]);
  // la última celda de un mismo sitio gana, como en el sitio
  const eyes = [...new Map(option.eyes.map(([x, y, t]) => [`${x},${y}`, [x, y, ...TONES[t]]])).values()];
  const out = [
    `<rect width="${W}" height="${H}" fill="#101018"/>`,
    ...M.shadow.map(({ x, y }) => R(x + OX, y + OY, "#bca6ff", 0.07)),
    ...body.map(([x, y, fill, o]) => R(x + OX, y + OY, fill, o)),
    ...eyes.map(([x, y, fill, o]) => R(x + OX, y + OY, fill, o)),
    `<rect y="${H - 1}" width="${W}" height="1" fill="#2b2940"/>`,
  ];
  return `<svg width="${W * S}" height="${H * S}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${out.join("")}</svg>`;
};

const css = `<style>.g{display:grid;grid-template-columns:repeat(4,${W * S}px);gap:18px;padding:20px;width:max-content}figure{margin:0}figcaption{padding-top:8px;font-size:15px;text-align:center}</style>`;
writeFileSync(
  process.argv[2],
  `<body style="margin:0;background:#0a0a0f;font-family:monospace;color:#a9a4c4">${css}<div class="g">${OPTIONS.map((o) => `<figure>${panel(o)}<figcaption>${o.label}</figcaption></figure>`).join("")}</div></body>`
);
