import { useEffect, useRef } from "react";
import { CREATURE_COLS, CREATURE_ROWS, SHADOW_CELLS } from "../lib/creature";
import { Creature } from "./PixelScene";

// La "z" necesita 5x5 píxeles y una diagonal de tres para leerse como Z: más angosta parece "I" o "2".
// Se dibuja a Z_SCALE de un píxel de la mascota para que quede chica. Son dos, con aire entre ellas
// para que no se junten, que suben y se desvanecen.
const Z_CELLS = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [3, 1], [2, 2], [1, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4]];
const Z_SCALE = 0.6;
const BOT_X = 9; // el mismo margen a cada lado deja a la mascota centrada; las "z" caben en el de la derecha
const BOT_Y = 7; // deja sitio arriba para la segunda "z" y para que no se corte al subir
const VIEW_W = CREATURE_COLS + BOT_X * 2;
const VIEW_H = CREATURE_ROWS + BOT_Y;

// La mascota sola, dormida: el espacio vacío se lee como "descansando", no como un error.
const SleepingBot = () => (
  <svg
    className="empty-bot face-sleeping"
    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
    shapeRendering="crispEdges"
    aria-hidden="true"
    focusable="false"
  >
    <g transform={`translate(${BOT_X} ${BOT_Y})`}>
      {SHADOW_CELLS.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className="px px-s" />
      ))}
      <Creature face="sleeping" />
    </g>
    {[0, 1].map((n) => (
      <g key={n} transform={`translate(${BOT_X + CREATURE_COLS + 1 + n * 4} ${BOT_Y - n * 4.5}) scale(${Z_SCALE})`}>
        <g className="empty-z" style={{ "--n": n }}>
          {Z_CELLS.map(([dx, dy]) => (
            <rect key={`${dx}-${dy}`} x={dx} y={dy} width="1" height="1" className="px px-E" />
          ))}
        </g>
      </g>
    ))}
  </svg>
);

// Lo que se ve al cerrar una sección: el espacio queda vacío a propósito y avisa cómo volver.
const Closed = ({ active }) => {
  const back = useRef(null);

  // Al cerrar, el botón de la X desaparece: el foco pasa al único control de este espacio.
  useEffect(() => {
    if (active) back.current?.focus();
  }, [active]);

  return (
    <section className="pane pane--empty" hidden={!active} aria-label="Ninguna sección abierta">
      <SleepingBot />
      <p className="empty-title">ninguna sección abierta</p>
      <p className="empty-hint">
        Elige una en el menú o escribe <span className="empty-cmd">help</span> en la consola.
      </p>
      <a ref={back} href="#inicio" className="btn btn--small">
        abrir inicio
      </a>
    </section>
  );
};

export default Closed;
