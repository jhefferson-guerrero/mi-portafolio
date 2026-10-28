import { CREATURE_CELLS, CREATURE_COLS, CREATURE_ROWS } from "../lib/creature";

// Celdas de la criatura, para dibujarlas dentro de otro SVG (ver PixelScene).
export const CreatureCells = () => (
  <g className="creature">
    {CREATURE_CELLS.filter(({ char }) => char !== "E").map(({ char, x, y }) => (
      <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className={`px px-${char}`} />
    ))}
    <g className="creature-eyes">
      {CREATURE_CELLS.filter(({ char }) => char === "E").map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className="px px-E" />
      ))}
    </g>
  </g>
);

// Mascota pixel-art sola: una criatura con cúpula, visor y collar de acento.
const PixelBot = ({ size = 96, className = "" }) => (
  <svg
    className={`pixbot ${className}`.trim()}
    viewBox={`0 0 ${CREATURE_COLS} ${CREATURE_ROWS}`}
    width={size}
    height={Math.round((size * CREATURE_ROWS) / CREATURE_COLS)}
    shapeRendering="crispEdges"
    aria-hidden="true"
    focusable="false"
  >
    <CreatureCells />
  </svg>
);

export default PixelBot;
