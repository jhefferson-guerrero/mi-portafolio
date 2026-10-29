import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { complete } from "../lib/commands";
import OutputLine from "./OutputLine";

// Terminal: registro de la sesión arriba y línea de comandos abajo. `api` viene de useConsole.
// En móvil el registro se oculta y la salida del último comando sale en un panel flotante.
const Console = ({ api }) => {
  const { output, entries, run, dismiss, history } = api;
  const [value, setValue] = useState("");
  const position = useRef(-1);
  const draft = useRef("");
  const logRef = useRef(null);

  // Cada entrada nueva se muestra desde su primera línea (el navegador limita el scroll al final).
  useEffect(() => {
    const node = logRef.current;
    const last = node?.querySelector(".log-entry:last-child");
    if (node && last) node.scrollTop = last.offsetTop;
  }, [entries]);

  const submit = (event) => {
    event.preventDefault();
    run(value);
    setValue("");
    position.current = -1;
  };

  const onKeyDown = (event) => {
    const past = history.current;

    if (event.key === "ArrowUp") {
      if (!past.length) return;
      event.preventDefault();
      if (position.current === -1) {
        draft.current = value;
        position.current = past.length - 1;
      } else {
        position.current = Math.max(0, position.current - 1);
      }
      setValue(past[position.current]);
    } else if (event.key === "ArrowDown") {
      if (position.current === -1) return;
      event.preventDefault();
      if (position.current < past.length - 1) {
        position.current += 1;
        setValue(past[position.current]);
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
      <div className="console-log" ref={logRef} role="log" aria-label="Historial de la terminal">
        <div className="console-log-inner">
          {entries.map((entry) => (
            <div key={entry.id} className="log-entry" aria-hidden={entry.auto || undefined}>
              <p className="out-echo log-echo">
                <span className="prompt-sign" aria-hidden="true">$</span>{" "}
                <span className="log-cmd" style={{ "--ch": entry.input.length }}>{entry.input}</span>
              </p>
              {entry.lines.map((line, i) => (
                <div key={i} className="log-line" style={{ "--i": i }}>
                  <OutputLine line={line} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

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
          placeholder='escribe "help"'
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
