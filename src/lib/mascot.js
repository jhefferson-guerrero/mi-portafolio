import { useSyncExternalStore } from "react";
import { MASCOTS } from "./creature";
import { content } from "../data/content";

// Mascota en uso. Empieza con la de content.meta.mascot, salvo que la persona ya haya elegido otra con
// el comando "mascota": esa elección se recuerda en el navegador (sin él, simplemente no se recuerda).
const KEY = "jg-mascota";

const readSaved = () => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved && saved in MASCOTS) return saved;
  } catch {
    // sin almacenamiento: se usa la mascota por defecto
  }
  return null;
};

const fallback = content.meta.mascot in MASCOTS ? content.meta.mascot : "campana";
let current = readSaved() ?? fallback;
const listeners = new Set();

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Lo que se muestra y se escribe es el nombre visible (label: bit, nox, bug); por dentro la mascota se
// identifica por su clave (campana, encapuchado, glitch), que es la que se guarda y la que usan los estilos.
export const mascotNames = () => Object.values(MASCOTS).map((mascot) => mascot.label);

// Busca por el comienzo del nombre visible o de la clave (así "encapuchado" sigue funcionando en el comando).
export const findMascot = (text) =>
  Object.values(MASCOTS).find((mascot) => mascot.label.startsWith(text) || mascot.name.startsWith(text))?.name;

export const getMascotName = () => current;

export const setMascot = (name) => {
  if (!(name in MASCOTS) || name === current) return;
  current = name;
  try {
    localStorage.setItem(KEY, name);
  } catch {
    // sin almacenamiento: el cambio vale solo para esta visita
  }
  listeners.forEach((listener) => listener());
};

// La definición de la mascota en uso (sprite, ojos, recorte del menú...). Se actualiza al cambiarla.
export const useMascot = () => MASCOTS[useSyncExternalStore(subscribe, getMascotName)];
