import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));
const { MASCOTS } = await import(pathToFileURL(root + "src/lib/creature.js").href);
const SPRITE = MASCOTS.campana.sprite;
const EYES = { idle: MASCOTS.campana.eyes.idle };

const C = { g: "#5a5680", r: "#2b2940", o: "#7a63c9", k: "#050508", E: "#e8e9f0", m: "#3a3856", b: "#1d1c2c", a: "#bca6ff", s: "rgba(188,166,255,0.07)" };
const ACCENT = "#bca6ff", WHITE = "#e8e9f0";

// Ojos siniestros: escalón que baja hacia el centro (afuera alto, adentro bajo)
const SLITS = [[6, 6], [7, 6], [7, 7], [8, 7], [9, 7], [14, 6], [15, 6], [14, 7], [13, 7], [12, 7]];
// Sonrisa dentada: línea con picos hacia arriba, simétrica respecto al centro del visor
// Con sonrisa, los ojos suben una fila para dejar aire entre ojos y boca
const SLITS_UP = SLITS.map(([x, y]) => [x, y - 1]);
const GRIN = [[6, 8], [8, 8], [10, 8], [11, 8], [13, 8], [15, 8], ...Array.from({ length: 8 }, (_, i) => [7 + i, 9])];
const HORNS = [[6, 0], [6, -1], [7, -2], [15, 0], [15, -1], [14, -2]];

const variants = [
  { name: "actual", eyes: EYES.idle, eyeColor: WHITE },
  { name: "1 · mirada fría", eyes: SLITS, eyeColor: WHITE },
  { name: "2 · sonrisa dentada", eyes: [...SLITS_UP, ...GRIN], eyeColor: WHITE },
  { name: "3 · cuernos", eyes: [...SLITS_UP, ...GRIN], eyeColor: ACCENT, horns: HORNS },
  { name: "4 · en la oscuridad", eyes: SLITS, eyeColor: ACCENT, dark: true },
];

const S = 12, OFF_Y = 3, PAD = 2;
const panel = (v) => {
  const w = SPRITE[0].length + PAD * 2, h = SPRITE.length + OFF_Y;
  const rects = [];
  SPRITE.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch === ".") return;
    let fill = C[ch === "E" ? "k" : ch];
    if (v.dark && ch === "o") fill = C.r;
    if (v.dark && ch === "g") fill = C.m;
    rects.push(`<rect x="${x + PAD}" y="${y + OFF_Y}" width="1" height="1" fill="${fill}"/>`);
  }));
  for (const [x, y] of v.eyes) rects.push(`<rect x="${x + PAD}" y="${y + OFF_Y}" width="1" height="1" fill="${v.eyeColor}"/>`);
  for (const [x, y] of v.horns ?? []) rects.push(`<rect x="${x + PAD}" y="${y + OFF_Y}" width="1" height="1" fill="${C.g}"/>`);
  return `<figure><svg width="${w * S}" height="${h * S}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><rect width="${w}" height="${h}" fill="#101018"/>${rects.join("")}<rect y="${h - 1}" width="${w}" height="1" fill="#2b2940"/></svg><figcaption>${v.name}</figcaption></figure>`;
};
writeFileSync(process.argv[2], `<body style="margin:0;background:#0a0a0f;font-family:monospace;color:#a9a4c4"><style>.g{display:flex;flex-wrap:wrap;gap:22px;padding:22px;width:1010px}figure{margin:0}figcaption{padding-top:8px;font-size:17px;text-align:center}</style><div class="g">${variants.map(panel).join("")}</div></body>`);
