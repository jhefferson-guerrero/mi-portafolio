import { writeFileSync } from "node:fs";
// node circuitos.mjs <estados.html> <contexto.html>
const P = { H: "#3a3856", h: "#1d1c2c", r: "#2b2940", g: "#5a5680", k: "#050508", A: "#bca6ff", F: "#7a63c9", W: "#e8e9f0", G: "#7fdcaa", d: "#827e9c", a: "#bca6ff", S: "#bca6ff" };
const mirror = (half) => half + [...half].reverse().join("");
const BODY = [
  "..........HH", "........HHhh", "......HHhhhh", ".....Hhhhhhh", "....Hhhhhhhh", "...Hhhrrrrrr", "...Hhrkkkkkk", "...Hhrkkkkkk",
  "...Hhrkkkkkk", "...Hhrkkkkkk", "...Hhhrrrrrr", "..Hhhhhhhhhh", ".Hhhhhhhhhah", ".Hhhhhhhhhah", "Hhhhhhhhhhah", "Hhhhhhhhhhhh",
  "Hhhhhhhhhhhh", "Hhhhhhhhhhhh", "Hhhhhhhhhhhh", "H.hH.hH.hH.h",
  // FEET=tiny: dos pies diminutos bajo el borde, como los de la campana actual
  ...(process.env.FEET === "tiny" ? ["........r..."] : []),
].map(mirror);
const BW = 24, BH = BODY.length; // 24 x 24
const cell = (x, y, c, o = 1, s = 1) => ({ x, y, c, o, s });
const body = () => BODY.flatMap((row, y) => [...row].map((c, x) => (c === "." ? null : cell(x, y, c))).filter(Boolean));
const line = (x1, x2, y, c, o = 1) => Array.from({ length: x2 - x1 + 1 }, (_, i) => cell(x1 + i, y, c, o));
const col = (x, y1, y2, c, o = 1) => Array.from({ length: y2 - y1 + 1 }, (_, i) => cell(x, y1 + i, c, o));
const mir = (cells) => [...cells, ...cells.map(([x, y]) => [BW - 1 - x, y])];
const blk = (x, y, w, h) => Array.from({ length: w * h }, (_, i) => [x + (i % w), y + Math.floor(i / w)]);

// El reposo es el ceño de siempre (ojos en escalón que baja hacia el centro); de ahí salen los demás estados.
const SLIT = [[7, 7], [8, 7], [8, 8], [9, 8], [10, 8]];
const shift = (cells, dx) => cells.map(([x, y]) => [x + dx, y]);
const FACES = {
  reposo: mir(SLIT),
  parpadeo: mir([[8, 8], [9, 8], [10, 8]]),
  mira_izq: shift(mir(SLIT), -1),
  mira_der: shift(mir(SLIT), 1),
  // ceja levantada: el ojo derecho se abre más
  curioso: [...SLIT, [15, 6], [16, 6], [14, 7], [15, 7], [16, 7], [13, 8], [14, 8], [15, 8]].map(([x, y], i) => (i < SLIT.length ? [x, y] : [x, y])),
  sorprendido: mir(blk(7, 6, 3, 4)),
  // más grueso: ceño fruncido de verdad, y el cuerpo tiembla (se dibuja con fantasmas)
  furioso: mir([[7, 6], [8, 6], [7, 7], [8, 7], [9, 7], [8, 8], [9, 8], [10, 8]]),
  dormido: mir([[7, 8], [8, 8], [9, 8]]),
  contento: mir([[7, 8], [8, 7], [9, 8]]),
};
const eyes = (face, c = "A", o = 1) => FACES[face].map(([x, y]) => cell(x, y, c, o));
const traces = (o = 1) => [
  ...line(3, 7, 15, "F", 0.7 * o), ...col(7, 15, 18, "F", 0.7 * o), cell(3, 15, "A", o), cell(7, 18, "A", o),
  ...line(16, 20, 15, "F", 0.7 * o), ...col(16, 15, 18, "F", 0.7 * o), cell(20, 15, "A", o), cell(16, 18, "A", o),
  ...line(4, 6, 12, "F", 0.6 * o), cell(4, 12, "A", o), ...line(17, 19, 12, "F", 0.6 * o), cell(19, 12, "A", o),
];
const promptFace = () => [cell(7, 6, "G"), cell(8, 7, "G"), cell(9, 8, "G"), cell(8, 9, "G"), cell(7, 9, "G"), ...line(12, 15, 9, "G"), cell(16, 6, "A"), cell(16, 7, "A"), cell(16, 8, "A")];
const Z = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [3, 1], [2, 2], [1, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4]];
const zzz = () => [[21, 1], [24, -4]].flatMap(([x, y]) => Z.map(([dx, dy]) => cell(x + dx * 0.6, y + dy * 0.6, "A", 0.8, 0.6)));

