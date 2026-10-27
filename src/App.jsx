import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import StatusBar from "./components/StatusBar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Services from "./components/Services";
import Contact from "./components/Contact";
import LoadingScreen from "./components/LoadingScreen";
import { useActiveSection } from "./hooks/useActiveSection";
import { content } from "./data/content";
import "./styles/App.css";

const SECTION_IDS = content.nav.map((item) => item.id);
const SEEN_KEY = "boot-seen";

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

function App() {
  const [showLoader] = useState(shouldShowLoader);
  const [isLoading, setIsLoading] = useState(showLoader);
  const active = useActiveSection(SECTION_IDS, !isLoading);

  // Las secciones no existen hasta que termina el arranque: si la URL trae un
  // hash (/#proyectos), el navegador no pudo desplazarse y lo hacemos aquí.
  useEffect(() => {
    if (isLoading) return;
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, [isLoading]);

  const handleLoadingComplete = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Sin almacenamiento: el arranque simplemente se repite en la próxima visita.
    }
    setIsLoading(false);
  }, []);

  // El tema oscuro se fija en index.html (data-theme="dark"), así que el
  // arranque y la página siempre empiezan en modo oscuro.
  return (
    <>
      {showLoader && (
        <div className={`loader ${!isLoading ? "is-done" : ""}`}>
          <LoadingScreen onComplete={handleLoadingComplete} />
        </div>
      )}

      {!isLoading && (
        <>
          <a className="skip-link" href="#main">Saltar al contenido</a>
          <Navbar active={active} />

          <main id="main">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Services />
            <Contact />
          </main>

          <StatusBar active={active} />
        </>
      )}
    </>
  );
}

export default App;
