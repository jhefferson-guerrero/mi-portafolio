// Sprite de la mascota: una criatura en forma de campana con visor enmarcado.
// g = borde claro, r = borde oscuro, o = marco del visor, k = visor, E = ojos,
// m = borde del cuerpo, b = cuerpo, a = insignia, s = sombra.
export const SPRITE = [
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
  "..b....b......b....b..",
  "...ssssssssssssssss...",
];

export const CREATURE_COLS = SPRITE[0].length;
export const CREATURE_ROWS = SPRITE.length;

export const CREATURE_CELLS = SPRITE.flatMap((row, y) =>
  [...row]
    .map((char, x) => ({ char, x, y }))
    .filter(({ char }) => char !== ".")
);

// Ojos de cada cara, como [x, y] sobre la cuadrícula del sprite (el visor ocupa x 5-16, y 4-9).
// idle: los del sprite; surprised: dos cuadrados grandes de 4x4 con un píxel de brillo (tercer valor "h");
// sleeping: rayas; happy: arcos; dizzy: equis.
const block = (x, y, w, h) => Array.from({ length: w * h }, (_, i) => [x + (i % w), y + Math.floor(i / w)]);

export const EYES = {
  idle: CREATURE_CELLS.filter(({ char }) => char === "E").map(({ x, y }) => [x, y]),
  surprised: [...block(6, 5, 4, 4), ...block(12, 5, 4, 4)].map(([x, y]) => (y === 5 && (x === 6 || x === 12) ? [x, y, "h"] : [x, y])),
  sleeping: [[7, 7], [8, 7], [9, 7], [12, 7], [13, 7], [14, 7]],
  happy: [[7, 7], [8, 6], [9, 7], [12, 7], [13, 6], [14, 7]],
  dizzy: [[7, 5], [9, 5], [8, 6], [7, 7], [9, 7], [12, 5], [14, 5], [13, 6], [12, 7], [14, 7]],
};
