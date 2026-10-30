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

export const mascotNames = () => Object.keys(MASCOTS);

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