// pose: celdas del personaje, y si salta (sombra reducida)
const pose = (face) => {
  const jump = face === "sorprendido" ? 1 : 0;
  let cells = [...body(), ...traces(face === "dormido" ? 0.45 : 1)];
  if (face === "consola") cells = [...cells, ...promptFace()];
  else cells = [...cells, ...eyes(face, "A", face === "dormido" ? 0.45 : 1)];
  if (face === "dormido") cells = [...cells, ...zzz()];
  // furioso: el cuerpo tiembla; se ven dos copias tenues desplazadas un píxel a cada lado
  const ghosts = face === "furioso" ? [-1, 1].flatMap((dx) => cells.filter((c) => c.c !== "A").map((c) => ({ ...c, x: c.x + dx, o: c.o * 0.16 }))) : [];
  return { cells: [...ghosts, ...cells].map((c) => ({ ...c, y: c.y - jump })), small: jump > 0 };
};

const OY = 6, SH = BH; // hueco arriba para las "z" y el salto
const W = BW + 6;
const H = OY + SH + 2;
const R = (x, y, c, o = 1, s = 1) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${P[c] ?? c}"${o < 1 ? ` fill-opacity="${o}"` : ""}/>`;
const svg = (w, h, S, inner, bg = "#101018") => `<svg width="${w * S}" height="${h * S}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><rect width="${w}" height="${h}" fill="${bg}"/>${inner}</svg>`;
const shadow = (small) => (small ? line(9, 14, 0, "S", 0.07) : line(7, 16, 0, "S", 0.07)).map((c) => R(c.x + 3, OY + SH, c.c, c.o)).join("");
const character = (face, dx = 3, dy = OY) => pose(face).cells.map((c) => R(c.x + dx, c.y + dy, c.c, c.o, c.s)).join("");
const floorLine = (w, y) => `<rect y="${y}" width="${w}" height="1" fill="#2b2940"/>`;

const FACE_LIST = [["reposo", "reposo"], ["parpadeo", "parpadeo"], ["mira_izq", "mira a la izquierda"], ["mira_der", "mira a la derecha"], ["curioso", "curioso (cursor cerca)"], ["sorprendido", "sorprendido (salta)"], ["furioso", "furioso (muchos clics)"], ["contento", "contento (sobre un botón)"], ["dormido", "dormido"], ["consola", "consola (escribe un comando)"]];
const statePanel = (face) => svg(W, H, 10, `${shadow(pose(face).small)}${character(face)}${floorLine(W, OY + SH + 1)}`);
const css = (cols, w) => `<style>.g{display:grid;grid-template-columns:repeat(${cols},${w}px);gap:20px;padding:20px;width:max-content}figure{margin:0}figcaption{padding-top:8px;font-size:16px;text-align:center}</style>`;
writeFileSync(process.argv[2], `<body style="margin:0;background:#0a0a0f;font-family:monospace;color:#a9a4c4">${css(5, W * 10)}<div class="g">${FACE_LIST.map(([f, n]) => `<figure>${statePanel(f)}<figcaption>${n}</figcaption></figure>`).join("")}</div></body>`);

