import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
// node glitch-propuestas.mjs <salida.html>  → propuestas de caras propias para la mascota "glitch"
// (curioso, mareado y consola), para que no se parezcan a las de la campana. Lee el sprite de src/lib/creature.js.
const root = fileURLToPath(new URL("../../", import.meta.url));
const { MASCOTS } = await import(pathToFileURL(root + "src/lib/creature.js").href);
const M = MASCOTS.glitch;
const PAD = 2;

const P = { g: "#5a5680", r: "#2b2940", o: "#7a63c9", k: "#050508", m: "#3a3856", b: "#1d1c2c", a: "#bca6ff", u: "#bca6ff", v: "#7fdcaa", p: "#7fdcaa", ok: "#7fdcaa", acc: "#bca6ff", eye: "#e8e9f0" };
const GHOST_ALPHA = { u: 0.3, v: 0.22 };
const OX = 4, OY = 3;
const W = M.cols + OX * 2, H = OY + M.rows + 1;
const S = 8;

let seed = 11;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const pick = (list) => list[Math.floor(rnd() * list.length)];

const block = (x, y, w, h) => Array.from({ length: w * h }, (_, i) => [x + (i % w), y + Math.floor(i / w)]);
// Coordenadas de las propuestas: las del sprite de la campana (visor: x 5-16, y 4-9); se les suma PAD.
const tone = (cells, t, o = 1) => cells.map(([x, y]) => [x + PAD, y, t, o]);
const SL = [[6, 6], [7, 6], [7, 7], [8, 7], [9, 7]];
const SR = [[14, 6], [15, 6], [14, 7], [13, 7], [12, 7]];
const SLITS = [...SL, ...SR];
const SQUARES = [...block(7, 5, 3, 3), ...block(12, 5, 3, 3)];

// Cuadrados con filas desplazadas y copia lila: los ojos "se parten"
const splitSquares = [
  ...tone(SQUARES.map(([x, y]) => [x - 1, y]), "acc", 0.75),
  ...tone([[7, 5], [8, 5], [9, 5], [8, 6], [9, 6], [10, 6], [7, 7], [8, 7], [9, 7], [12, 5], [13, 5], [14, 5], [11, 6], [12, 6], [13, 6], [12, 7], [13, 7], [14, 7]], "ok"),
];

const noise = (n, tones = ["ok", "acc", "eye"]) =>
  Array.from({ length: n }, () => [5 + Math.floor(rnd() * 12) + PAD, 4 + Math.floor(rnd() * 6), pick(tones), 0.35 + rnd() * 0.6]);

const debris = (cells) => cells.filter(() => rnd() > 0.15).map(([x, y]) => [x + PAD + (rnd() < 0.3 ? pick([-1, 1]) : 0), y + (rnd() < 0.4 ? pick([-1, 1]) : 0), pick(["ok", "ok", "acc", "eye"]), 1]);

const wavy = [
  ...tone([[6, 7], [7, 6], [8, 7], [9, 6]], "ok"), ...tone([[12, 6], [13, 7], [14, 6], [15, 7]], "ok"),
  ...tone([[6, 8], [7, 7], [8, 8], [9, 7]], "acc", 0.55), ...tone([[12, 7], [13, 8], [14, 7], [15, 8]], "acc", 0.55),
];

const chevron = [[6, 4], [7, 5], [8, 6], [7, 7], [6, 8]];
const rain = [6, 8, 10, 12, 14].flatMap((x) => {
  const len = 2 + Math.floor(rnd() * 4), top = 4 + Math.floor(rnd() * (6 - len + 1));
  return Array.from({ length: len }, (_, i) => [x + PAD, top + i, "ok", 0.35 + 0.65 * ((i + 1) / len)]);
});

const TEAR_MORE = { 2: -1, 5: 1, 9: -1, 10: 1, 11: -2, 13: 2 };
const TEAR_HARD = { 3: -1, 4: -2, 6: 2, 8: 2, 11: -2, 12: -3, 13: 3 };

