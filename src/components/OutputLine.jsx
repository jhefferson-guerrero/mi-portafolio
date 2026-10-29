// Una línea de salida de la consola: { kind, text, name?, href? }
const OutputLine = ({ line }) => {
  switch (line.kind) {
    case "head":
      return <p className="out-head">{line.text}</p>;
    case "kv":
      return (
        <p className="out-kv">
          <span className="out-key">{line.name}</span>
          <span>{line.text}</span>
        </p>
      );
    case "link":
      return (
        <p>
          <a href={line.href} className="out-link" target="_blank" rel="noopener noreferrer">
            {line.text} ↗
          </a>
        </p>
      );
    default:
      return <p className={`out-${line.kind}`}>{line.text}</p>;
  }
};

export default OutputLine;
