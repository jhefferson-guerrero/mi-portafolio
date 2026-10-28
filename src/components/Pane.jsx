// Panel de una vista. Todas las vistas permanecen montadas y solo se oculta la inactiva,
// así conservan su estado (por ejemplo, la pestaña de proyecto elegida).
// flush: el cuerpo no lleva relleno (lo usa la vista de proyectos, que trae sus pestañas).
// fill: el contenido se estira hasta ocupar todo el alto del panel.
const Pane = ({ id, active, file, hint, home = false, flush = false, fill = false, children }) => {
  const Title = home ? "p" : "h2";
  const className = ["pane", flush && "pane--flush", fill && "pane--fill"].filter(Boolean).join(" ");

  return (
    <section id={`view-${id}`} className={className} hidden={!active} aria-labelledby={`${id}-title`}>
      <header className="pane-head">
        <Title id={`${id}-title`} className="pane-file">~/{file}</Title>
        {hint && <span className="pane-hint" aria-hidden="true">{hint}</span>}
      </header>
      <div className="pane-body">
        <div className="pane-inner">{children}</div>
      </div>
    </section>
  );
};

export default Pane;
