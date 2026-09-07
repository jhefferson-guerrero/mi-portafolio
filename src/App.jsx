import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Services from "./components/Services";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import "./styles/App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar el tema aquí arriba asegura que el LoadingScreen también lo use
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <>
      {/* PANTALLA DE CARGA */}
      <div className={`loading-wrapper ${!isLoading ? "loaded" : ""}`}>
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      </div>

      {/* CONTENIDO */}
      {!isLoading && (
        <>
          <Navbar />

          <main className="App animate-fade-in">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Services />
            <Footer />
          </main>
        </>
      )}
    </>
  );
}

export default App;
