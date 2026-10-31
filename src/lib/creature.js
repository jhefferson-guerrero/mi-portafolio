// Mascotas del sitio. Cada una se define con un sprite (una cadena por fila) y las formas de sus ojos
// en cada cara. Para sumar otra basta con agregarla a MASCOTS.
// Letras del sprite: g = borde claro, r = borde oscuro, o = marco del visor, k = visor, E = ojos,
// m = borde del cuerpo, b = cuerpo, a = insignia, t = circuito (tenue), u / v = fantasma lila / verde del glitch,
// p = verde (prompt del glitch, circuitos encendidos del encapuchado), n = verde tenue, s = sombra. Con scan: true se dibujan líneas de exploración sobre el cuerpo.

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

// ---------- Campana con glitch (la propuesta C de design/mascotas/hacker.mjs): la campana con el marco del visor
// duplicado a un píxel de cada lado (lila a la izquierda, verde a la derecha; titilan), tres filas desplazadas como
// si la imagen se rasgara, ojos verdes en escalón, un prompt verde en el pecho y líneas de exploración tenues.
// El lienzo es más ancho para que quepan los fantasmas y los desplazamientos.
// u = fantasma lila, v = fantasma verde, p = prompt; U / V = un segundo par de fantasmas, más lejos y más tenue.
// Al tener cursor cerca o marearse, el cuerpo se rasga más (extra) y a veces aparece el segundo par (far).
const GLITCH_PAD = 2;
const GLITCH_TEAR = { 4: 1, 8: -1, 12: 2 }; // fila del sprite -> píxeles que se corre
const GLITCH_PROMPT = [[9, 11], [10, 12], [9, 13], [12, 13], [13, 13]]; // ">" y "_" junto a la insignia
const glitchSprite = ({ extra = {}, far = false } = {}) => {
  const cols = BELL_SPRITE[0].length + GLITCH_PAD * 2;
  const grid = BELL_SPRITE.map(() => Array(cols).fill("."));
  const put = (x, y, char) => {
    if (x >= 0 && x < cols) grid[y][x] = char;
  };
  const shift = (y) => (GLITCH_TEAR[y] ?? 0) + (extra[y] ?? 0);
  const cellsOf = BELL_SPRITE.flatMap((row, y) => [...row].map((char, x) => ({ char, x, y })).filter(({ char }) => char !== "." && char !== "s"));
  const frame = cellsOf.filter(({ char }) => char === "g" || char === "o"); // solo el marco se duplica
  if (far) {
    for (const { x, y } of frame) {
      put(x + GLITCH_PAD - 2 + shift(y), y, "U");
      put(x + GLITCH_PAD + 2 + shift(y), y, "V");
    }
  }
  for (const { x, y } of frame) {
    put(x + GLITCH_PAD - 1 + shift(y), y, "u");
    put(x + GLITCH_PAD + 1 + shift(y), y, "v");
  }
  for (const { char, x, y } of cellsOf) put(x + GLITCH_PAD + shift(y), y, char === "E" ? "k" : char);
  GLITCH_PROMPT.forEach(([x, y]) => put(x + GLITCH_PAD, y, "p"));
  BELL_SPRITE.forEach((row, y) => [...row].forEach((char, x) => { if (char === "s") put(x + GLITCH_PAD, y, "s"); }));
  return grid.map((row) => row.join(""));
};
const GLITCH_SPRITE = glitchSprite();

