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
// idle: los del sprite; curious: rectángulos de 3x4, más altos que anchos (el cursor está cerca); surprised: cuadrados grandes de 4x4;
// sleeping: rayas; happy: arcos; dizzy: equis (la reacción a muchos clics seguidos); console: el prompt de una
// terminal (un > y un guion bajo en verde, con el cursor lila), al escribir un comando ([x, y, tono]).
const BELL_EYES = {
  curious: [...block(7, 5, 3, 4), ...block(12, 5, 3, 4)],
  surprised: [...block(6, 5, 4, 4), ...block(12, 5, 4, 4)],
  sleeping: [[7, 7], [8, 7], [9, 7], [12, 7], [13, 7], [14, 7]],
  happy: [[7, 7], [8, 6], [9, 7], [12, 7], [13, 6], [14, 7]],
  dizzy: [[7, 5], [9, 5], [8, 6], [7, 7], [9, 7], [12, 5], [14, 5], [13, 6], [12, 7], [14, 7]],
  console: [[7, 5, "ok"], [8, 6, "ok"], [7, 7, "ok"], [10, 7, "ok"], [11, 7, "ok"], [12, 7, "ok"], [14, 5, "acc"], [14, 6, "acc"], [14, 7, "acc"]],
};

// ---------- Campana con glitch (salió de una propuesta de "hacker de terminal"): la campana con el marco del visor
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
// rostro para el menú y la forma del aura de partículas (ash: en vez de un arco de puntos, píxeles que se desprenden del borde del propio cuerpo; noise: estática, píxeles que titilan en una franja alrededor del cuerpo; glint: estrellitas en cruz que aparecen y titilan en sitios al azar alrededor de la cabeza). Opcionales: scan (líneas de exploración sobre el cuerpo)
// y faceSprites (un sprite distinto para ciertas caras).
const BELL_IDLE = BELL_SPRITE.flatMap((row, y) => [...row].map((char, x) => (char === "E" ? [x, y] : null)).filter(Boolean));
// Decoración de la pared de cada mascota: dos piezas, una a cada lado de la mascota, en un hueco de 9×7 píxeles.
// frame: true dibuja un marco y el dibujo mide 7×5 por dentro; sin marco, el dibujo ocupa los 9×7. Cada letra es un
// color (a acento, e claro, g gris, o lila oscuro, k verde, m borde); "." deja la pared vacía.
// Son piezas quietas a propósito: lo único que se mueve en la escena es la mascota y su aura.
const WALL = {
  // bit, la tierna: una taza de café en una repisa y un póster de un mando de videojuego
  campana: [
    { rows: ["...e.....", "....e....", "..aaaa...", "..ooooo..", "..oooo.o.", "..ooooo..", "ggggggggg"] },
    { frame: true, rows: [".......", ".ooooo.", "oeoooeo", "oo...oo", "......."] },
  ],
  // nox, el sigiloso: un cartel con el prompt de la terminal y un candado
  encapuchado: [
    { frame: true, rows: [".......", ".a.....", "..a....", ".a.aaa.", "......."] },
    { rows: ["...ggg...", "..g...g..", "..g...g..", ".ooooooo.", ".ooo.ooo.", ".ooo.ooo.", ".ooooooo."] },
  ],
  // bug, el glitch: un bicho (su nombre) y una carita triste, como la de una pantalla de error
  glitch: [
    { rows: ["..k...k..", "...k.k...", "k..kkk..k", ".kkkgkkk.", "k.kkgkk.k", ".kkkgkkk.", "...kkk..."] },
    { frame: true, rows: [".......", ".a...a.", ".......", "..aaa..", ".a...a."] },
  ],
};

// Lo que dice cada mascota. say: frases del globo (cada clic pasa a la siguiente; la primera es el saludo); upset: al
// tocarla sin parar; wake: al despertarla; sleep: mientras duerme. Mantenerlas en unos 30 caracteres: el globo es chico.
const LINES = {
  campana: {
    say: ["Hola, bienvenido", "No todo es código", "¿Echamos una partida?", "Primero café, luego commit", "Gym, series y un buen refactor"],
    upset: "¡Ya, ya!",
    wake: "¡Ay! Me quedé dormido",
    sleep: "Zzz…",
  },
  encapuchado: {
    say: ["bienvenido… no toques nada", "compila hasta que alguien mira", "nunca despliego los viernes", "el modo oscuro no es opcional", "te vi llegar… con calma"],
    upset: "…basta",
    wake: "no dormía… observaba",
    sleep: "…zzz",
  },
  glitch: {
    say: ["hola, bienv3nido", "no es un bug, es una función", "funciona en mi máquina", "undefined… ¿o era null?", "error 404: frase no encontrada"],
    upset: "¡ERR0R! ¡ya!",
    wake: "reiniciando… ¡ay!",
    sleep: "zzz.exe",
  },
};

const DEFINITIONS = {
  campana: {
    label: "bit",
    wall: WALL.campana,
    lines: LINES.campana,
    sprite: BELL_SPRITE,
    eyes: { idle: BELL_IDLE, ...BELL_EYES },
    reaction: "dizzy",
    nav: { box: [2, 0, 18, 11], width: 26 },
    aura: { cy: 17, rx: 13, ry: 9.5, glint: true },
  },
  encapuchado: {
    label: "nox",
    wall: WALL.encapuchado,
    lines: LINES.encapuchado,
    sprite: HOOD_TRACES,
    eyes: HOOD_EYES,
    faceSprites: { console: HOOD_CONSOLE_SPRITE },
    reaction: "angry",
    trail: true, // al hacer clic se desliza y deja una copia tenue en su sitio (ver .sc-ghost en shell.css)
    nav: { box: [2, 0, 18, 11], width: 26 },
    aura: { cy: 17, rx: 13, ry: 10, ash: true },
  },
  glitch: {
    label: "bug",
    wall: WALL.glitch,
    lines: LINES.glitch,
    sprite: GLITCH_SPRITE,
    eyes: GLITCH_EYES,
    faceSprites: GLITCH_FACE_SPRITES,
    reaction: "dizzy",
    scan: true,
    tear: [6, 10], // al hacer clic se parte en franjas por estas filas (cabeza | visor con los ojos | falda) que se corren a lados distintos
    nav: { box: [3, 0, 21, 11], width: 30 },
    aura: { cy: 17, rx: 15, ry: 9.5, noise: true },
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
