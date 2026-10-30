import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));
const { MASCOTS } = await import(pathToFileURL(root + "src/lib/creature.js").href);
const SPRITE = MASCOTS.campana.sprite;

// Paleta del sitio
const P = { H: "#3a3856", h: "#1d1c2c", r: "#2b2940", g: "#5a5680", k: "#050508", A: "#bca6ff", F: "#7a63c9", W: "#e8e9f0", G: "#7fdcaa", d: "#827e9c", m: "#3a3856", b: "#1d1c2c", o: "#7a63c9", E: "#e8e9f0", a: "#bca6ff" };
const W = 24; // ancho de los lienzos de los conceptos A y B

// Cada fila se escribe solo con su mitad izquierda (12 columnas) y se refleja.
const mirror = (half) => half + [...half].reverse().join("");
const fromHalves = (halves) => halves.map(mirror);

// Ruido "lluvia de código" reproducible
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const rain = (w, h, left, right) => {
  const cells = [];
  for (const x of [...left, ...right]) {
    let y = Math.floor(rnd() * 5);
    while (y < h - 2) {
      const len = 2 + Math.floor(rnd() * 4);
      for (let i = 0; i < len && y + i < h - 2; i++) cells.push([x, y + i, 0.14 + 0.5 * (i / len)]);
      y += len + 2 + Math.floor(rnd() * 5);
    }
  }
  return cells;
};

// Concepto A: encapuchado. El rostro es un vacío con dos ojos lila en pendiente.
const A = fromHalves([
  "..........HH",
  "........HHhh",
  "......HHhhhh",
  ".....Hhhhhhh",
  "....Hhhhhhhh",
  "...Hhhrrrrrr",
  "...Hhrkkkkkk",
  "...Hhrkkkkkk",
  "...Hhrkkkkkk",
  "...Hhrkkkkkk",
  "...Hhhrrrrrr",
  "..Hhhhhhhhhh",
  ".Hhhhhhhhhah",
  ".Hhhhhhhhhah",
  "Hhhhhhhhhhah",
  "Hhhhhhhhhhhh",
  "Hhhhhhhhhhhh",
  "Hhhhhhhhhhhh",
  "Hhhhhhhhhhhh",
  "H.hH.hH.hH.h",
]);
const aEyes = [[7, 7], [8, 7], [8, 8], [9, 8], [10, 8], [16, 7], [15, 7], [15, 8], [14, 8], [13, 8]];
// portátil con la tapa hacia afuera y un logo lila
const aLaptop = [];
for (let x = 6; x <= 17; x++) for (let y = 14; y <= 18; y++) aLaptop.push([x, y, y === 14 || y === 18 || x === 6 || x === 17 ? "g" : "r"]);
aLaptop.push([11, 16, "A"], [12, 16, "A"], [11, 17, "A"], [12, 17, "A"]);
for (let x = 4; x <= 19; x++) aLaptop.push([x, 19, "g"]);

// Concepto B: cabeza de monitor con el prompt en pantalla, antena y teclado.
const Bshape = [];
const put = (x, y, c, o = 1) => Bshape.push([x, y, c, o]);
for (let x = 4; x <= 19; x++) for (let y = 2; y <= 14; y++) put(x, y, x === 4 || x === 19 || y === 2 || y === 14 ? "g" : x === 5 || x === 18 || y === 3 || y === 13 ? "F" : "k");
// antena
put(8, 1, "g"); put(7, 0, "g"); put(15, 1, "g"); put(16, 0, "g");
// prompt  ">"  y "_"
[[7, 6], [8, 7], [9, 8], [8, 9], [7, 10]].forEach(([x, y]) => put(x, y, "G"));
[11, 12, 13].forEach((x) => put(x, 10, "G"));
// líneas de texto tenues y cursor
[[11, 6, 5], [11, 8, 7]].forEach(([x, y, n]) => { for (let i = 0; i < n; i++) put(x + i, y, "d", 0.45); });
put(15, 10, "A"); put(15, 9, "A");
// cuello y sudadera
for (let x = 10; x <= 13; x++) { put(x, 15, "r"); put(x, 16, "r"); }
const hood = fromHalves([
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "......Hhhhhh",
  ".....Hhhhhhh",
  "...HHhhhhhhh",
  "..Hhhhhhhhhh",
  "..Hhhhhhhhhh",
]);
// teclado
const keys = [];
for (let x = 3; x <= 20; x++) { keys.push([x, 22, "g"]); keys.push([x, 23, x % 2 ? "r" : "m"]); }