// Ojos del glitch, propios y distintos a los de la campana: [x, y, tono] sobre la cuadrícula de la campana (se les
// suma el margen). Tonos: ok = verde, acc = lila, dim = lila tenue, okd = verde tenue; sin tono = blanco.
// Si una celda se repite gana la última, así un ojo se puede apoyar sobre su copia.
const glitchEyes = (cells) => [...new Map(cells.map(([x, y, tone]) => [`${x},${y}`, [x + GLITCH_PAD, y, tone]])).values()];
const tiles = (x, y, w, h, tone) => block(x, y, w, h).map(([cx, cy]) => [cx, cy, tone]);
const GLITCH_SLITS = [[6, 6], [7, 6], [7, 7], [8, 7], [9, 7], [14, 6], [15, 6], [14, 7], [13, 7], [12, 7]].map(([x, y]) => [x + GLITCH_PAD, y, "ok"]);
const GLITCH_EYES = {
  idle: GLITCH_SLITS,
  // cursor cerca: el ojo izquierdo sigue en reposo y el derecho se abre en un cuadrado (ceja levantada), con eco lila
  curious: glitchEyes([
    ...tiles(11, 5, 3, 3, "dim"), ...tiles(12, 5, 3, 3, "ok"),
    ...[[6, 6], [7, 6], [7, 7], [8, 7], [9, 7]].map(([x, y]) => [x, y, "ok"]),
  ]),
  // sorpresa: dos barras altas con su eco lila y un par de píxeles perdidos
  surprised: glitchEyes([
    ...tiles(6, 5, 2, 4, "dim"), ...tiles(12, 5, 2, 4, "dim"),
    ...tiles(7, 5, 2, 4, "ok"), ...tiles(13, 5, 2, 4, "ok"),
    [10, 5, "dim"], [11, 8, "dim"],
  ]),
  // contento: arcos verdes con una copia lila tenue un píxel más abajo
  happy: glitchEyes([
    ...[[7, 8], [8, 7], [9, 8], [12, 8], [13, 7], [14, 8]].map(([x, y]) => [x, y, "dim"]),
    ...[[7, 7], [8, 6], [9, 7], [12, 7], [13, 6], [14, 7]].map(([x, y]) => [x, y, "ok"]),
  ]),
  // dormido: la señal en reposo, una sola línea plana (en reposo el CSS la pinta en gris)
  sleeping: glitchEyes(tiles(6, 7, 10, 1, "ok")),
  // mareado: los ojos se deshacen en píxeles sueltos de varios tonos
  dizzy: glitchEyes([
    [6, 6, "ok"], [7, 6, "ok"], [7, 8, "acc"], [8, 7, "ok"], [9, 6], [10, 7, "ok"],
    [12, 7, "acc"], [13, 6, "ok"], [14, 6], [14, 8, "ok"], [15, 7, "ok"], [16, 5, "acc"],
  ]),
  // consola: lluvia de código verde que cae dentro del visor
  console: glitchEyes([
    [6, 5, "okd"], [6, 6, "ok"], [6, 7, "ok"],
    [8, 4, "okd"], [8, 5, "okd"], [8, 6, "ok"], [8, 7, "ok"], [8, 8, "ok"],
    [10, 6, "okd"], [10, 7, "ok"],
    [12, 4, "okd"], [12, 5, "ok"], [12, 6, "ok"], [12, 7, "ok"],
    [14, 6, "okd"], [14, 7, "okd"], [14, 8, "ok"], [14, 9, "ok"],
  ]),
};
// Cuerpos de las caras que lo rasgan más: el del mareo (más filas corridas y un segundo par de fantasmas).
const GLITCH_FACE_SPRITES = {
  dizzy: glitchSprite({ extra: { 3: -1, 4: -2, 6: 2, 8: 2, 11: -2, 12: -3 }, far: true }),
};

// ---------- Encapuchado: una figura con capucha y circuitos. Su cara es un vacío con ojos lila.
// Cada fila se escribe solo con su mitad izquierda y se refleja.
// 22 x 19: casi tan alto como la campana (17) y el glitch (17); antes medía 24 x 21 y se sentía más grande.
const HOOD_COLS = 22;
const HOOD_ROWS = [
  ".........mm", "........mbb", "......mmbbb", ".....mbbbbb", "....mbbbbbb", "...mbbrrrrr",
  "...mbrkkkkk", "...mbrkkkkk", "...mbrkkkkk", "...mbrkkkkk", "...mbbrrrrr", "..mbbbbbbbb",
  ".mbbbbbbbab", ".mbbbbbbbab", "mbbbbbbbbab", "mbbbbbbbbbb", "mbbbbbbbbbb",
  "m.bm.bm.b.b", // borde inferior con muescas: hace de pies
  "...ssssssss", // sombra
].map(mirrorRow);

// Circuitos sobre la tela: líneas tenues (t) con un nodo brillante (a) en cada punta.
const HOOD_TRACES = (() => {
  const grid = HOOD_ROWS.map((row) => [...row]);
  const put = (x, y, char) => {
    grid[y][x] = char;
  };
  const side = (cells) => cells.forEach(([x, y, char]) => { put(x, y, char); put(HOOD_COLS - 1 - x, y, char); });
  side([[3, 15, "a"], [4, 15, "t"], [5, 15, "t"], [6, 15, "t"], [7, 15, "t"], [7, 16, "a"]]);
  side([[4, 12, "a"], [5, 12, "t"], [6, 12, "t"]]);
  return grid.map((row) => row.join(""));
})();

