import { useState, useRef, useCallback, useEffect } from "react";
import { runCommand } from "../lib/commands";

const MAX_ENTRIES = 30;

// Estado de la consola: el registro visible de la sesión (entries), la salida del último
// comando para la vista móvil (output) y el historial de comandos escritos (history).
// `ctx` trae las acciones que los comandos pueden ejecutar (navegar, copiar, abrir...).
export const useConsole = (ctx) => {
  const [output, setOutput] = useState(null);
  const [entries, setEntries] = useState([]);
  const nextId = useRef(0);
  const history = useRef([]);
  const ctxRef = useRef(ctx);

  useEffect(() => {
    ctxRef.current = ctx;
  });

  // Añade un comando con sus líneas de salida al registro. auto: lo escribió la propia
  // página (por ejemplo al cambiar de sección), no la persona.
  const log = useCallback((input, lines, auto = false) => {
    setEntries((current) => [...current, { id: nextId.current++, input, lines, auto }].slice(-MAX_ENTRIES));
  }, []);

  const run = useCallback(
    async (raw) => {
      const input = raw.trim();
      if (!input) return;

      history.current.push(input);
      const lines = await runCommand(input, { ...ctxRef.current, history: history.current });
      setOutput(lines && lines.length ? { input, lines } : null);

      if (/^(clear|cls)$/i.test(input)) {
        setEntries([]);
      } else if (lines && lines.length) {
        log(input, lines);
      }
    },
    [log]
  );

  const dismiss = useCallback(() => setOutput(null), []);

  return { output, entries, run, log, dismiss, history };
};
