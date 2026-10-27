import { useState, useEffect } from "react";

// Devuelve el id de la sección que cruza la franja central de la pantalla.
// `ids` debe ser una referencia estable (constante de módulo).
export const useActiveSection = (ids, enabled = true) => {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    // La última sección puede ser demasiado corta para alcanzar la franja central.
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) setActive(ids[ids.length - 1]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids, enabled]);

  return active;
};
