import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Titlebar from "./components/Titlebar";
import Sidebar from "./components/Sidebar";
import Console from "./components/Console";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Services from "./components/Services";
import Interests from "./components/Interests";
import Contact from "./components/Contact";
import LoadingScreen from "./components/LoadingScreen";
import { useConsole } from "./hooks/useConsole";
import { content } from "./data/content";
import "./styles/shell.css";

const VIEW_IDS = content.nav.map((item) => item.id);
const CV_NAME = "CV-Jhefferson-Guerrero.pdf";

// El arranque se muestra en cada carga de la página; solo se omite si la persona
// prefiere movimiento reducido.
const shouldShowLoader = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mientras se navega, la vista activa vive en el hash (#proyectos): los enlaces y el botón atrás funcionan.
const readHash = () => {
  const id = window.location.hash.slice(1);
  return VIEW_IDS.includes(id) ? id : VIEW_IDS[0];
};

const isTyping = (target) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

function App() {
  const [showLoader] = useState(shouldShowLoader);
  const [isLoading, setIsLoading] = useState(showLoader);
  // Cada carga empieza en inicio, aunque la URL traiga un hash.
  const [view, setView] = useState(VIEW_IDS[0]);
  const [project, setProject] = useState(0);

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    const onHashChange = () => setView(readHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // En móvil la página sí hace scroll: al cambiar de vista volvemos arriba.
  useEffect(() => {
    if (window.matchMedia("(max-width: 900px)").matches) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [view]);

  const navigate = useCallback((id) => {
    if (window.location.hash.slice(1) !== id) window.location.hash = id;
  }, []);

  const openProject = useCallback(
    (index) => {
      setProject(index);
      navigate("proyectos");
    },
    [navigate]
  );

  const consoleCtx = useMemo(
    () => ({
      navigate,
      openProject,
      copyEmail: async () => {
        try {
          await navigator.clipboard.writeText(content.socials.email.replace("mailto:", ""));
          return true;
        } catch {
          return false;
        }
      },
      downloadCv: () => {
        const link = document.createElement("a");
        link.href = content.hero.cvLink;
        link.download = CV_NAME;
        link.click();
      },
      openUrl: (url) => window.open(url, "_blank", "noopener,noreferrer"),
    }),
    [navigate, openProject]
  );

  const terminal = useConsole(consoleCtx);
  const { run, log } = terminal;

  // Cada vez que cambia la sección, la consola "abre" su archivo.
  const loggedView = useRef(null);
  useEffect(() => {
    if (loggedView.current === view) return;
    loggedView.current = view;
    const section = content.nav.find((item) => item.id === view);
    log(
      `cd ${section.cmd}`,
      [
        { kind: "dim", text: `leyendo ${section.file} ...` },
        { kind: "ok", text: "listo" },
      ],
      true
    );
  }, [view, log]);

  // Atajos: 1-6 cambian de vista y "/" enfoca la consola (si no se está escribiendo).
  useEffect(() => {
    if (isLoading) return;

    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey || isTyping(event.target)) return;

      if (event.key === "/") {
        event.preventDefault();
        document.getElementById("console-input")?.focus();
        return;
      }

      const index = Number(event.key) - 1;
      if (Number.isInteger(index) && index >= 0 && index < VIEW_IDS.length) navigate(VIEW_IDS[index]);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLoading, navigate]);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {showLoader && (
        <div className={`loader ${!isLoading ? "is-done" : ""}`}>
          <LoadingScreen onComplete={handleLoadingComplete} />
        </div>
      )}

      {!isLoading && (
        <div className="app">
          <a className="skip-link" href="#main">Saltar al contenido</a>
          <div className="window">
            <Titlebar view={view} />

            <div className="shell">
              <Sidebar view={view} />

              <main id="main" className="workspace">
                <Console api={terminal} />
                <Hero active={view === "inicio"} navigate={navigate} />
                <About active={view === "about"} />
                <Skills active={view === "skills"} />
                <Projects active={view === "proyectos"} selected={project} onSelect={setProject} />
                <Services active={view === "servicios"} />
                <Interests active={view === "extra"} />
                <Contact active={view === "contacto"} onRun={run} />
              </main>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
