import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
// node encapuchado-tamano.mjs <salida.html>  → el encapuchado en dos tamaños más chicos, junto a la campana y el glitch
// (misma escala y mismo suelo) para comparar cuánto ocupa cada mascota. Lee las otras de src/lib/creature.js.
const root = fileURLToPath(new URL("../../", import.meta.url));
const { MASCOTS } = await import(pathToFileURL(root + "src/lib/creature.js").href);

const mirror = (half) => half + [...half].reverse().join("");

// Mitad izquierda del encapuchado actual (la misma de creature.js), de la que salen las versiones chicas.
const HALVES = [
  "..........mm", "........mmbb", "......mmbbbb", ".....mbbbbbb", "....mbbbbbbb", "...mbbrrrrrr",
  "...mbrkkkkkk", "...mbrkkkkkk", "...mbrkkkkkk", "...mbrkkkkkk", "...mbbrrrrrr", "..mbbbbbbbbb",
  ".mbbbbbbbbab", ".mbbbbbbbbab", "mbbbbbbbbbab", "mbbbbbbbbbbb", "mbbbbbbbbbbb", "mbbbbbbbbbbb",
  "mbbbbbbbbbbb", "m.bm.bm.bm.b",
];
const shrink = ({ cols, rows }) => {
  const kept = HALVES.filter((_, y) => !rows.includes(y));
  return kept.map((half) => [...half].filter((_, x) => !cols.includes(x)).join(""));
};

// Cada versión: filas y columnas que se quitan, ojos de reposo y circuitos (sobre el sprite ya reducido).
const VARIANTS = {
  M: {
    label: "M · 22×19",
    halves: shrink({ cols: [9], rows: [17, 18] }),
    eyes: [[7, 7], [8, 7], [8, 8], [9, 8]],
    traces: [[3, 15, "a"], [4, 15, "t"], [5, 15, "t"], [6, 15, "t"], [7, 15, "t"], [7, 16, "a"], [4, 12, "a"], [5, 12, "t"], [6, 12, "t"]],
  },
  S: {
    label: "S · 20×17",
    halves: shrink({ cols: [8, 9], rows: [15, 16, 17, 18] }),
    eyes: [[6, 7], [7, 7], [7, 8], [8, 8]],
    traces: [[3, 14, "a"], [4, 14, "t"], [5, 14, "t"], [6, 14, "t"], [4, 12, "a"], [5, 12, "t"], [6, 12, "t"]],
  },
};

const build = ({ halves, eyes, traces }) => {
  const rows = halves.map(mirror);
  const cols = rows[0].length;
  const grid = rows.map((row) => [...row]);
  const shadow = Array(cols).fill(".");
  for (let x = Math.floor(cols / 2) - 4; x < Math.floor(cols / 2) + 4; x++) shadow[x] = "s";
  for (const [x, y, char] of traces) {
    grid[y][x] = char;
    grid[y][cols - 1 - x] = char;
  }
  const sprite = [...grid.map((row) => row.join("")), shadow.join("")];
  const mirrored = (list) => [...list, ...list.map(([x, y]) => [cols - 1 - x, y])];
  return { sprite, cols, rows: sprite.length, eyes: mirrored(eyes) };
};

const P = { g: ["#5a5680", 1], r: ["#2b2940", 1], o: ["#7a63c9", 1], k: ["#050508", 1], m: ["#3a3856", 1], b: ["#1d1c2c", 1], a: ["#bca6ff", 1], t: ["#7a63c9", 0.7], s: ["#bca6ff", 0.07], E: ["#e8e9f0", 1], u: ["#bca6ff", 0.3], v: ["#7fdcaa", 0.22], U: ["#bca6ff", 0.16], V: ["#7fdcaa", 0.12], p: ["#7fdcaa", 1] };
const EYE = { ok: "#7fdcaa", acc: "#bca6ff" };

const entries = [];
const fromMascot = (name, label, eyeColor) => {
  const m = MASCOTS[name];
  entries.push({
    label: `${label} · ${m.cols}×${m.rows}`,
    cols: m.cols,
    rows: m.rows,
    cells: m.cells.map(({ char, x, y }) => [x, y, ...P[char]]),
    eyes: name === "campana" ? [] : m.eyes.idle.map(([x, y, tone]) => [x, y, tone ? EYE[tone] : eyeColor]),
    scan: m.scan,
  });
};
fromMascot("campana", "campana");
fromMascot("glitch", "glitch");
fromMascot("encapuchado", "encapuchado actual", "#bca6ff");
for (const variant of Object.values(VARIANTS)) {
  const built = build(variant);
  entries.push({
    label: `encapuchado ${variant.label}`,
    cols: built.cols,
    rows: built.rows,
    cells: built.sprite.flatMap((row, y) => [...row].map((char, x) => (char === "." ? null : [x, y, ...P[char]])).filter(Boolean)),
    eyes: built.eyes.map(([x, y]) => [x, y, "#bca6ff"]),
  });
}

const CW = 32, CH = 26, S = 8; // lienzo de cada mascota: todas apoyadas en el mismo suelo
const R = (x, y, fill, o = 1) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"${o < 1 ? ` fill-opacity="${o}"` : ""}/>`;
const panel = (entry) => {
  const ox = Math.round((CW - entry.cols) / 2), oy = CH - 1 - entry.rows + 1; // la última fila (sombra) queda sobre el suelo
  const out = [
    `<rect width="${CW}" height="${CH}" fill="#101018"/>`,
    ...entry.cells.map(([x, y, fill, o]) => R(x + ox, y + oy - 1, fill, o)),
    ...entry.eyes.map(([x, y, fill]) => R(x + ox, y + oy - 1, fill)),
    `<rect y="${CH - 1}" width="${CW}" height="1" fill="#2b2940"/>`,
  ];
  return `<svg width="${CW * S}" height="${CH * S}" viewBox="0 0 ${CW} ${CH}" shape-rendering="crispEdges">${out.join("")}</svg>`;
};

const css = `<style>.g{display:grid;grid-template-columns:repeat(5,${CW * S}px);gap:14px;padding:20px;width:max-content}figure{margin:0}figcaption{padding-top:8px;font-size:14px;text-align:center}</style>`;
writeFileSync(
  process.argv[2],
  `<body style="margin:0;background:#0a0a0f;font-family:monospace;color:#a9a4c4">${css}<div class="g">${entries.map((e) => `<figure>${panel(e)}<figcaption>${e.label}</figcaption></figure>`).join("")}</div></body>`
);
