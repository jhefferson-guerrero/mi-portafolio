// Datos del sprite de la mascota.
// o = contorno, g = cuerpo, h = brillo, d = visor, E = ojos, a = acento.
export const CREATURE_COLS = 20;

const SHAPES = [
  "aa",
  "oooooooo",
  "ooghhgggggoo",
  "o" + "ghh" + "g".repeat(9) + "o",
  "og" + "d".repeat(12) + "go",
  "og" + "dd" + "EE" + "dddd" + "EE" + "dd" + "go",
  "og" + "dd" + "EE" + "dddd" + "EE" + "dd" + "go",
  "og" + "d".repeat(12) + "go",
  "oo" + "a".repeat(12) + "oo",
  "o" + "g".repeat(14) + "o",
  "o" + "g".repeat(14) + "o",
  "ogo.ogo....ogo.ogo",
  "o.o.o.o....o.o.o.o",
];

// Cada fila se centra en el lienzo de CREATURE_COLS columnas.
const SPRITE = SHAPES.map((shape) => {
  const pad = (CREATURE_COLS - shape.length) / 2;
  return ".".repeat(pad) + shape + ".".repeat(pad);
});

export const CREATURE_ROWS = SPRITE.length;

export const CREATURE_CELLS = SPRITE.flatMap((row, y) =>
  [...row]
    .map((char, x) => ({ char, x, y }))
    .filter(({ char }) => char !== ".")
);
