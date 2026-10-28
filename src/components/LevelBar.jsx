import { LEVEL_LABELS, MAX_LEVEL } from "../lib/levels";

// Barra de nivel en segmentos planos. `large` la estira al ancho de su contenedor.
const LevelBar = ({ level, large = false }) => (
  <span
    className={`level ${large ? "level--lg" : ""}`.trim()}
    role="img"
    aria-label={`nivel ${LEVEL_LABELS[level - 1]}`}
  >
    {Array.from({ length: MAX_LEVEL }, (_, i) => (
      <i key={i} className={i < level ? "on" : ""} />
    ))}
  </span>
);

export default LevelBar;
