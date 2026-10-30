import { useEffect, useRef } from "react";
import { useMascot } from "../lib/mascot";
import { Creature } from "./PixelScene";

// La mascota en miniatura se queda a la derecha de la sección activa del menú. Al cambiar de sección
// baja o sube hasta el ítem nuevo y da un saltito. Se coloca moviendo el elemento directamente (sin
// estado de React) y no se anima la primera vez: aparece ya en su sitio.
const NavMascot = ({ nav, view }) => {
  const mascot = useMascot();
  const bot = useRef(null);

  // useEffect y no useLayoutEffect: la referencia al <nav> del padre se asigna después de los efectos de layout.
  useEffect(() => {
    const mark = bot.current;
    const root = nav.current;
    if (!mark || !root) return undefined;

    const place = () => {
      const link = root.querySelector('[aria-current="page"]');
      mark.dataset.hidden = link ? "false" : "true";
      if (link) mark.style.transform = `translateY(${link.offsetTop + (link.offsetHeight - mark.offsetHeight) / 2}px)`;
    };

    place();

    let frame = 0;
    if (mark.dataset.ready === "true") {
      mark.classList.remove("is-hop");
      void mark.offsetWidth; // reinicia la animación del salto
      mark.classList.add("is-hop");
    } else {
      frame = requestAnimationFrame(() => {
        mark.dataset.ready = "true";
      });
    }

    const observer = new ResizeObserver(place);
    observer.observe(root);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [nav, view, mascot.name]);

  return (
    <span ref={bot} className="nav-bot" data-hidden="true" aria-hidden="true" style={{ "--nav-bot-w": `${mascot.nav.width}px` }}>
      <svg viewBox={mascot.nav.box.join(" ")} shapeRendering="crispEdges" focusable="false">
        <Creature face="idle" />
      </svg>
    </span>
  );
};

export default NavMascot;
