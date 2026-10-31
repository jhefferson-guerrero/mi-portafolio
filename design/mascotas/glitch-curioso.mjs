import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
// node glitch-curioso.mjs <salida.html>  → opciones para la cara "curioso" (cursor cerca) de la mascota glitch
// Lee el sprite de src/lib/creature.js. Las coordenadas de las opciones son las del visor de la campana (x 5-16, y 4-9).
const root = fileURLToPath(new URL("../../", import.meta.url));
const { MASCOTS } = await import(pathToFileURL(root + "src/lib/creature.js").href);
const M = MASCOTS.glitch;
const PAD = 2;

const P = { g: "#5a5680", r: "#2b2940", o: "#7a63c9", k: "#050508", m: "#3a3856", b: "#1d1c2c", a: "#bca6ff", u: "#bca6ff", v: "#7fdcaa", U: "#bca6ff", V: "#7fdcaa", p: "#7fdcaa" };
const ALPHA = { u: 0.3, v: 0.22, U: 0.16, V: 0.12 };
const TONES = { ok: ["#7fdcaa", 1], acc: ["#bca6ff", 1], dim: ["#bca6ff", 0.55], okd: ["#7fdcaa", 0.45] };
const OX = 4, OY = 3, S = 8;
const W = M.cols + OX * 2, H = OY + M.rows + 1;

const block = (x, y, w, h) => Array.from({ length: w * h }, (_, i) => [x + (i % w), y + Math.floor(i / w)]);
const as = (list, tone) => list.map(([x, y]) => [x, y, tone]);
const move = (list, dx, dy) => list.map(([x, y]) => [x + dx, y + dy]);

const SL = [[6, 6], [7, 6], [7, 7], [8, 7], [9, 7]];
const SR = [[14, 6], [15, 6], [14, 7], [13, 7], [12, 7]];
const SLITS = [...SL, ...SR];
const diamond = (cx, cy) => [[cx, cy - 1], [cx - 1, cy], [cx + 1, cy], [cx, cy + 1]];
const question = [[8, 4], [9, 4], [10, 4], [10, 5], [10, 6], [9, 7], [9, 9]];

const OPTIONS = [
  {
    label: "actual · ojos partidos + cuerpo rasgado",
    face: "curious",
    eyes: [...as(block(6, 5, 3, 3), "dim"), ...as(block(11, 5, 3, 3), "dim"),
      ...as([[7, 5], [8, 5], [9, 5], [8, 6], [9, 6], [10, 6], [7, 7], [8, 7], [9, 7], [12, 5], [13, 5], [14, 5], [11, 6], [12, 6], [13, 6], [12, 7], [13, 7], [14, 7]], "ok")],
  },
  { label: "A · un ojo se abre (ceja levantada)", eyes: [...as(SL, "ok"), ...as(block(11, 5, 3, 3), "dim"), ...as(block(12, 5, 3, 3), "ok")] },
  { label: "B · escáner: te revisa", eyes: [...as(block(6, 5, 10, 1), "dim"), ...as(block(9, 5, 4, 1), "acc"), ...as(SLITS, "ok")] },
  { label: "C · aberración de color", eyes: [...as(move(SLITS, -1, 0), "dim"), ...as(move(SLITS, 1, 0), "okd"), ...as(SLITS, "ok")] },
  { label: "D · ojos de rombo", eyes: [...as(move(diamond(8, 6), -1, 0).concat(move(diamond(13, 6), -1, 0)), "dim"), ...as(diamond(8, 6), "ok"), ...as([[8, 6]], "acc"), ...as(diamond(13, 6), "ok"), ...as([[13, 6]], "acc")] },
  { label: "E · signo de pregunta", eyes: [...as(move(question, -1, 0), "dim"), ...as(question, "ok")].map(([x, y, t]) => [x + 2, y, t]) },
  { label: "F · solo el cuerpo se rasga", face: "curious", eyes: as(SLITS, "ok") },
];

const R = (x, y, fill, o = 1) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"${o < 1 ? ` fill-opacity="${o}"` : ""}/>`;
const panel = (option) => {
  const source = (option.face && M.faceCells[option.face]) || M.cells;
  const body = source.filter(({ char }) => char !== "s").map(({ char, x, y }) => [x, y, P[char], ALPHA[char] ?? 1]);
  // la última celda de un mismo sitio gana, como en el sitio
  const eyes = [...new Map(option.eyes.map(([x, y, t]) => [`${x},${y}`, [x + PAD, y, ...TONES[t]]])).values()];
  const out = [
    `<rect width="${W}" height="${H}" fill="#101018"/>`,
    ...M.shadow.map(({ x, y }) => R(x + OX, y + OY, P.a, 0.07)),
    ...body.map(([x, y, fill, o]) => R(x + OX, y + OY, fill, o)),
    ...eyes.map(([x, y, fill, o]) => R(x + OX, y + OY, fill, o)),
    ...Array.from({ length: M.rows - 1 }, (_, y) => y).filter((y) => y % 3 === 2).map((y) => `<rect x="${OX}" y="${y + OY}" width="${M.cols}" height="1" fill="#000" fill-opacity="0.1"/>`),
    `<rect y="${H - 1}" width="${W}" height="1" fill="#2b2940"/>`,
  ];
  return `<svg width="${W * S}" height="${H * S}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${out.join("")}</svg>`;
};

const css = `<style>.g{display:grid;grid-template-columns:repeat(4,${W * S}px);gap:18px;padding:20px;width:max-content}figure{margin:0}figcaption{padding-top:8px;font-size:15px;text-align:center}</style>`;
writeFileSync(
  process.argv[2],
  `<body style="margin:0;background:#0a0a0f;font-family:monospace;color:#a9a4c4">${css}<div class="g">${OPTIONS.map((o) => `<figure>${panel(o)}<figcaption>${o.label}</figcaption></figure>`).join("")}</div></body>`
);