// ---------- contexto: escena de Inicio, menú y espacio vacío
const SW = 70, SHT = 30, FL = 28;
const box = (x, y, w, h) => {
  let s = "";
  for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) s += (i === 0 || j === 0 || i === w - 1 || j === h - 1) ? R(x + i, y + j, "r") : R(x + i, y + j, "#14141f");
  return s;
};
const win = (x) => box(x, 1, 9, 7) + [0, 4].flatMap((dx) => [0, 3].map((dy) => R(x + 1 + dx, 2 + dy, "A", 0.12, 1))).join("");
let scene = "";
scene += win(18) + win(46);
scene += box(1, 10, 10, FL - 10) + [13, 16, 19, 22, 25].map((y) => [3, 4, 5, 6].map((x) => R(x, y, "r")).join("")).join("") + [[8, 13, "A"], [8, 16, "A"], [8, 19, "G"], [8, 22, "A"]].map(([x, y, c]) => R(x, y, c)).join("");
scene += box(11, 18, 7, FL - 18) + [21, 24].map((y) => [13, 14, 15].map((x) => R(x, y, "r")).join("")).join("") + R(16, 21, "G");
scene += box(54, 12, 14, 11) + [14, 16, 18].map((y, i) => [56, 57, 58, 59].map((x) => R(x, y, "A", 1 - i * 0.2)).join("")).join("");
scene += line(53, 69, 24, "g", 0.5).map((c) => R(c.x, c.y, "g", 0.5)).join("") + col(54, 25, FL - 1, "g", 0.4).map((c) => R(c.x, c.y, "g", 0.4)).join("") + col(68, 25, FL - 1, "g", 0.4).map((c) => R(c.x, c.y, "g", 0.4)).join("");
const mx = Math.round((SW - BW) / 2), my = FL - BH;
scene += line(mx + 4, mx + 19, FL - 1, "S", 0.07).map((c) => R(c.x, c.y, "S", 0.07)).join("");
scene += pose("reposo").cells.map((c) => R(c.x + mx, c.y + my, c.c, c.o, c.s)).join("");
scene += [[mx + 30, 6], [mx - 8, 9], [mx - 4, 4], [mx + 26, 10]].map(([x, y]) => R(x, y, "A", 0.35)).join("") + floorLine(SW, FL);
const sceneSvg = svg(SW, SHT, 10, scene);

// menú: tarjeta lateral con el rostro en miniatura junto a la sección activa
const items = ["inicio", "sobre mí", "tecnologías", "proyectos", "servicios", "intereses", "contacto"];
const faceCrop = pose("reposo").cells.filter((c) => c.x >= 3 && c.x <= 20 && c.y >= 2 && c.y <= 10).map((c) => R(c.x - 3, c.y - 2, c.c, c.o, c.s)).join("");
const nav = `<div style="width:300px;background:#101018;border:1px solid #2b2940;padding:14px;font-size:15px;display:grid;gap:6px">${items.map((t, i) => `<div style="position:relative;padding:9px 12px;border:1px solid ${i === 2 ? "#bca6ff55" : "transparent"};background:${i === 2 ? "#bca6ff1f" : "transparent"};color:${i === 2 ? "#e8e9f0" : "#a9a4c4"}">${t}${i === 2 ? `<span style="position:absolute;right:12px;top:4px">${svg(18, 9, 2, faceCrop, "transparent")}</span>` : ""}</div>`).join("")}</div>`;

// espacio vacío: el encapuchado dormido
const empty = `<div style="width:420px;height:330px;border:1px dashed #2b2940;display:grid;place-content:center;justify-items:center;gap:8px;text-align:center">${svg(W, H, 7, `${shadow(false)}${character("dormido")}${floorLine(W, OY + SH + 1)}`, "transparent")}<div style="color:#a9a4c4;font-size:15px">ninguna sección abierta</div><div style="color:#827e9c;font-size:13px">Elige una en el menú o escribe <span style="color:#bca6ff">help</span> en la consola.</div><div style="border:1px solid #3a3856;padding:6px 14px;color:#e8e9f0;font-size:13px">abrir inicio</div></div>`;

const cap = "padding-top:8px;font-size:16px";
writeFileSync(process.argv[3], `<body style="margin:0;background:#0a0a0f;font-family:monospace;color:#a9a4c4"><div style="padding:22px;display:grid;gap:22px;width:max-content"><figure style="margin:0">${sceneSvg}<figcaption style="${cap}">escena de Inicio</figcaption></figure><div style="display:flex;gap:22px;align-items:flex-start"><figure style="margin:0">${nav}<figcaption style="${cap}">menú: rostro en miniatura en la sección activa</figcaption></figure><figure style="margin:0">${empty}<figcaption style="${cap}">sección cerrada: dormido</figcaption></figure></div></div></body>`);
