import { useState, useEffect, useRef, useCallback } from "react";
import { content } from "../data/content";
import PixelScene from "./PixelScene";

// Arranque tipo BIOS en tres pantallas. Todo se deriva del tiempo transcurrido (ms),
// así que el orden y la duración se ajustan cambiando estas constantes.
// No se puede saltar: dura como mínimo TOTAL y, si lo esencial (tipografías y foto) aún no llegó,
// espera en la última pantalla hasta MAX_WAIT; pasado ese tiempo entra igual para no quedar colgado.
const POST_END = 3400; // pantalla 1: prueba de memoria y detección de discos
const INFO_END = 6000; // pantalla 2: ficha del sistema y módulos
const TOTAL = 8500; // pantalla 3: carga final con la mascota
const MAX_WAIT = 20000; // espera máxima real (ms) por los recursos esenciales
// Con movimiento reducido no hay pantallas de texto: solo la carga final, lo justo para esperar lo esencial.
const REDUCED_TOTAL = INFO_END + 900;

const MEMORY_START = 800;
const MEMORY_END = 1900;
const MEMORY_TOTAL = 262144;
const SPINNER = ["|", "/", "-", "\\"];

const { meta, hero, projects, languages } = content;

const DRIVES = ["Maestro IDE primario", "Esclavo IDE primario", "Maestro IDE secundario", "Esclavo IDE secundario"];

const SYSTEM_LEFT = [
  ["Nombre", meta.name],
  ["Rol", hero.role],
  ["Ubicación", meta.location],
];
const SYSTEM_RIGHT = [
  ["Estudios", meta.studies],
  ["Busco", meta.seeking],
  ["Estado", meta.availability],
];
const DETAIL_LEFT = [
  ["Idiomas", languages.map((language) => language.name).join(", ")],
  ["Stack", "React · Tailwind · Firebase"],
  ["Proyectos", String(projects.length)],
];
const DETAIL_RIGHT = [
  ["Pantalla", "Negro + lila"],
  ["Consola", 'escribe "help"'],
  ["Versión", `jg-shell ${meta.version}`],
];
const MODULES = [
  ["01", "Perfil", "Lateral"],
  ["02", "Paneles", "Interfaz"],
  ["03", "Consola", "Terminal"],
  ["04", "Mascota", "Gráficos"],
];

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const pad = (n) => String(n).padStart(2, "0");

