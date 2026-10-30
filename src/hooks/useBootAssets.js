import { useEffect, useState } from "react";
import { content } from "../data/content";

// Tipografías de la interfaz. Se piden con texto en español para que baje el subconjunto latino.
const FONTS = [
  '400 1rem "IBM Plex Mono"',
  '500 1rem "IBM Plex Mono"',
  '600 1rem "IBM Plex Mono"',
  '500 1rem "Space Grotesk"',
  '600 1rem "Space Grotesk"',
  '700 1rem "Space Grotesk"',
];
const SAMPLE = "áéíóúñ¿¡ÁÉÍÓÚÑ·…—";

// Un recurso que falla no debe frenar el arranque: se ignora el error y se sigue.
const loadFonts = () => Promise.all(FONTS.map((font) => document.fonts.load(font, SAMPLE).catch(() => [])));

const loadImage = (src) => {
  const image = new Image();
  image.src = src;
  return image.decode().catch(() => {});
};

const saveData = () => navigator.connection?.saveData === true;

// Prepara lo que el visitante ve nada más entrar y calienta lo demás:
//  1. Esenciales (el arranque espera por ellos): las tipografías y la foto del perfil.
//  2. Resto: las capturas de los proyectos, una por una y solo cuando lo esencial ya llegó, para no
//     competir con él. Con "ahorrar datos" activo no se piden: se cargan al abrir la sección.
// Devuelve true cuando lo esencial está listo.
export const useBootAssets = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await Promise.all([loadFonts(), loadImage(content.meta.photo)]);
      if (cancelled) return;
      setReady(true);

      if (saveData()) return;
      for (const project of content.projects) {
        if (cancelled) return;
        await loadImage(project.image);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
};
