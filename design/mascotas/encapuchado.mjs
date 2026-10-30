import { writeFileSync } from "node:fs";
// node encapuchado.mjs <estilos.html> <caras.html>

const P = { H: "#3a3856", h: "#1d1c2c", r: "#2b2940", g: "#5a5680", k: "#050508", A: "#bca6ff", F: "#7a63c9", W: "#e8e9f0", G: "#7fdcaa", d: "#827e9c", a: "#bca6ff" };
const W = 24, H = 26, OY = 3, S = 10;
const mirror = (half) => half + [...half].reverse().join("");
const HOOD = [
  "..........HH", "........HHhh", "......HHhhhh", ".....Hhhhhhh", "....Hhhhhhhh", "...Hhhrrrrrr", "...Hhrkkkkkk", "...Hhrkkkkkk",
  "...Hhrkkkkkk", "...Hhrkkkkkk", "...Hhhrrrrrr", "..Hhhhhhhhhh", ".Hhhhhhhhhah", ".Hhhhhhhhhah", "Hhhhhhhhhhah", "Hhhhhhhhhhhh",
  "Hhhhhhhhhhhh", "Hhhhhhhhhhhh", "Hhhhhhhhhhhh", "H.hH.hH.hH.h",
].map(mirror);

// ---- ojos / caras (coordenadas de la cuadrícula del encapuchado; el vacío ocupa x 6-17, y 6-9)
const mir = (cells) => [...cells, ...cells.map(([x, y]) => [W - 1 - x, y])];
const block = (x, y, w, h) => Array.from({ length: w * h }, (_, i) => [x + (i % w), y + Math.floor(i / w)]);
const FACES = {
  enojado: mir([[7, 7], [8, 7], [8, 8], [9, 8], [10, 8]]),
  reposo: mir(block(7, 7, 2, 2)),
  curioso: mir(block(7, 6, 3, 3)),
  sorprendido: mir(block(7, 6, 3, 4)),
  dormido: mir([[7, 8], [8, 8], [9, 8]]),
  contento: mir([[7, 8], [8, 7], [9, 8]]),
};

const cell = (x, y, c, o = 1) => ({ x, y, c, o });
const hood = () => HOOD.flatMap((row, y) => [...row].map((c, x) => (c === "." ? null : cell(x, y, c))).filter(Boolean));
const line = (x1, x2, y, c, o = 1) => Array.from({ length: x2 - x1 + 1 }, (_, i) => cell(x1 + i, y, c, o));
const col = (x, y1, y2, c, o = 1) => Array.from({ length: y2 - y1 + 1 }, (_, i) => cell(x, y1 + i, c, o));
const eyes = (face, color = "A", o = 1) => FACES[face].map(([x, y]) => cell(x, y, color, o));

let seed = 11;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const rain = (xs, color, k = 0.5) => xs.flatMap((x) => {
  const out = []; let y = Math.floor(rnd() * 5);
  while (y < H - 4) { const len = 2 + Math.floor(rnd() * 4); for (let i = 0; i < len && y + i < H - 4; i++) out.push(cell(x, y + i, color, (0.12 + 0.5 * (i / len)) * k)); y += len + 2 + Math.floor(rnd() * 5); }
  return out;
});

const laptop = () => {
  const out = [];
  for (let x = 6; x <= 17; x++) for (let y = 14; y <= 18; y++) out.push(cell(x, y, x === 6 || x === 17 || y === 14 || y === 18 ? "g" : "r"));
  out.push(cell(11, 16, "A"), cell(12, 16, "A"), cell(11, 17, "A"), cell(12, 17, "A"), ...line(4, 19, 19, "g"));
  return out;
};

