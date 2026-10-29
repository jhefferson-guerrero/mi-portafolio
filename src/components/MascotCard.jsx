import { useState } from "react";
import PixelScene from "./PixelScene";

// Lo que dice la mascota; cada clic pasa a la siguiente frase.
const PHRASES = [
  "hola, bienvenido",
  "no todo es código",
  "¿echamos una partida?",
  "primero café, luego commit",
  "gym, series y un buen refactor",
];

// La mascota con su globo de texto, en el cuarto de servidores.
const MascotCard = () => {
  const [phrase, setPhrase] = useState(0);

  return (
    <figure className="mascot-card">
      <p className="bubble" role="status">{PHRASES[phrase]}</p>
      <button
        type="button"
        className="mascot-btn"
        onClick={() => setPhrase((current) => (current + 1) % PHRASES.length)}
        aria-label="Hacer que la mascota diga otra frase"
      >
        <PixelScene />
      </button>
      <figcaption className="mascot-hint" aria-hidden="true">haz clic en la mascota</figcaption>
    </figure>
  );
};

export default MascotCard;
