// Panel de una vista. Todas las vistas permanecen montadas y solo se oculta la inactiva,
// así conservan su estado (por ejemplo, la pestaña de proyecto elegida).
// flush: el cuerpo no lleva relleno (lo usa la vista de proyectos, que trae sus pestañas).
const Pane = ({ id, active, file, hint, home = false, flush = false, children }) => {
  const Title = home ? "p" : "h2";

  return (
    <section
      id={`view-${id}`}
      className={`pane ${flush ? "pane--flush" : ""}`.trim()}
      hidden={!active}
      aria-labelledby={`${id}-title`}
    >
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
