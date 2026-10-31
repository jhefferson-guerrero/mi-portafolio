import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
// node glitch-contento.mjs <salida.html>  → opciones para la cara "contento" de la mascota glitch
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

const cells = (list, tone) => list.map(([x, y]) => [x, y, tone]);
const down = (list, tone, dy = 1, dx = 0) => list.map(([x, y]) => [x + dx, y + dy, tone]);

const arcs = [[7, 7], [8, 6], [9, 7], [12, 7], [13, 6], [14, 7]];
const check = [[7, 7], [8, 8], [9, 9], [10, 8], [11, 7], [12, 6], [13, 5]];
const squint = [[7, 5], [8, 6], [9, 7], [8, 8], [7, 9], [14, 5], [13, 6], [12, 7], [13, 8], [14, 9]];
const heart = [[8, 5], [10, 5], [7, 6], [8, 6], [9, 6], [10, 6], [11, 6], [8, 7], [9, 7], [10, 7], [9, 8]];
const bars = [[7, 9], [9, 9], [9, 8], [11, 9], [11, 8], [11, 7], [13, 9], [13, 8], [13, 7], [13, 6]];
// los ojos de reposo bajan hacia el centro (ceño); aquí suben (cara suave)
const soft = [[6, 7], [7, 7], [7, 6], [8, 6], [9, 6], [15, 7], [14, 7], [14, 6], [13, 6], [12, 6]];

const OPTIONS = [
  { label: "actual · puntos y sonrisa", eyes: [...cells([[7, 5], [8, 5], [13, 5], [14, 5], [6, 7], [7, 8], [8, 9], [9, 9], [10, 9], [11, 9], [12, 9], [13, 9], [14, 8], [15, 7]], "ok")] },
  { label: "A · visto bueno (OK)", eyes: [...down(check, "dim", 0, -1), ...cells(check, "ok")] },
  { label: "B · arcos con eco", eyes: [...down(arcs, "dim", 1), ...cells(arcs, "ok")] },
  { label: "C · ojos > <", eyes: [...down(squint, "dim", 0, -1), ...cells(squint, "ok")] },
  { label: "D · corazón", eyes: [...down(heart, "ok", 0, 1).map(([x, y]) => [x, y, "okd"]), ...cells(heart, "acc")] },
  { label: "E · señal al máximo", eyes: [...cells(bars, "ok"), ...cells([[7, 9], [9, 9], [11, 9], [13, 9]], "acc")].map(([x, y, t]) => [x, y, t]) },
  { label: "F · ojos de reposo, suaves", eyes: [...cells(soft, "ok"), ...cells([[10, 5]], "acc")] },
];

const R = (x, y, fill, o = 1) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"${o < 1 ? ` fill-opacity="${o}"` : ""}/>`;
const panel = (option) => {
  const body = M.cells.filter(({ char }) => char !== "s").map(({ char, x, y }) => [x, y, P[char], ALPHA[char] ?? 1]);
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
