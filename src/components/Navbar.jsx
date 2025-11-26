import React, { useState, useEffect } from "react";
import { Home, User, FolderOpen, Wrench } from "lucide-react";
import "../styles/App.css";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("inicio");

  const sections = [
    { id: "inicio", label: "Inicio", icon: Home },
    { id: "about", label: "Acerca", icon: User },
    { id: "proyectos", label: "Proyectos", icon: FolderOpen },
    { id: "servicios", label: "Servicios", icon: Wrench },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 400;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="navbar-container">
      {sections.map((item) => (
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
    </nav>
  );
};

export default Navbar;