// Al escribir un comando, la tela "trabaja": los circuitos y las barras del pecho pasan de lila a verde
// (n = línea tenue, p = nodo y barras).
const HOOD_CONSOLE_SPRITE = HOOD_TRACES.map((row) => row.replace(/t/g, "n").replace(/a/g, "p"));

const mirrorCells = (cells) => [...cells, ...cells.map(([x, y]) => [HOOD_COLS - 1 - x, y])];
const SLIT = [[7, 7], [8, 7], [8, 8], [9, 8]]; // escalón que baja hacia el centro
const HOOD_EYES = {
  // reposo: el ceño de siempre
  idle: mirrorCells(SLIT),
  // ceja levantada: el ojo derecho se abre más
  curious: [...SLIT, [14, 7], [13, 7], [13, 8], [12, 8], [13, 6], [14, 6], [12, 7]],
  surprised: [...block(7, 6, 3, 4), ...block(12, 6, 3, 4)],
  sleeping: mirrorCells([[7, 8], [8, 8], [9, 8]]),
  happy: mirrorCells([[7, 8], [8, 7], [9, 8]]),
  // más grueso: ceño fruncido de verdad
  angry: mirrorCells([[7, 6], [8, 6], [7, 7], [8, 7], [9, 7], [8, 8], [9, 8]]),
  dizzy: mirrorCells([[7, 6], [9, 6], [8, 7], [7, 8], [9, 8]]),
  // al escribir un comando: texto verde en el visor con su cursor lila ([x, y, tono]) y, en el cuerpo, los
  // circuitos encendidos (ver HOOD_CONSOLE_SPRITE)
  console: [
    [7, 7, "ok"], [8, 7, "ok"], [9, 7, "ok"], [10, 7, "ok"], [11, 7, "ok"], [12, 7, "ok"],
    [7, 9, "okd"], [8, 9, "okd"], [9, 9, "okd"],
    [11, 8, "acc"], [11, 9, "acc"],
  ],
};

// Cada mascota: nombre visible (label), sprite, ojos, la cara con la que reacciona a muchos clics seguidos (reaction), el recorte del
// rostro para el menú y la forma del aura de partículas. Opcionales: scan (líneas de exploración sobre el cuerpo)
// y faceSprites (un sprite distinto para ciertas caras).
const BELL_IDLE = BELL_SPRITE.flatMap((row, y) => [...row].map((char, x) => (char === "E" ? [x, y] : null)).filter(Boolean));
const DEFINITIONS = {
  campana: {
    label: "bit",
    sprite: BELL_SPRITE,
    eyes: { idle: BELL_IDLE, ...BELL_EYES },
    reaction: "dizzy",
    nav: { box: [2, 0, 18, 11], width: 26 },
    aura: { cy: 17, rx: 13, ry: 9.5 },
  },
  encapuchado: {
    label: "nox",
    sprite: HOOD_TRACES,
    eyes: HOOD_EYES,
    faceSprites: { console: HOOD_CONSOLE_SPRITE },
    reaction: "angry",
    nav: { box: [2, 0, 18, 11], width: 26 },
    aura: { cy: 17, rx: 13, ry: 10 },
  },
  glitch: {
    label: "bug",
    sprite: GLITCH_SPRITE,
    eyes: GLITCH_EYES,
    faceSprites: GLITCH_FACE_SPRITES,
    reaction: "dizzy",
    scan: true,
    nav: { box: [3, 0, 21, 11], width: 30 },
    aura: { cy: 17, rx: 15, ry: 9.5 },
  },
};

export const MASCOTS = Object.fromEntries(
  Object.entries(DEFINITIONS).map(([name, def]) => {
    const cellsOf = (sprite) =>
      sprite.flatMap((row, y) => [...row].map((char, x) => ({ char, x, y })).filter(({ char }) => char !== "."));
    const cells = cellsOf(def.sprite);
    return [
      name,
      {
        ...def,
        name,
        cols: def.sprite[0].length,
        rows: def.sprite.length,
        cells,
        // Cuerpo propio de algunas caras (el glitch se rasga más al tener el cursor cerca o al marearse).
        faceCells: Object.fromEntries(Object.entries(def.faceSprites ?? {}).map(([face, sprite]) => [face, cellsOf(sprite)])),
        // La sombra (última fila) va aparte del cuerpo: se queda en el suelo cuando la criatura salta.
        shadow: cells.filter(({ char }) => char === "s"),
      },
    ];
  })
);
