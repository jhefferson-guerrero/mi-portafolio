import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
// node encapuchado-estados.mjs <estados.html>  → los estados del encapuchado del sitio
// Lee el sprite y los ojos de src/lib/creature.js, así que siempre muestra lo que hay en el sitio.
const root = fileURLToPath(new URL("../../", import.meta.url));
const { MASCOTS } = await import(pathToFileURL(root + "src/lib/creature.js").href);
const M = MASCOTS.encapuchado;

// Paleta del sitio (--px-*, --accent, --ok en src/styles/shell.css)
const P = { m: ["#3a3856", 1], b: ["#1d1c2c", 1], r: ["#2b2940", 1], k: ["#050508", 1], a: ["#bca6ff", 1], t: ["#7a63c9", 0.7], p: ["#7fdcaa", 1], n: ["#7fdcaa", 0.6] };
const TONES = { ok: "#7fdcaa", okd: "#7fdcaa", acc: "#bca6ff" };
const TONE_ALPHA = { okd: 0.45 };

const OX = 6, OY = 6; // hueco a los lados y arriba para las "z" y el salto
const W = M.cols + OX * 2, H = OY + M.rows + 1;
const S = 9;

const idle = M.eyes.idle;
const FACES = [
  { label: "reposo", eyes: idle },
  { label: "parpadeo", eyes: idle.filter(([, y]) => y === 8) },
  { label: "mira a la izquierda", eyes: idle.map(([x, y]) => [x - 1, y]) },
  { label: "mira a la derecha", eyes: idle.map(([x, y]) => [x + 1, y]) },
  { label: "curioso (cursor cerca)", eyes: M.eyes.curious },
  { label: "sorprendido (salta)", eyes: M.eyes.surprised, jump: 1 },
  { label: "furioso (muchos clics)", eyes: M.eyes.angry, wobble: true },
  { label: "contento (sobre un botón)", eyes: M.eyes.happy },
  { label: "dormido", eyes: M.eyes.sleeping, sleep: true },
  { label: "consola (circuitos + texto)", face: "console", eyes: M.eyes.console },
];

const R = (x, y, fill, o = 1, s = 1) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${fill}"${o < 1 ? ` fill-opacity="${o}"` : ""}/>`;
const Z = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [3, 1], [2, 2], [1, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4]];
const zzz = () => [[M.cols - 3, 1], [M.cols, -4]].flatMap(([x, y]) => Z.map(([dx, dy]) => R(x + dx * 0.6 + OX, y + dy * 0.6 + OY, "#bca6ff", 0.8, 0.6))).join("");

const panel = (face) => {
  const jump = face.jump ?? 0;
  const dim = face.sleep ? 0.45 : 1; // dormido: los circuitos y los ojos se apagan
  const body = (M.faceCells[face.face] ?? M.cells).filter(({ char }) => char !== "s").map(({ char, x, y }) => {
    const [fill, o] = P[char];
    return { x, y, fill, o: char === "t" || char === "a" ? o * dim : o };
  });
  const eyes = face.eyes.map(([x, y, tone]) => ({ x, y, fill: TONES[tone] ?? "#bca6ff", o: (TONE_ALPHA[tone] ?? 1) * dim }));
  // furioso: el cuerpo tiembla; se ven dos copias tenues desplazadas un píxel a cada lado
  const ghosts = face.wobble ? [-1, 1].flatMap((dx) => body.filter((c) => c.fill !== P.a[0]).map((c) => ({ ...c, x: c.x + dx, o: c.o * 0.16 }))) : [];
  const shadow = M.shadow.filter(({ x }) => !jump || (x > 6 && x < M.cols - 7));
  const out = [
    `<rect width="${W}" height="${H}" fill="#101018"/>`,
    ...shadow.map(({ x, y }) => R(x + OX, y + OY, "#bca6ff", 0.07)),
    ...[...ghosts, ...body, ...eyes].map((c) => R(c.x + OX, c.y + OY - jump, c.fill, c.o)),
    face.sleep ? zzz() : "",
    `<rect y="${H - 1}" width="${W}" height="1" fill="#2b2940"/>`,
  ];
  return `<svg width="${W * S}" height="${H * S}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${out.join("")}</svg>`;
};

const css = `<style>.g{display:grid;grid-template-columns:repeat(5,${W * S}px);gap:20px;padding:20px;width:max-content}figure{margin:0}figcaption{padding-top:8px;font-size:16px;text-align:center}</style>`;
writeFileSync(
  process.argv[2],
  `<body style="margin:0;background:#0a0a0f;font-family:monospace;color:#a9a4c4">${css}<div class="g">${FACES.map((face) => `<figure>${panel(face)}<figcaption>${face.label}</figcaption></figure>`).join("")}</div></body>`
);