// Cada panel: ojos propios, filas extra que se rasgan (tear), distancia de los fantasmas extra (ghost)
const ROWS = [
  [
    { label: "curioso · actual (como la campana)", eyes: M.eyes.curious.map(([x, y]) => [x, y, "eye", 1]) },
    { label: "A · ojos que se parten", eyes: splitSquares },
    { label: "B · interferencia en el visor", eyes: [...tone(SQUARES, "ok"), ...noise(9)] },
    { label: "C · el cuerpo se descompone", eyes: tone(SLITS, "ok"), tear: TEAR_MORE, ghost: 2 },
    { label: "D · ojos partidos + cuerpo", eyes: splitSquares, tear: TEAR_MORE, ghost: 2 },
  ],
  [
    { label: "mareado · actual (como la campana)", eyes: M.eyes.dizzy.map(([x, y]) => [x, y, "eye", 1]) },
    { label: "A · datos corruptos", eyes: debris(SLITS), tear: TEAR_HARD, ghost: 2 },
    { label: "B · señal perdida", eyes: noise(34), tear: { 5: 1, 9: -1 } },
    { label: "C · ojos de onda", eyes: wavy, tear: { 4: 1, 8: -1, 12: 2 } },
  ],
  [
    { label: "consola · propuesta anterior", eyes: [...tone(chevron, "ok"), ...tone([[11, 8], [12, 8], [13, 8], [14, 8]], "ok"), ...tone([[15, 5], [15, 6], [15, 7]], "acc")] },
    { label: "A · líneas de código", eyes: [...tone([...block(6, 5, 6, 1)], "ok", 0.6), ...tone(block(6, 7, 9, 1), "ok", 0.6), ...tone(block(6, 9, 3, 1), "ok"), ...tone([[10, 8], [10, 9]], "acc")] },
    { label: "B · mira y escribe", eyes: [...tone(SLITS.map(([x, y]) => [x, y - 1]), "ok"), ...tone(block(6, 9, 4, 1), "ok"), ...tone([[11, 8], [11, 9]], "acc")] },
    { label: "C · lluvia de código", eyes: rain },
  ],
];

const R = (x, y, fill, o = 1) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"${o < 1 ? ` fill-opacity="${o}"` : ""}/>`;

const panel = (face) => {
  const tear = face.tear ?? {};
  const body = M.cells.filter(({ char }) => char !== "s").map(({ char, x, y }) => ({ x: x + (tear[y] ?? 0), y, fill: P[char], o: GHOST_ALPHA[char] ?? 1 }));
  // fantasmas extra del marco a mayor distancia
  const extra = face.ghost
    ? M.cells.filter(({ char }) => char === "g" || char === "o").flatMap(({ x, y }) => [
        { x: x - face.ghost + (tear[y] ?? 0), y, fill: P.a, o: 0.16 },
        { x: x + face.ghost + (tear[y] ?? 0), y, fill: P.v, o: 0.12 },
      ])
    : [];
  const eyes = face.eyes.map(([x, y, t, o = 1]) => ({ x, y, fill: P[t], o }));
  const out = [
    `<rect width="${W}" height="${H}" fill="#101018"/>`,
    ...M.shadow.map(({ x, y }) => R(x + OX, y + OY, P.a, 0.07)),
    ...[...extra, ...body, ...eyes].map((c) => R(c.x + OX, c.y + OY, c.fill, c.o)),
    ...Array.from({ length: M.rows - 1 }, (_, y) => y).filter((y) => y % 3 === 2).map((y) => `<rect x="${OX}" y="${y + OY}" width="${M.cols}" height="1" fill="#000" fill-opacity="0.1"/>`),
    `<rect y="${H - 1}" width="${W}" height="1" fill="#2b2940"/>`,
  ];
  return `<svg width="${W * S}" height="${H * S}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${out.join("")}</svg>`;
};

const css = `<style>.g{display:grid;grid-template-columns:repeat(5,${W * S}px);gap:18px 18px;padding:20px;width:max-content}figure{margin:0}figcaption{padding-top:8px;font-size:15px;text-align:center}</style>`;
const cell = (face) => `<figure>${panel(face)}<figcaption>${face.label}</figcaption></figure>`;
const rowHtml = (faces) => `<div class="g">${faces.map(cell).join("")}</div>`;
writeFileSync(process.argv[2], `<body style="margin:0;background:#0a0a0f;font-family:monospace;color:#a9a4c4">${css}${ROWS.map(rowHtml).join("")}</body>`);
