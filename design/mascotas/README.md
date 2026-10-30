# Propuestas de mascota

Imágenes y scripts de las propuestas de diseño de la mascota. **No forman parte del sitio** (no se publican);
sirven para decidir y para volver a generar las imágenes. Se pueden borrar cuando ya no hagan falta.

## Imágenes

| Archivo | Qué muestra |
| --- | --- |
| `campana-glitch-opciones.png` | **Seis opciones de campana con glitch** (la que está en el sitio es la 1). Pendiente: decidir cuál se queda. |
| `circuitos-v3-estados.png` | El **encapuchado de circuitos** (el que está en el sitio) con sus diez estados. |
| `circuitos-v3-contexto.png` | El encapuchado en la escena de Inicio, en el menú y en la sección cerrada. |
| `encapuchado-estilos.png` | Seis variantes de estilo del encapuchado (auriculares, bufanda, circuitos, holograma...). |
| `mascota-hacker.png` | Los tres primeros conceptos de "hacker de terminal" (encapuchado, cabeza de monitor, campana con glitch). |
| `mascota-siniestra.png` | Cuatro caras siniestras para la campana original. |

## Cómo volver a generarlas

Cada script escribe un HTML; para convertirlo en PNG se abre en el navegador o se captura con Chrome sin ventana:

```bash
node design/mascotas/glitch.mjs salida.html
chrome --headless=new --hide-scrollbars --screenshot=salida.png --window-size=1000,560 file:///ruta/a/salida.html
```

- `glitch.mjs <salida.html>`: las seis opciones de campana con glitch. Lee el sprite de `src/lib/creature.js`.
- `circuitos.mjs <estados.html> <contexto.html>`: los estados y el contexto del encapuchado. Con `FEET=tiny` añade dos pies diminutos.
- `encapuchado.mjs <estilos.html> <caras.html>`, `hacker.mjs <salida.html>`, `siniestro.mjs <salida.html>`: las otras hojas.

Los colores de los scripts son los del sitio (`--px-*`, `--accent`, `--ok` en `src/styles/shell.css`).

## Cómo pasar una propuesta al sitio

Las mascotas del sitio se definen en `src/lib/creature.js` (objeto `DEFINITIONS`): un sprite por filas, los ojos de cada
cara, la cara con la que reacciona a muchos clics seguidos, el recorte del rostro para el menú y la forma del aura.
Para sumar una basta con agregar su definición ahí; el selector del arranque y el comando `mascota` la listan solos.
