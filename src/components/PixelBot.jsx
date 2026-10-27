// Mascota pixel-art dibujada con rects SVG.
// o = contorno, b = cuerpo, s = pantalla, E = ojos, a = acento.
const SPRITE = [
  ".......aa.......",
  ".......oo.......",
  "..oooooooooooo..",
  "..obbbbbbbbbbo..",
  "..obssssssssbo..",
  "..obsEEssEEsbo..",
  "..obsEEssEEsbo..",
  "..obsaasssssbo..",
  "..obbbbbbbbbbo..",
  "..oooooooooooo..",
  "....oooooooo....",
  "...obbbaabbbo...",
  "...obbbbbbbbo...",
  "...oo......oo...",
  "..ooo......ooo..",
];

const COLS = SPRITE[0].length;
const ROWS = SPRITE.length;

const cells = SPRITE.flatMap((row, y) =>
  [...row]
    .map((char, x) => ({ char, x, y }))
    .filter(({ char }) => char !== ".")
);

const PixelBot = ({ size = 96, className = "" }) => (
  <svg
    className={`pixbot ${className}`.trim()}
    viewBox={`0 0 ${COLS} ${ROWS}`}
    width={size}
    height={Math.round((size * ROWS) / COLS)}
    shapeRendering="crispEdges"
    aria-hidden="true"
    focusable="false"
  >
    {cells
      .filter(({ char }) => char !== "E")
      .map(({ char, x, y }) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="1"
          height="1"
          className={`px px-${char} ${char === "a" && y === 7 ? "px-cursor" : ""}`.trim()}
        />
      ))}
    <g className="pixbot-eyes">
      {cells
        .filter(({ char }) => char === "E")
        .map(({ x, y }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className="px px-E" />
        ))}
    </g>
  </svg>
);

export default PixelBot;
