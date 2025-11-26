import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Services from "./components/Services";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import "./styles/App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

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
