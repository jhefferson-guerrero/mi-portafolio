import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
// node glitch.mjs <salida.html>  → opciones de campana con glitch
const root = fileURLToPath(new URL("../../", import.meta.url));
const { MASCOTS } = await import(pathToFileURL(root + "src/lib/creature.js").href);
const SPRITE = MASCOTS.campana.sprite;

const C = { g: "#5a5680", r: "#2b2940", o: "#7a63c9", k: "#050508", E: "#050508", m: "#3a3856", b: "#1d1c2c", a: "#bca6ff" };
const ACC = "#bca6ff", GRN = "#7fdcaa", WHT = "#e8e9f0", BG = "#101018";
const W = 30, H = 22, OX = 4, OY = 3, S = 10;

let seed = 5;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const R = (x, y, fill, o = 1) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"${o < 1 ? ` fill-opacity="${o}"` : ""}/>`;
const cells = SPRITE.flatMap((row, y) => [...row].map((ch, x) => ({ ch, x, y })).filter(({ ch }) => ch !== "." && ch !== "s"));
const mirrorX = (list) => [...list, ...list.map(([x, y]) => [21 - x + 0, y])];
const SLITS = [[6, 6], [7, 6], [7, 7], [8, 7], [9, 7], [14, 6], [15, 6], [14, 7], [13, 7], [12, 7]];
const BELL_EYES = cells.filter((c) => SPRITE[c.y][c.x] === "E").map((c) => [c.x, c.y]);
const X_EYES = [[7, 6], [9, 6], [8, 7], [7, 8], [9, 8], [12, 6], [14, 6], [13, 7], [12, 8], [14, 8]];

const rain = (xs, color, k = 0.5) => xs.flatMap((x) => {
  const out = []; let y = Math.floor(rnd() * 5);
  while (y < H - 3) { const len = 2 + Math.floor(rnd() * 4); for (let i = 0; i < len && y + i < H - 3; i++) out.push(R(x, y + i, color, (0.1 + 0.45 * (i / len)) * k)); y += len + 2 + Math.floor(rnd() * 5); }
  return out;
});
const floor = () => `<rect y="${OY + 17}" width="${W}" height="${H - OY - 17}" fill="#2b2940"/>`;
const body = (shift = {}, filter = () => true) => cells.filter(filter).map(({ ch, x, y }) => R(x + OX + (shift[y] ?? 0), y + OY, C[ch])).join("");
const ghosts = (dxL, dxR, oL = 0.25, oR = 0.18, only = (c) => c.ch === "o" || c.ch === "g") =>
  cells.filter(only).map(({ x, y }) => R(x + OX - dxL, y + OY, ACC, oL) + R(x + OX + dxR, y + OY, GRN, oR)).join("");
const eyes = (list, color, shift = {}) => list.map(([x, y]) => R(x + OX + (shift[y] ?? 0), y + OY, color)).join("");

const OPTIONS = [
  { name: "1 · separación de color", draw: () => rain([1, 27], ACC, 0.5) + ghosts(2, 2, 0.3, 0.22, (c) => c.ch !== "E") + body() + eyes(SLITS, GRN) },
  { name: "2 · cortes horizontales", draw: () => {
    const sh = { 3: 2, 4: -1, 7: 3, 8: 3, 11: -2, 12: 1, 13: -3 };
    return rain([1, 27], ACC, 0.4) + ghosts(1, 1, 0.2, 0.14, (c) => c.ch === "o") + body(sh) + eyes(SLITS, ACC, sh)
      + [5, 6, 7, 8, 9].map((x) => R(x + OX, 9 + OY, ACC, 0.55)).join("") + [13, 14, 15, 16].map((x) => R(x + OX, 13 + OY, GRN, 0.5)).join(""); } },
  { name: "3 · datos corruptos", draw: () => {
    const holes = new Set(); const body_ = cells.filter((c) => c.ch !== "k" && c.ch !== "E");
    for (let i = 0; i < 16; i++) { const c = body_[Math.floor(rnd() * body_.length)]; holes.add(`${c.x},${c.y}`); }
    const moved = Array.from({ length: 12 }, () => { const c = body_[Math.floor(rnd() * body_.length)]; return R(c.x + OX + (rnd() < 0.5 ? -1 : 1) * (2 + Math.floor(rnd() * 3)), c.y + OY, rnd() < 0.5 ? ACC : GRN, 0.8); }).join("");
    return rain([1, 27], GRN, 0.35) + body({}, (c) => !holes.has(`${c.x},${c.y}`)) + moved + eyes(BELL_EYES, WHT); } },
  { name: "4 · estática de monitor", draw: () => {
    const noise = Array.from({ length: 70 }, () => R(Math.floor(rnd() * W), Math.floor(rnd() * (H - 3)), rnd() < 0.5 ? ACC : WHT, 0.08 + rnd() * 0.22)).join("");
    const lines = Array.from({ length: Math.floor(H / 2) }, (_, i) => `<rect y="${i * 2 + 1}" width="${W}" height="1" fill="#000" fill-opacity="0.22"/>`).join("");
    return noise + body() + eyes(SLITS, GRN) + `<rect y="${OY + 9}" width="${W}" height="1" fill="${WHT}" fill-opacity="0.1"/>` + lines; } },
  { name: "5 · código en el visor", draw: () => {
    const visor = cells.filter((c) => c.ch === "k" || c.ch === "E");
    const cols = [...new Set(visor.map((c) => c.x))]; const matrix = [];
    for (const x of cols) { if (rnd() < 0.35) continue; let y = 4 + Math.floor(rnd() * 3); const len = 2 + Math.floor(rnd() * 3); for (let i = 0; i < len; i++) if (y + i <= 9) matrix.push(R(x + OX, y + i + OY, GRN, 0.35 + 0.65 * (i / len))); }
    return rain([1, 27], GRN, 0.4) + ghosts(1, 1, 0.22, 0.12, (c) => c.ch === "o") + body() + matrix.join(""); } },
  { name: "6 · ojos en X con falla", draw: () => {
    const sh = { 5: 1, 6: 1, 10: -2 };
    return rain([1, 27], ACC, 0.45) + ghosts(2, 2, 0.26, 0.18) + body(sh) + eyes(X_EYES, GRN, sh)
      + [4, 5, 6].map((x) => R(x + OX, 8 + OY, GRN, 0.5)).join(""); } },
];

const panel = (o) => `<figure><svg width="${W * S}" height="${H * S}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges"><rect width="${W}" height="${H}" fill="${BG}"/>${o.draw()}${floor()}</svg><figcaption>${o.name}</figcaption></figure>`;
writeFileSync(process.argv[2], `<body style="margin:0;background:#0a0a0f;font-family:monospace;color:#a9a4c4"><style>.g{display:grid;grid-template-columns:repeat(3,${W * S}px);gap:20px;padding:20px;width:max-content}figure{margin:0}figcaption{padding-top:8px;font-size:16px;text-align:center}</style><div class="g">${OPTIONS.map(panel).join("")}</div></body>`);
