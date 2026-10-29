import { useCallback, useEffect, useRef, useState } from "react";
import PixelScene from "./PixelScene";

// Lo que dice la mascota; cada clic pasa a la siguiente frase.
const PHRASES = [
  "hola, bienvenido",
  "no todo es código",
  "¿echamos una partida?",
  "primero café, luego commit",
  "gym, series y un buen refactor",
];

const SLEEP_AFTER = 25000; // sin actividad durante este tiempo (ms), se duerme
const DIZZY_CLICKS = 5; // clics seguidos que la marean...
const CLICK_WINDOW = 2400; // ...dentro de este margen (ms)
const ACTIVITY_EVENTS = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"];

// La mascota con su globo de texto, en el cuarto de servidores. Su cara cambia: se sorprende al clic,
// se alegra con Contactar y CV (los elementos con data-mascot="happy"), se marea si la tocan sin parar
// y se duerme si nadie hace nada; al moverse el mouse despierta.
const MascotCard = () => {
  const [phrase, setPhrase] = useState(0);
  const [face, setFace] = useState("idle");
  const [line, setLine] = useState(null);
  const mood = useRef({ asleep: false, busy: false, dizzy: false, hover: false, clicks: [], reactTimer: 0, sleepTimer: 0 });

  // Vuelve a la cara de reposo: dormida, contenta (con el mouse sobre un botón) o normal.
  const settle = useCallback(() => {
    const m = mood.current;
    m.busy = false;
    m.dizzy = false;
    setLine(null);
    setFace(m.asleep ? "sleeping" : m.hover ? "happy" : "idle");
  }, []);

  // Pone una cara durante un rato y, opcionalmente, una frase propia en el globo.
  const react = useCallback(
    (next, duration, text = null) => {
      const m = mood.current;
      clearTimeout(m.reactTimer);
      m.busy = true;
      m.dizzy = next === "dizzy";
      setFace(next);
      setLine(text);
      m.reactTimer = setTimeout(settle, duration);
    },
    [settle]
  );

  useEffect(() => {
    const m = mood.current;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fallAsleep = () => {
      clearTimeout(m.reactTimer);
      m.asleep = true;
      m.busy = false;
      setFace("sleeping");
      setLine("zzz…");
    };

    const arm = () => {
      clearTimeout(m.sleepTimer);
      if (!calm) m.sleepTimer = setTimeout(fallAsleep, SLEEP_AFTER);
    };

    const onActivity = () => {
      if (m.asleep) {
        m.asleep = false;
        react("surprised", 1100, "¡ay! me quedé dormido");
      }
      arm();
    };

    const onOver = (event) => {
      const target = event.target instanceof Element ? event.target.closest("[data-mascot]") : null;
      m.hover = target?.dataset.mascot === "happy";
      if (!m.busy && !m.asleep) setFace(m.hover ? "happy" : "idle");
    };

    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, onActivity, { passive: true }));
    window.addEventListener("pointerover", onOver, { passive: true });
    arm();

    return () => {
      clearTimeout(m.reactTimer);
      clearTimeout(m.sleepTimer);
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, onActivity));
      window.removeEventListener("pointerover", onOver);
    };
  }, [react]);

  const onClick = () => {
    const m = mood.current;
    const now = Date.now();
    m.clicks = [...m.clicks.filter((time) => now - time < CLICK_WINDOW), now];
    setPhrase((current) => (current + 1) % PHRASES.length);

    // Mareada, más clics solo alargan el mareo; si no, el número de clics seguidos decide la cara.
    if (m.dizzy || m.clicks.length >= DIZZY_CLICKS) {
      m.clicks = [];
      react("dizzy", 1800, "¡ya, ya!");
    } else {
      react("surprised", 800);
    }
  };

  return (
    <figure className="mascot-card">
      <p className="bubble" role="status">{line ?? PHRASES[phrase]}</p>
      <button
        type="button"
        className="mascot-btn"
        onClick={onClick}
        aria-label="Hacer que la mascota diga otra frase"
      >
        <PixelScene face={face} />
      </button>
      <figcaption className="mascot-hint" aria-hidden="true">haz clic en la mascota</figcaption>
    </figure>
  );
};

export default MascotCard;