// Concepto C: la campana actual con efecto glitch
const C_W = SPRITE[0].length + 8, C_H = SPRITE.length + 5;
const glitchRows = { 4: 1, 8: -1, 12: 2 };

const svgOpen = (w, h) => `<svg width="${w * 12}" height="${h * 12}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><rect width="${w}" height="${h}" fill="#101018"/>`;
const rect = (x, y, fill, o = 1) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"${o < 1 ? ` fill-opacity="${o}"` : ""}/>`;
const floor = (w, h) => `<rect y="${h - 1}" width="${w}" height="1" fill="#2b2940"/>`;

const panelA = () => {
  const h = 26, out = [svgOpen(W, h)];
  for (const [x, y, o] of rain(W, h, [1, 3, 21], [])) out.push(rect(x, y, P.A, o * 0.6));
  A.forEach((row, y) => [...row].forEach((c, x) => { if (c !== ".") out.push(rect(x, y + 3, P[c])); }));
  for (const [x, y, c] of aLaptop) out.push(rect(x, y + 3, P[c]));
  for (const [x, y] of aEyes) out.push(rect(x, y + 3, P.A));
  out.push(floor(W, h), "</svg>");
  return out.join("");
};
const panelB = () => {
  const h = 26, out = [svgOpen(W, h)];
  for (const [x, y, o] of rain(W, h, [1, 2], [21, 22])) out.push(rect(x, y, P.G, o * 0.5));
  for (const [x, y, c, o] of Bshape) out.push(rect(x, y, P[c], o));
  hood.forEach((row, y) => [...row].forEach((c, x) => { if (c !== ".") out.push(rect(x, y, P[c])); }));
  for (const [x, y, c] of keys) out.push(rect(x, y, P[c]));
  out.push(floor(W, h), "</svg>");
  return out.join("");
};
const panelC = () => {
  const out = [svgOpen(C_W, C_H)];
  for (const [x, y, o] of rain(C_W, C_H, [1], [C_W - 2])) out.push(rect(x, y, P.A, o * 0.45));
  const ox = 4, oy = 2;
  // fantasmas desplazados (separación de color)
  SPRITE.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === "." || c === "s") return;
    const sh = glitchRows[y] ?? 0;
    if (c === "o" || c === "g") { out.push(rect(x + ox - 1 + sh, y + oy, P.A, 0.22)); out.push(rect(x + ox + 1 + sh, y + oy, P.G, 0.14)); }
  }));
  SPRITE.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === "." || c === "s") return;
    const sh = glitchRows[y] ?? 0;
    out.push(rect(x + ox + sh, y + oy, c === "E" ? P.k : P[c]));
  }));
  // ojos siniestros en pendiente
  [[6, 6], [7, 6], [7, 7], [8, 7], [9, 7], [14, 6], [15, 6], [14, 7], [13, 7], [12, 7]].forEach(([x, y]) => out.push(rect(x + ox + (glitchRows[y] ?? 0), y + oy, P.G)));
  // líneas de exploración
  for (let y = 0; y < C_H; y += 3) out.push(`<rect y="${y + 1}" width="${C_W}" height="1" fill="#000" fill-opacity="0.1"/>`);
  // prompt en el pecho
  out.push(rect(ox + 9, oy + 11, P.G), rect(ox + 10, oy + 12, P.G), rect(ox + 9, oy + 13, P.G), rect(ox + 12, oy + 13, P.G), rect(ox + 13, oy + 13, P.G));
  out.push(floor(C_W, C_H), "</svg>");
  return out.join("");
};

const cards = [
  [panelA(), "A · encapuchado"],
  [panelB(), "B · cabeza de monitor"],
  [panelC(), "C · campana con glitch"],
].map(([svg, name]) => `<figure>${svg}<figcaption>${name}</figcaption></figure>`).join("");
writeFileSync(process.argv[2], `<body style="margin:0;background:#0a0a0f;font-family:monospace;color:#a9a4c4"><style>.g{display:flex;gap:22px;padding:22px;align-items:flex-end}figure{margin:0}figcaption{padding-top:8px;font-size:17px;text-align:center}</style><div class="g">${cards}</div></body>`);
