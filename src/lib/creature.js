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