const formatDate = (date) => `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

// Muestra su contenido solo cuando ya pasó el instante `at`.
const At = ({ t, at, className, children }) =>
  t >= at ? <p className={className}>{children}</p> : null;

const KeyValues = ({ rows }) => (
  <div>
    {rows.map(([key, value]) => (
      <p key={key} className="bios-kv">
        <span>{key}</span>
        <span>: {value}</span>
      </p>
    ))}
  </div>
);

const PostScreen = ({ t, stamp }) => {
  const memory = Math.round(clamp01((t - MEMORY_START) / (MEMORY_END - MEMORY_START)) * MEMORY_TOTAL);
  const memoryDone = t >= MEMORY_END;

  return (
    <div className="bios">
      <At t={t} at={0} className="bios-head">JG Modular BIOS v1.0, Edición Portafolio</At>
      <At t={t} at={150}>Copyright (C) 2026 {meta.name}</At>
      <At t={t} at={300}>Versión {meta.version}</At>

      <At t={t} at={650} className="bios-gap">CPU Frontend ODP-REACT a 4.2GHz</At>
      {t >= MEMORY_START && (
        <p>
          Prueba de memoria : {memory}K
          {memoryDone ? <span className="bios-ok"> OK</span> : <span className="cursor" aria-hidden="true" />}
        </p>
      )}

      <At t={t} at={2000} className="bios-gap">Extensión Plug and Play de JG v1.0A</At>
      <At t={t} at={2100}>Copyright (C) 2026 {meta.name}</At>

      {projects.slice(0, DRIVES.length).map((project, i) => (
        <At key={project.short} t={t} at={2350 + i * 250} className={i === 0 ? "bios-gap bios-indent" : "bios-indent"}>
          Detectando {DRIVES[i]} ... {project.short}
          {t >= 2350 + i * 250 + 200 && <span className="bios-ok"> OK</span>}
        </At>
      ))}

      <div className="bios-foot">
        <p>Cargando tipografías e imágenes del portafolio</p>
        <p>{stamp}-JGSHELL-LIMA-00</p>
      </div>
    </div>
  );
};

const InfoScreen = ({ t }) => (
  <div className="bios">
    {t >= 3500 && (
      <div className="bios-box">
        <KeyValues rows={SYSTEM_LEFT} />
        <KeyValues rows={SYSTEM_RIGHT} />
      </div>
    )}
    {t >= 3800 && (
      <div className="bios-box">
        <KeyValues rows={DETAIL_LEFT} />
        <KeyValues rows={DETAIL_RIGHT} />
      </div>
    )}

    <At t={t} at={4150} className="bios-gap">Listado de módulos .....</At>
    {t >= 4300 && (
      <div className="bios-table">
        <span>N.º</span>
        <span>Módulo</span>
        <span>Clase</span>
        <span>Estado</span>
        {MODULES.map(([number, name, kind], i) =>
          t >= 4400 + i * 170 ? (
            <div key={number} className="bios-table-row">
              <span>{number}</span>
              <span>{name}</span>
              <span>{kind}</span>
              <span className="bios-ok">OK</span>
            </div>
          ) : null
        )}
      </div>
    )}

    <At t={t} at={5200} className="bios-gap">
      Verificando datos del portafolio {".".repeat(Math.max(1, Math.min(7, Math.floor((t - 5200) / 90) + 1)))}
    </At>
    <At t={t} at={5600}>
      Arrancando desde portafolio.img : <span className="cursor" aria-hidden="true" />
    </At>
  </div>
);

const LoadScreen = ({ t, total, ready }) => {
  const timed = clamp01((t - INFO_END) / (total - INFO_END));
  // La barra no llega al 100 % mientras falten recursos esenciales.
  const progress = ready ? timed : Math.min(timed, 0.99);
  const waiting = !ready && timed >= 1;
  const status = waiting
    ? "Cargando recursos"
    : progress < 0.34
      ? "Montando perfil"
      : progress < 0.67
        ? "Cargando proyectos"
        : "Iniciando consola";

  return (
    <div className="bios-load">
      <PixelScene mood="busy" className="boot-scene" />
      <p className="boot-title">jg-shell</p>
      <p className="boot-status">
        {status} ... {SPINNER[Math.floor(t / 120) % SPINNER.length]}
      </p>
      <div className="boot-bar" aria-hidden="true">
        <div className="boot-bar-fill" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <p className="boot-percent">{Math.round(progress * 100)}%</p>
    </div>
  );
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Pantalla de arranque. `ready` indica que lo esencial ya se descargó (ver useBootAssets).
const LoadingScreen = ({ onComplete, ready }) => {
  const [reduced] = useState(prefersReducedMotion);
  const startAt = reduced ? INFO_END : 0;
  const total = reduced ? REDUCED_TOTAL : TOTAL;
  const [elapsed, setElapsed] = useState(startAt);
  const [stamp] = useState(() => formatDate(new Date()));
  const finished = useRef(false);
  const readyRef = useRef(ready);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  useEffect(() => {
    const begin = performance.now();
    const timer = setInterval(() => {
      const spent = performance.now() - begin;
      setElapsed(startAt + spent);
      if ((startAt + spent >= total && readyRef.current) || spent >= MAX_WAIT) {
        clearInterval(timer);
        finish();
      }
    }, 40);
    return () => clearInterval(timer);
  }, [finish, startAt, total]);

  return (
    <div className="boot" role="status">
      <p className="sr-only">Cargando el portafolio.</p>

      <div className="boot-screen" aria-hidden="true">
        {elapsed < POST_END && <PostScreen t={elapsed} stamp={stamp} />}
        {elapsed >= POST_END && elapsed < INFO_END && <InfoScreen t={elapsed} />}
        {elapsed >= INFO_END && <LoadScreen t={elapsed} total={total} ready={ready} />}
      </div>
    </div>
  );
};

export default LoadingScreen;
