import { useState, useEffect, useRef } from "react";

// Marca un elemento como visible la primera vez que entra al viewport.
// Un umbral bajo evita que bloques muy altos (listas en móvil) nunca se revelen.
export const useScrollReveal = ({ threshold = 0.15, rootMargin = "0px 0px -6% 0px" } = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible];
};
