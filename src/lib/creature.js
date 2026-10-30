// Mascotas del sitio. Cada una se define con un sprite (una cadena por fila) y las formas de sus ojos
// en cada cara. Para sumar otra basta con agregarla a MASCOTS.
// Letras del sprite: g = borde claro, r = borde oscuro, o = marco del visor, k = visor, E = ojos,
// m = borde del cuerpo, b = cuerpo, a = insignia, t = circuito (tenue), u / v = fantasma lila / verde del glitch,
// s = sombra.

const block = (x, y, w, h) => Array.from({ length: w * h }, (_, i) => [x + (i % w), y + Math.floor(i / w)]);
const mirrorRow = (half) => half + [...half].reverse().join("");

// ---------- Campana: una criatura con visor enmarcado.
const BELL_SPRITE = [
  "........gggggg........",
  "......grrrrrrrrg......",
  "....ggroooooooorgg....",
  "...grrrkkkkkkkkrrrg...",
  "...gokkkkkkkkkkkkog...",
  "...gokkkkkkkkkkkkog...",
  "...gokkkkEkkEkkkkog...",
  "...gokkEEEkkEEEkkog...",
  "...gokkkkkkkkkkkkog...",
  "...gokkkkkkkkkkkkog...",
  "..grroooooooooooorrg..",
  ".mbbbbbbbbaabbbbbbbbm.",
  ".mbbbbbbbbaabbbbbbbbm.",
  "mbbbbbbbbbbbbbbbbbbbbm",
  "bbbb.bbbb.bb.bbbb.bbbb",
  ".......b......b.......",
  "...ssssssssssssssss...",
];

// Ojos de cada cara, como [x, y] sobre la cuadrícula del sprite (el visor ocupa x 5-16, y 4-9).
// idle: los del sprite; curious: cuadrados de 3x3 (el cursor está cerca); surprised: cuadrados grandes de 4x4;
// sleeping: rayas; happy: arcos; dizzy: equis (la reacción a muchos clics seguidos).
const BELL_EYES = {
  curious: [...block(7, 5, 3, 3), ...block(12, 5, 3, 3)],
  surprised: [...block(6, 5, 4, 4), ...block(12, 5, 4, 4)],
  sleeping: [[7, 7], [8, 7], [9, 7], [12, 7], [13, 7], [14, 7]],
  happy: [[7, 7], [8, 6], [9, 7], [12, 7], [13, 6], [14, 7]],
  dizzy: [[7, 5], [9, 5], [8, 6], [7, 7], [9, 7], [12, 5], [14, 5], [13, 6], [12, 7], [14, 7]],
};
const shiftEyes = (eyes, dx) => Object.fromEntries(Object.entries(eyes).map(([face, cells]) => [face, cells.map(([x, y, tone]) => [x + dx, y, tone])]));

// ---------- Campana con glitch: la campana con una copia fantasma a cada lado (lila a la izquierda, verde a la
// derecha) que titila, y ojos verdes en escalón. El lienzo es más ancho para que quepan los fantasmas.
// u = fantasma lila, v = fantasma verde.
const GLITCH_PAD = 2;
const GLITCH_SPRITE = (() => {
  const cols = BELL_SPRITE[0].length + GLITCH_PAD * 2;
  const grid = BELL_SPRITE.map(() => Array(cols).fill("."));
  const cellsOf = BELL_SPRITE.flatMap((row, y) => [...row].map((char, x) => ({ char, x, y })).filter(({ char }) => char !== "." && char !== "s"));
  for (const { x, y } of cellsOf) {
    grid[y][x] = "u";
    grid[y][x + GLITCH_PAD * 2] = "v";
  }
  for (const { char, x, y } of cellsOf) grid[y][x + GLITCH_PAD] = char === "E" ? "k" : char;
  BELL_SPRITE.forEach((row, y) => [...row].forEach((char, x) => { if (char === "s") grid[y][x + GLITCH_PAD] = "s"; }));
  return grid.map((row) => row.join(""));
})();
const GLITCH_SLITS = [[6, 6], [7, 6], [7, 7], [8, 7], [9, 7], [14, 6], [15, 6], [14, 7], [13, 7], [12, 7]].map(([x, y]) => [x + GLITCH_PAD, y, "ok"]);

// ---------- Encapuchado: una figura con capucha y circuitos. Su cara es un vacío con ojos lila.
// Cada fila se escribe solo con su mitad izquierda y se refleja.
const HOOD_COLS = 24;
const HOOD_ROWS = [
  "..........mm", "........mmbb", "......mmbbbb", ".....mbbbbbb", "....mbbbbbbb", "...mbbrrrrrr",
  "...mbrkkkkkk", "...mbrkkkkkk", "...mbrkkkkkk", "...mbrkkkkkk", "...mbbrrrrrr", "..mbbbbbbbbb",
  ".mbbbbbbbbab", ".mbbbbbbbbab", "mbbbbbbbbbab", "mbbbbbbbbbbb", "mbbbbbbbbbbb", "mbbbbbbbbbbb",
  "mbbbbbbbbbbb", "m.bm.bm.bm.b", // borde inferior con muescas: hace de pies
  "....ssssssss", // sombra
].map(mirrorRow);

