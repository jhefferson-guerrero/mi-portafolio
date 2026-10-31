# Propuestas de mascota

Imágenes y scripts de las propuestas de diseño de la mascota. **No forman parte del sitio** (no se publican);
sirven para decidir y para volver a generar las imágenes. Se pueden borrar cuando ya no hagan falta.

**Nombres:** en las hojas y los scripts las mascotas se llaman por su clave interna (`campana`, `encapuchado`, `glitch`). En el sitio se ven como **bit**, **nox** y **bug** (campo `label` en `src/lib/creature.js`).

## Imágenes

| Archivo | Qué muestra |
| --- | --- |
| `campana-glitch-opciones.png` | Seis opciones de campana con glitch, **descartadas**: el sitio usa la C de `mascota-hacker.png`. |
| `glitch-estados.png` | La mascota **glitch** del sitio con sus diez estados, todos con cara propia (no se parecen a los de la campana). |
| `glitch-propuestas.png` | Variantes que se probaron para curioso, mareado y consola. En el sitio quedó: mareado = datos corruptos (A) y consola = lluvia de código (C). Curioso se rehízo después (ver `glitch-curioso.png`). |
| `glitch-contento.png` | Alternativas para la cara "contento" del glitch. En el sitio quedó la B (arcos con eco). |
| `glitch-curioso.png` | Alternativas para la cara "curioso" del glitch. En el sitio quedó la A (un ojo se abre). |
| `encapuchado-estados.png` | El **encapuchado** del sitio (tamaño M, 22×19) con sus diez estados. |
| `encapuchado-consola.png` | Alternativas para la cara "consola" del encapuchado (al escribir un comando). En el sitio quedó la F (circuitos en verde + texto en el visor). |
| `encapuchado-tamano.png` | Comparación de tamaños: el encapuchado original (24×21), las versiones M y S, la campana y el glitch. En el sitio quedó la M. |
| `circuitos-v3-estados.png` | El encapuchado de circuitos en su tamaño **anterior** (24×21), con sus diez estados. Solo de referencia. |
| `circuitos-v3-contexto.png` | El encapuchado anterior (24×21) en la escena de Inicio, en el menú y en la sección cerrada. Solo de referencia. |
| `encapuchado-estilos.png` | Seis variantes de estilo del encapuchado (auriculares, bufanda, circuitos, holograma...). |
| `mascota-hacker.png` | Los tres primeros conceptos de "hacker de terminal" (encapuchado, cabeza de monitor, campana con glitch). **La C es la mascota `glitch` del sitio.** |
| `mascota-siniestra.png` | Cuatro caras siniestras para la campana original. |

## Cómo volver a generarlas

Cada script escribe un HTML; para convertirlo en PNG se abre en el navegador o se captura con Chrome sin ventana:

```bash
node design/mascotas/glitch.mjs salida.html
chrome --headless=new --hide-scrollbars --screenshot=salida.png --window-size=1000,560 file:///ruta/a/salida.html
```

- `glitch.mjs <salida.html>`: las seis opciones de campana con glitch (descartadas). Lee el sprite de `src/lib/creature.js`.
- `glitch-estados.mjs <estados.html>`: los estados de la mascota glitch, dibujados con el sprite real de `src/lib/creature.js`.
- `glitch-propuestas.mjs <salida.html>`: las propuestas de caras del glitch (curioso, mareado, consola).
- `glitch-contento.mjs <salida.html>`, `glitch-curioso.mjs <salida.html>`: las alternativas de las caras "contento" y "curioso" del glitch.
- `encapuchado-estados.mjs <estados.html>`: los estados del encapuchado, dibujados con el sprite real de `src/lib/creature.js`.
- `encapuchado-consola.mjs <salida.html>`: las alternativas de la cara "consola" del encapuchado.
- `encapuchado-tamano.mjs <salida.html>`: compara el tamaño del encapuchado con las otras mascotas y con dos versiones reducidas.
- `hacker.mjs <salida.html>`: los tres conceptos de hacker; el panel C es el modelo de la mascota `glitch`. Lee el sprite de `campana`.
- `circuitos.mjs <estados.html> <contexto.html>`: los estados y el contexto del encapuchado. Con `FEET=tiny` añade dos pies diminutos.
- `encapuchado.mjs <estilos.html> <caras.html>`, `hacker.mjs <salida.html>`, `siniestro.mjs <salida.html>`: las otras hojas.

Los colores de los scripts son los del sitio (`--px-*`, `--accent`, `--ok` en `src/styles/shell.css`).

## Cómo pasar una propuesta al sitio

Las mascotas del sitio se definen en `src/lib/creature.js` (objeto `DEFINITIONS`): un sprite por filas, los ojos de cada
cara, la cara con la que reacciona a muchos clics seguidos, el recorte del rostro para el menú y la forma del aura.
Para sumar una basta con agregar su definición ahí; el selector del arranque y el comando `mascota` la listan solos.
