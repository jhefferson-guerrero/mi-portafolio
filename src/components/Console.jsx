import { useState, useRef } from "react";
import { X } from "lucide-react";
import { complete } from "../lib/commands";

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

// Consola de comandos. `api` viene de useConsole.
const Console = ({ api }) => {
  const { output, run, dismiss, history } = api;
  const [value, setValue] = useState("");
  const position = useRef(-1);
  const draft = useRef("");

  const submit = (event) => {
    event.preventDefault();
    run(value);
    setValue("");
    position.current = -1;
  };

  const onKeyDown = (event) => {
    const entries = history.current;

    if (event.key === "ArrowUp") {
      if (!entries.length) return;
      event.preventDefault();
      if (position.current === -1) {
        draft.current = value;
        position.current = entries.length - 1;
      } else {
        position.current = Math.max(0, position.current - 1);
      }
      setValue(entries[position.current]);
    } else if (event.key === "ArrowDown") {
      if (position.current === -1) return;
      event.preventDefault();
      if (position.current < entries.length - 1) {
        position.current += 1;
        setValue(entries[position.current]);
      } else {
        position.current = -1;
        setValue(draft.current);
      }
    } else if (event.key === "Tab") {
      if (!value.trim()) return;
      event.preventDefault();
      setValue(complete(value));
    } else if (event.key === "Escape") {
      dismiss();
    }
  };

  return (
    <section className="console" aria-label="Terminal">
      {output && (
        <div className="console-out" role="log">
          <div className="console-out-head">
            <span>salida</span>
            <button type="button" className="icon-link" onClick={dismiss} aria-label="Cerrar salida">
              <X size={14} />
            </button>
          </div>
          <div className="console-out-body">
            <p className="out-echo">
              <span className="prompt-sign" aria-hidden="true">$</span> {output.input}
            </p>
            {output.lines.map((line, i) => (
              <OutputLine key={i} line={line} />
            ))}
          </div>
        </div>
      )}

      <form className="console-in" onSubmit={submit}>
        <label htmlFor="console-input" className="console-label">
          <span className="prompt-user">
            jg@portafolio:<span className="tl">~</span>
          </span>
          <span className="prompt-sign" aria-hidden="true">$</span>
          <span className="sr-only">Terminal. Escribe un comando y presiona Enter.</span>
        </label>
        <input
          id="console-input"
          className="console-input"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder='escribe "help" y presiona Enter'
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
        />
        <kbd className="console-kbd" aria-hidden="true">/</kbd>
      </form>
    </section>
  );
};

export default Console;
