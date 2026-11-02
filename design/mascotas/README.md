# Propuestas de mascota

Hojas de referencia de las mascotas del sitio. **No forman parte del sitio** (no se publican); sirven para ver las
mascotas con todos sus estados y para volver a generar las imágenes. Se pueden borrar cuando ya no hagan falta.

Las hojas de las propuestas ya decididas (auras, caras de consola, variantes de glitch y de encapuchado, tamaños,
conceptos de hacker) se borraron al elegir. Lo elegido está en `src/lib/creature.js`; si hace falta rehacer una
propuesta, se parte de los sprites de ese archivo.

**Nombres:** en las hojas y los scripts las mascotas se llaman por su clave interna (`campana`, `encapuchado`, `glitch`). En el sitio se ven como **bit**, **nox** y **bug** (campo `label` en `src/lib/creature.js`).

## Imágenes

| Archivo | Qué muestra |
| --- | --- |
| `glitch-estados.png` | La mascota **glitch** (bug) del sitio con sus diez estados, todos con cara propia. |
| `encapuchado-estados.png` | El **encapuchado** (nox) del sitio (tamaño M, 22×19) con sus diez estados. |

## Cómo volver a generarlas

Cada script escribe un HTML; para convertirlo en PNG se abre en el navegador o se captura con Chrome sin ventana:

```bash
node design/mascotas/glitch-estados.mjs salida.html
chrome --headless=new --hide-scrollbars --screenshot=salida.png --window-size=1000,560 file:///ruta/a/salida.html
```

- `glitch-estados.mjs <estados.html>`: los estados de la mascota glitch, dibujados con el sprite real de `src/lib/creature.js`.
- `encapuchado-estados.mjs <estados.html>`: los estados del encapuchado, dibujados con el sprite real de `src/lib/creature.js`.

Los colores de los scripts son los del sitio (`--px-*`, `--accent`, `--ok` en `src/styles/shell.css`).

## Cómo pasar una propuesta al sitio

Las mascotas del sitio se definen en `src/lib/creature.js` (objeto `DEFINITIONS`): un sprite por filas, los ojos de cada
cara, la cara con la que reacciona a muchos clics seguidos, el recorte del rostro para el menú, la forma del aura, la
decoración de la pared y las frases. Para sumar una basta con agregar su definición ahí; el selector del arranque y el
comando `mascota` la listan solos.
