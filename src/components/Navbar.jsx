import React, { useState, useEffect } from "react";
import { Home, User, FolderOpen, Wrench, Moon, Sun } from "lucide-react";
import "../styles/App.css";

const sectionsList = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "about", label: "Acerca", icon: User },
  { id: "proyectos", label: "Proyectos", icon: FolderOpen },
  { id: "servicios", label: "Servicios", icon: Wrench },
];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("inicio");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    // Usando IntersectionObserver para evitar calcular el scroll en cada pixel (Performance Fix)
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -70% 0px", // Detecta cuando la sección entra en el tercio superior
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sectionsList.forEach(section => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="navbar-container">
      {/* Botones de Navegación */}
      {sectionsList.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`nav-item ${activeSection === item.id ? "active" : ""}`}
          onClick={() => setActiveSection(item.id)}
        >
          <item.icon size={18} />
          <span>{item.label}</span>
        </a>
      ))}

      <div
        style={{
          width: "1px",
          height: "40px",
          background: "var(--primary)",
          margin: "0 5px",
          opacity: 0.2,
        }}
      />

      <button
        onClick={toggleTheme}
        className="nav-item theme-toggle"
        style={{
          background: "transparent",
          border: "none",
          padding: "0.7rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Cambiar tema"
      >
        {theme === "light" ? (
          <Moon size={21} color="var(--color-primary)" />
        ) : (
          <Sun size={21} color="#fff" />
        )}
      </button>
    </nav>
  );
};

export default Navbar;
