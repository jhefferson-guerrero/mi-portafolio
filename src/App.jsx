import { useState, useEffect, useCallback, useMemo } from "react";
import Titlebar from "./components/Titlebar";
import Sidebar from "./components/Sidebar";
import Console from "./components/Console";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Services from "./components/Services";
import Contact from "./components/Contact";
import LoadingScreen from "./components/LoadingScreen";
import { useConsole } from "./hooks/useConsole";
import { content } from "./data/content";
import "./styles/shell.css";

const VIEW_IDS = content.nav.map((item) => item.id);
const SEEN_KEY = "boot-seen";
const CV_NAME = "CV-Jhefferson-Guerrero.pdf";

// El arranque solo se muestra en la primera visita de la sesión y se omite
// si la persona prefiere movimiento reducido.
const shouldShowLoader = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
};

// La vista activa vive en el hash (#proyectos), así que los enlaces y el botón atrás funcionan.
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
  const [view, setView] = useState(readHash);
  const [project, setProject] = useState(0);

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
  const { run } = terminal;

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
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Sin almacenamiento: el arranque simplemente se repite en la próxima visita.
    }
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
          <Titlebar view={view} />

          <div className="shell">
            <Sidebar view={view} />

            <main id="main" className="workspace">
              <Hero active={view === "inicio"} onRun={run} navigate={navigate} />
              <About active={view === "about"} />
              <Skills active={view === "skills"} />
              <Projects active={view === "proyectos"} selected={project} onSelect={setProject} />
              <Services active={view === "servicios"} />
              <Contact active={view === "contacto"} onRun={run} />
              <Console api={terminal} />
            </main>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