// Circuitos sobre la tela: líneas tenues (t) con un nodo brillante (a) en cada punta.
const HOOD_TRACES = (() => {
  const grid = HOOD_ROWS.map((row) => [...row]);
  const put = (x, y, char) => {
    grid[y][x] = char;
  };
  const side = (cells) => cells.forEach(([x, y, char]) => { put(x, y, char); put(HOOD_COLS - 1 - x, y, char); });
  side([[3, 15, "a"], [4, 15, "t"], [5, 15, "t"], [6, 15, "t"], [7, 15, "t"], [7, 16, "t"], [7, 17, "t"], [7, 18, "a"]]);
  side([[4, 12, "a"], [5, 12, "t"], [6, 12, "t"]]);
  return grid.map((row) => row.join(""));
})();

const mirrorCells = (cells) => [...cells, ...cells.map(([x, y]) => [HOOD_COLS - 1 - x, y])];
const SLIT = [[7, 7], [8, 7], [8, 8], [9, 8], [10, 8]]; // escalón que baja hacia el centro
const HOOD_EYES = {
  // reposo: el ceño de siempre
  idle: mirrorCells(SLIT),
  // ceja levantada: el ojo derecho se abre más
  curious: [...SLIT, [15, 6], [16, 6], [14, 7], [15, 7], [16, 7], [13, 8], [14, 8], [15, 8]],
  surprised: [...block(7, 6, 3, 4), ...block(14, 6, 3, 4)],
  sleeping: mirrorCells([[7, 8], [8, 8], [9, 8]]),
  happy: mirrorCells([[7, 8], [8, 7], [9, 8]]),
  // más grueso: ceño fruncido de verdad
  angry: mirrorCells([[7, 6], [8, 6], [7, 7], [8, 7], [9, 7], [8, 8], [9, 8], [10, 8]]),
  dizzy: mirrorCells([[7, 6], [9, 6], [8, 7], [7, 8], [9, 8]]),
  // al escribir un comando: un prompt verde con el cursor lila ([x, y, tono])
  console: [[7, 6, "ok"], [8, 7, "ok"], [9, 8, "ok"], [8, 9, "ok"], [7, 9, "ok"], [12, 9, "ok"], [13, 9, "ok"], [14, 9, "ok"], [15, 9, "ok"], [16, 6, "acc"], [16, 7, "acc"], [16, 8, "acc"]],
};

// Cada mascota: sprite, ojos, la cara con la que reacciona a muchos clics seguidos (reaction), el recorte del
// rostro para el menú y la forma del aura de partículas.
const BELL_IDLE = BELL_SPRITE.flatMap((row, y) => [...row].map((char, x) => (char === "E" ? [x, y] : null)).filter(Boolean));
const DEFINITIONS = {
  campana: {
    label: "campana",
    sprite: BELL_SPRITE,
    eyes: { idle: BELL_IDLE, ...BELL_EYES },
    reaction: "dizzy",
    nav: { box: [0, 0, 22, 16], width: 26 },
    aura: { cy: 17, rx: 13, ry: 9.5 },
  },
  encapuchado: {
    label: "encapuchado",
    sprite: HOOD_TRACES,
    eyes: HOOD_EYES,
    reaction: "angry",
    nav: { box: [2, 1, 20, 10], width: 28 },
    aura: { cy: 16, rx: 14, ry: 11 },
  },
  glitch: {
    label: "glitch",
    sprite: GLITCH_SPRITE,
    eyes: { idle: GLITCH_SLITS, ...shiftEyes(BELL_EYES, GLITCH_PAD) },
    reaction: "dizzy",
    nav: { box: [0, 0, 26, 16], width: 30 },
    aura: { cy: 17, rx: 15, ry: 9.5 },
  },
};

export const MASCOTS = Object.fromEntries(
  Object.entries(DEFINITIONS).map(([name, def]) => {
    const cells = def.sprite.flatMap((row, y) =>
      [...row].map((char, x) => ({ char, x, y })).filter(({ char }) => char !== ".")
    );
    return [
      name,
      {
        ...def,
        name,
        cols: def.sprite[0].length,
        rows: def.sprite.length,
        cells,
        // La sombra (última fila) va aparte del cuerpo: se queda en el suelo cuando la criatura salta.
        shadow: cells.filter(({ char }) => char === "s"),
      },
    ];
  })
);
