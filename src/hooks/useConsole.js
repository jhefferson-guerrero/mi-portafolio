import { useState, useRef, useCallback, useEffect } from "react";
import { runCommand } from "../lib/commands";

// Estado de la consola: la salida del último comando y el historial de la sesión.
// `ctx` trae las acciones que los comandos pueden ejecutar (navegar, copiar, abrir...).
export const useConsole = (ctx) => {
  const [output, setOutput] = useState(null);
  const history = useRef([]);
  const ctxRef = useRef(ctx);

  useEffect(() => {
    ctxRef.current = ctx;
  });

  const run = useCallback(async (raw) => {
    const input = raw.trim();
    if (!input) return;

    history.current.push(input);
    const lines = await runCommand(input, { ...ctxRef.current, history: history.current });
    setOutput(lines && lines.length ? { input, lines } : null);
  }, []);

  const dismiss = useCallback(() => setOutput(null), []);

  return { output, run, dismiss, history };
};
