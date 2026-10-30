import { useCallback, useEffect, useRef, useState } from "react";
import PixelScene from "./PixelScene";
import { useMascot } from "../lib/mascot";

// Lo que dice la mascota; cada clic pasa a la siguiente frase.
const PHRASES = [
  "hola, bienvenido",
  "no todo es código",
  "¿echamos una partida?",
  "primero café, luego commit",
  "gym, series y un buen refactor",
];

const SLEEP_AFTER = 25000; // sin actividad durante este tiempo (ms), se duerme
const UPSET_CLICKS = 5; // clics seguidos que la alteran (se marea o se enoja, según la mascota)...
const CLICK_WINDOW = 2400; // ...dentro de este margen (ms)
const NEAR_DISTANCE = 150; // a esta distancia del cursor (px) abre más los ojos
const ACTIVITY_EVENTS = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"];

// La cara de reposo: dormida, contenta (mouse sobre un botón), curiosa (cursor cerca) o normal.
const restFace = (m) => (m.asleep ? "sleeping" : m.hover ? "happy" : m.near ? "curious" : "idle");

// La mascota con su globo de texto, en el cuarto de servidores. Un aura de partículas la envuelve y da
// un destello al clic. Su cara cambia:
// abre más los ojos cuando el cursor se acerca, se alegra con Contactar y CV (los elementos con
// data-mascot="happy"), se marea o se enoja si la tocan sin parar y se duerme si nadie hace nada; al moverse el
// mouse despierta.
const MascotCard = () => {
  const [phrase, setPhrase] = useState(0);
  const [face, setFace] = useState("idle");
  const [line, setLine] = useState(null);
  const [burst, setBurst] = useState(0);
  const [hop, setHop] = useState(false);
  const mascot = useMascot();
  const buttonRef = useRef(null);
  const mood = useRef({ asleep: false, busy: false, upset: false, hover: false, near: false, clicks: [], reactTimer: 0, sleepTimer: 0, hopTimer: 0 });

  // Vuelve a la cara de reposo: dormida, contenta (con el mouse sobre un botón) o normal.
  const settle = useCallback(() => {
    const m = mood.current;
    m.busy = false;
    m.upset = false;
    setLine(null);
    setFace(restFace(m));
  }, []);

  // Pone una cara durante un rato y, opcionalmente, una frase propia en el globo.
  const react = useCallback(
    (next, duration, text = null) => {
      const m = mood.current;
      clearTimeout(m.reactTimer);
      m.busy = true;
      m.upset = next === "angry" || next === "dizzy";
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
      if (!m.busy && !m.asleep) setFace(restFace(m));
    };

    // Cursor cerca de la mascota (medido desde el borde de su escena): ojos más abiertos.
    const setNear = (near) => {
      if (near === m.near) return;
      m.near = near;
      if (!m.busy && !m.asleep && !m.hover) setFace(restFace(m));
    };

    // Se mide una vez por cuadro, no en cada evento del mouse.
    let frame = 0;
    let pointer = null;
    const measure = () => {
      frame = 0;
      const node = buttonRef.current;
      if (!node || !pointer) return;
      const rect = node.getBoundingClientRect();
      if (!rect.width) return;
      const dx = Math.max(rect.left - pointer.x, 0, pointer.x - rect.right);
      const dy = Math.max(rect.top - pointer.y, 0, pointer.y - rect.bottom);
      setNear(Math.hypot(dx, dy) < NEAR_DISTANCE);
    };

    const onMove = (event) => {
      if (calm || event.pointerType === "touch") return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const onLeave = () => setNear(false);

    // Al escribir un comando en la consola, la mascota muestra su cara de "consola" un momento.
    const onCommand = () => {
      if (!m.asleep) react("console", 1100);
    };

    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, onActivity, { passive: true }));
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("jg:command", onCommand);
    document.documentElement.addEventListener("mouseleave", onLeave);
    arm();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(m.reactTimer);
      clearTimeout(m.sleepTimer);
      clearTimeout(m.hopTimer);
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, onActivity));
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("jg:command", onCommand);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [react]);

  const onClick = () => {
    const m = mood.current;
    const now = Date.now();
    m.clicks = [...m.clicks.filter((time) => now - time < CLICK_WINDOW), now];
    setPhrase((current) => (current + 1) % PHRASES.length);

    // Cada clic hace que el aura dé un destello; alterada, más clics solo alargan la reacción y, si no,
    // cinco clics seguidos la provocan. Un clic normal no cambia la cara: solo salta un poco.
    setBurst((current) => current + 1);
    if (m.upset || m.clicks.length >= UPSET_CLICKS) {
      m.clicks = [];
      react(mascot.reaction, 1800, "¡ya, ya!");
    } else {
      setHop(true);
      clearTimeout(m.hopTimer);
      m.hopTimer = setTimeout(() => setHop(false), 450);
    }
  };

  return (
    <figure className="mascot-card">
      <p className="bubble" role="status">{line ?? PHRASES[phrase]}</p>
      <button
        ref={buttonRef}
        type="button"
        className="mascot-btn"
        onClick={onClick}
        aria-label="Hacer que la mascota diga otra frase"
      >
        <PixelScene face={face} burst={burst} hop={hop} />
      </button>
    </figure>
  );
};

export default MascotCard;
