import { useState, useEffect, useRef } from "react";

export const useScrollReveal = (customThreshold = null) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Si no se pasa un threshold, calcula dinámicamente si es mobile o escritorio.
    const isMobile = window.innerWidth <= 768;
    const thresholdValue = customThreshold !== null ? customThreshold : (isMobile ? 0.2 : 0.4);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Desconectar el observador después de que se revela por primera vez (optimización).
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: thresholdValue,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [customThreshold]);

  return [ref, isVisible];
};
