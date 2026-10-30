import { createContext } from "react";

// Acción que cierra el panel abierto (vuelve a inicio). Null mientras no haya nada que cerrar.
export const PaneCloseContext = createContext(null);

// Vista "sin nada abierto": el espacio de trabajo queda vacío, solo con la consola y el menú.
export const CLOSED_VIEW = "cerrado";
