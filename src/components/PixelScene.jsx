import { CreatureCells } from "./PixelBot";
import { CREATURE_COLS } from "../lib/creature";

const WIDTH = 72;
const HEIGHT = 30;
const FLOOR = 26;

// Rectángulo con borde de 1 px alineado a la cuadrícula de píxeles.
const Box = ({ x, y, w, h, className = "" }) => (
  <rect
    x={x + 0.5}
    y={y + 0.5}
    width={w - 1}
    height={h - 1}
    className={`sc-box ${className}`.trim()}
  />
);

const Px = ({ x, y, w = 1, h = 1, className }) => (
  <rect x={x} y={y} width={w} height={h} className={className} />
);

// Escena: sala de servidores con racks, un escritorio con monitor y la mascota en medio.
// mood = "idle" (tranquila) o "busy" (el monitor trabaja más rápido).
const PixelScene = ({ mood = "idle", className = "" }) => (
  <svg
    className={`scene scene--${mood} ${className}`.trim()}
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    shapeRendering="crispEdges"
    aria-hidden="true"
    focusable="false"
  >
    {/* Marcos en la pared */}
    <Box x={19} y={2} w={9} h={5} />
    <Box x={46} y={2} w={11} h={5} />
    <Px x={21} y={4} w={4} className="sc-line" />
    <Px x={48} y={4} w={7} className="sc-line" />

    {/* Rack alto */}
    <Box x={3} y={7} w={11} h={FLOOR - 7} />
    {[10, 13, 16, 19, 22].map((y) => (
      <Px key={y} x={5} y={y} w={5} className="sc-slot" />
    ))}
    <Px x={12} y={10} className="sc-led" />
    <Px x={12} y={13} className="sc-led sc-led--b" />
    <Px x={12} y={16} className="sc-led sc-led--ok" />
    <Px x={12} y={19} className="sc-led sc-led--c" />

    {/* Rack bajo */}
    <Box x={15} y={15} w={7} h={FLOOR - 15} />
    {[18, 21].map((y) => (
      <Px key={y} x={17} y={y} w={3} className="sc-slot" />
    ))}
    <Px x={20} y={18} className="sc-led sc-led--b" />
    <Px x={20} y={21} className="sc-led sc-led--ok" />

    {/* Escritorio y monitor */}
    <Box x={50} y={10} w={16} h={11} />
    <Px x={51} y={11} w={14} h={9} className="sc-screen" />
    <Px x={52} y={12} w={6} className="sc-line sc-line--a l1" />
    <Px x={52} y={14} w={10} className="sc-line l2" />
    <Px x={52} y={16} w={7} className="sc-line l3" />
    <Px x={52} y={18} w={4} className="sc-line sc-line--a l4" />
    <Px x={57} y={18} className="sc-cursor" />
    <Px x={57} y={21} w={2} h={1} className="sc-slot" />
    <Px x={47} y={22} w={22} h={1} className="sc-desk" />
    <Px x={48} y={23} w={1} h={FLOOR - 23} className="sc-desk" />
    <Px x={67} y={23} w={1} h={FLOOR - 23} className="sc-desk" />

    {/* Polvo flotando */}
    <Px x={30} y={5} className="sc-dust" />
    <Px x={42} y={8} className="sc-dust sc-dust--b" />
    <Px x={25} y={11} className="sc-dust sc-dust--c" />

    {/* Mascota */}
    <g transform={`translate(${(WIDTH - CREATURE_COLS) / 2 - 4} 13)`}>
      <g className="scene-bot">
        <CreatureCells />
      </g>
    </g>

    {/* Suelo */}
    <Px x={0} y={FLOOR} w={WIDTH} h={1} className="sc-floor" />
  </svg>
);

export default PixelScene;
