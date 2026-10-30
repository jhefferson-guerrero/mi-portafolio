import { useContext } from "react";
import { X } from "lucide-react";
import { PaneCloseContext } from "../lib/paneClose";

// Panel de una vista. Todas las vistas permanecen montadas y solo se oculta la inactiva,
// así conservan su estado (por ejemplo, la pestaña de proyecto elegida).
// flush: el cuerpo no lleva relleno (lo usa la vista de proyectos, que trae sus pestañas).
// fill: el contenido se estira hasta ocupar todo el alto del panel.
const Pane = ({ id, active, file, home = false, flush = false, fill = false, children }) => {
  const Title = home ? "p" : "h2";
  const close = useContext(PaneCloseContext);
  const className = ["pane", flush && "pane--flush", fill && "pane--fill"].filter(Boolean).join(" ");

  return (
    <section id={`view-${id}`} className={className} hidden={!active} aria-labelledby={`${id}-title`}>
      <header className="pane-head">
        <Title id={`${id}-title`} className="pane-file">
          <span className="tl">~</span>/{file}
        </Title>
        {close && (
          <button type="button" className="pane-close" onClick={close} aria-label={`Cerrar ${file}`} title="Cerrar (Esc)">
            <X size={13} aria-hidden="true" />
          </button>
        )}
      </header>
      <div className="pane-body">
        <div className="pane-inner">{children}</div>
      </div>
    </section>
  );
};

export default Pane;