const STYLES = [
  { name: "1 · base", layers: () => [...rain([1, 3, 21], "A", 0.6), ...hood(), ...laptop(), ...eyes("enojado")] },
  { name: "2 · auriculares", layers: () => [
    ...rain([1, 22], "A", 0.5), ...hood(),
    ...[2, 3, 4].flatMap((y) => [cell(3, y + 4, "A"), cell(20, y + 4, "A"), cell(2, y + 4, "F"), cell(21, y + 4, "F")]),
    cell(6, 5, "F"), cell(5, 6, "F"), cell(4, 6, "F"), cell(17, 5, "F"), cell(18, 6, "F"), cell(19, 6, "F"),
    cell(2, 10, "g"), cell(3, 11, "g"), cell(4, 11, "g"), cell(5, 11, "A"),
    ...laptop(), ...eyes("enojado")] },
  { name: "3 · bufanda", layers: () => [
    ...rain([1, 22], "A", 0.5), ...hood(),
    ...line(2, 21, 11, "F"), ...line(1, 22, 12, "F"), ...line(4, 19, 11, "r", 0.5),
    ...col(17, 13, 16, "F"), ...col(18, 13, 17, "F"), cell(17, 17, "r"), cell(18, 18, "r"),
    ...laptop(), ...eyes("enojado")] },
  { name: "4 · circuitos", layers: () => [
    ...rain([1, 22], "A", 0.5), ...hood(),
    ...line(3, 7, 15, "F", 0.7), ...col(7, 15, 18, "F", 0.7), cell(3, 15, "A"), cell(7, 18, "A"),
    ...line(16, 20, 15, "F", 0.7), ...col(16, 15, 18, "F", 0.7), cell(20, 15, "A"), cell(16, 18, "A"),
    ...line(4, 6, 12, "F", 0.6), cell(4, 12, "A"), ...line(17, 19, 12, "F", 0.6), cell(19, 12, "A"),
    ...eyes("enojado")] },
  { name: "5 · holograma", layers: () => {
    const out = [...rain([1, 22], "A", 0.5), ...hood()];
    for (let x = 6; x <= 17; x++) for (let y = 13; y <= 19; y++) out.push(cell(x, y, x === 6 || x === 17 || y === 13 || y === 19 ? "A" : "k", x === 6 || x === 17 || y === 13 || y === 19 ? 0.85 : 0.75));
    [[8, 15], [9, 16], [8, 17]].forEach(([x, y]) => out.push(cell(x, y, "G")));
    out.push(...line(11, 13, 17, "G"), ...line(11, 15, 15, "d", 0.5));
    out.push(...[5, 6].flatMap((x) => [cell(x, 20, "H"), cell(x, 21, "H")]), ...[17, 18].flatMap((x) => [cell(x, 20, "H"), cell(x, 21, "H")]));
    return [...out, ...eyes("enojado")]; } },
  { name: "6 · cara-prompt", layers: () => [
    ...rain([1, 3, 21], "G", 0.5), ...hood(), ...laptop(),
    cell(7, 6, "G"), cell(8, 7, "G"), cell(9, 8, "G"), cell(8, 9, "G"), cell(7, 9, "G"), ...line(12, 15, 9, "G"), cell(16, 6, "A"), cell(16, 7, "A"), cell(16, 8, "A")] },
];

const svg = (cells) => `<svg width="${W * S}" height="${H * S}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges"><rect width="${W}" height="${H}" fill="#101018"/>${
  cells.map(({ x, y, c, o }) => `<rect x="${x}" y="${y + OY}" width="1" height="1" fill="${P[c]}"${o < 1 ? ` fill-opacity="${o}"` : ""}/>`).join("")
}<rect y="${H - 1}" width="${W}" height="1" fill="#2b2940"/></svg>`;
const page = (items, cols) => `<body style="margin:0;background:#0a0a0f;font-family:monospace;color:#a9a4c4"><style>.g{display:grid;grid-template-columns:repeat(${cols},${W * S}px);gap:20px;padding:20px;width:max-content}figure{margin:0}figcaption{padding-top:8px;font-size:17px;text-align:center}</style><div class="g">${items.map(([s, n]) => `<figure>${s}<figcaption>${n}</figcaption></figure>`).join("")}</div></body>`;

writeFileSync(process.argv[2], page(STYLES.map((v) => [svg(v.layers()), v.name]), 3));
const caras = Object.keys(FACES).map((f) => [svg([...rain([1, 22], "A", 0.4), ...hood(), ...laptop(), ...eyes(f, "A", f === "dormido" ? 0.45 : 1)]), f]);
writeFileSync(process.argv[3], page(caras, 3));
