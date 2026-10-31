# Notas de trabajo del portafolio

Resumen del estado del proyecto y de lo que se hizo, para retomarlo desde otro equipo. Última actualización: 31/10/2026.

**Si abres esto con un asistente de IA en otro equipo:** pídele que lea este archivo y `design/mascotas/README.md` antes de tocar nada.

## Qué es

Portafolio de **Jhefferson Guerrero** (Lima; egresado de Ingeniería de Software en la UTP; practicante de TI en CBS hasta nov 2026; busca su
primer empleo como desarrollador frontend). Sitio en producción: https://jhefferson-guerrero.vercel.app/ — repositorio `jhefferson-guerrero/mi-portafolio`, rama única `main`.

Interfaz tipo **shell/terminal**: barra lateral con menú, paneles por sección, una consola arriba donde se escriben comandos y un arranque tipo BIOS.
React 19 + Vite 7, `lucide-react`, un solo CSS (`src/styles/shell.css`). Tipografías propias (`@fontsource`): Space Grotesk y IBM Plex Mono.

```bash
npm install
npm run dev      # desarrollo
npm run lint
npm run build && npm run preview
```

## Convenciones del proyecto

- **Commits en español**, con el autor `Jhefferson Guerrero Torres <jheffer17x@gmail.com>`. Trabajar solo en `main`.
- No versionar carpetas de herramientas locales (`.agents/`, otras que empiecen por punto, `skills-lock.json`, etc.): añadirlas a `.git/info/exclude` si aparecen.
- Diseño: negro + lila (`--accent`), **sin degradados genéricos ni sombras con brillo**, siempre en modo oscuro.
- Cada sección debe **caber en una vista sin scroll** en laptops de poca altura (1366×650, 1280×600...). Excepciones aceptadas: *Sobre mí* (línea de tiempo). *Proyectos* nunca debe tener scroll.
- Se verifica con tamaños 1366×650, 1338×575, 1280×720, 1093×600, 1920×1080 y 2560×1440, y móvil 390×844 y 360×640.
- **Alturas con `svh`, no `dvh`**: en el celular la barra de la URL de Chrome aparece y desaparece al hacer scroll y `dvh` cambia con ella, lo que movía todo el contenido. `svh` (altura con la barra visible) no cambia; en escritorio ambas son iguales.
- **Tipografía en el celular** (`@media (max-width: 600px)` en `shell.css`): los tamaños de escritorio salen de la altura de la pantalla y en un móvil siempre llegan a su tope, así que ahí se fijan más chicos (texto de lectura ~12,5-13 px, h1 ~31 px). No bajar de ~12 px el texto de lectura.
- En el celular no se muestra el recuadro azul al tocar (`-webkit-tap-highlight-color`) y los botones usan `touch-action: manipulation` (los toques rápidos a la mascota no hacen zoom).

## Estado actual (lo hecho)

**Contenido y secciones**: inicio, sobre mí (línea de tiempo en zigzag, CV nuevo con el proyecto de CBS), tecnologías (16 tecnologías en 4 filas, cada una con su barra de nivel; el stack principal va destacado), proyectos (5, imagen completa a la izquierda; cada uno con descripción, **dos viñetas** y **máximo cuatro píldoras**), servicios, intereses (14 etiquetas), contacto (cuatro canales, escala con la altura). Todo el texto vive en `src/data/content.js`.

**Perfil (menú lateral)**: la foto va en dos tonos, negro y lila (filtro SVG `#duotone-lilac` en `Sidebar.jsx`), y recupera su color al pasar el mouse. Se probó una versión pixelada con tramado y se descartó (el flash de la foto tapa la cara).

**Consola** (`src/lib/commands.js`): `help`, `ls`, `cd`, `open`, `whoami`, `stack`, `languages`, `hobbies`, `projects`, `email`, `cv`, `github`, `linkedin`, `neofetch`, `history`, `date`, `clear`, **`kill`/`close`/`cerrar`** (cierra la sección) y **`mascota [nombre]`** (cambia de mascota). Atajos: `/` enfoca la consola, `1`-`7` cambian de sección, `Esc` cierra la sección abierta.

**Cerrar secciones**: cada panel tiene una X (y `Esc`). Al cerrar queda un espacio vacío con la mascota dormida y un botón "abrir inicio".

**Arranque (preloader)**: dura como mínimo ~8,5 s y **no se puede saltar**. Tras la ficha del sistema (~6 s) se detiene en la **elección de mascota** (tres tarjetas, clic o tecla 1-3): hasta que la persona elige no sigue, y la barra de carga corre después con la mascota elegida. Espera las tipografías y la foto del perfil (máximo 20 s, sin contar la espera de la elección) y después precarga las capturas de los proyectos una por una (no lo hace con "ahorrar datos"). Con movimiento reducido salta a la elección y luego a la carga final. Se amplía en pantallas grandes igual que la interfaz.

**Rendimiento**: tipografías propias (sin Google Fonts), precarga de recursos, `vercel.json` con caché de un día para capturas y CV, y el cálculo de la posición del cursor de la mascota va una vez por cuadro.

**Inicio**: sin caja alrededor de la mascota; el rol es una línea de terminal (`> Frontend Developer`); el cuarto de la mascota queda centrado verticalmente respecto al texto, que tiene más aire entre líneas.

**Mascotas** — tres, definidas en `src/lib/creature.js`. Cada una tiene una **clave interna** (la que usan los estilos, `localStorage` y los scripts de `design/mascotas`) y un **nombre visible** (`label`), que es el que se ve en el selector y el que se escribe en el comando `mascota` (el comando también acepta la clave):

| Clave → nombre | Descripción | Reacción a 5 clics seguidos |
| --- | --- | --- |
| `campana` → **bit** | La original: criatura con visor y ojos blancos. | se marea (ojos en X) |
| `encapuchado` → **nox** | Figura con capucha, circuitos lila y ojos lila en escalón (el "ceño" es su reposo). Borde inferior con muescas hace de pies. Mide 22×19 px (antes 24×21: se sentía más grande que las otras dos); hoja de estados en `design/mascotas/encapuchado-estados.png`. | se enfurece (ceño más grueso) |
| `glitch` → **bug** | La propuesta **C** de `design/mascotas/mascota-hacker.png`: la campana con el marco duplicado (fantasma lila y verde que titilan), tres filas rasgadas, ojos verdes en escalón, prompt verde en el pecho y líneas de exploración. Reposo, parpadeo y mirada a los lados son los de la propuesta; el resto de caras (curioso, sorprendido, mareado, contento, dormido, consola) son propias, con cuerpo más rasgado en el mareado (`faceSprites` en `creature.js`). Hoja: `design/mascotas/glitch-estados.png`. | se marea |

- Mascota con la que empieza el sitio: `meta.mascot` en `src/data/content.js` (ahora `"encapuchado"`). Quien visita la elige en el arranque (obligatorio, en cada carga) o la cambia con el comando `mascota bit|nox|bug`; se recuerda en su navegador.
- Caras: reposo, curioso (cursor cerca), sorprendido, dormido (tras 25 s sin actividad), contento (sobre Contactar/CV), mareado o furioso (5 clics), y **consola** (al escribir un comando; solo la tiene el encapuchado). Los ojos siguen el cursor.
- Una miniatura de la **cabeza** de la mascota (recorte `nav.box` en `creature.js`, sin el cuerpo) marca la sección activa en el menú (`src/components/NavMascot.jsx`); se oculta en pantallas angostas y en móvil.
- El estado de la mascota elegida vive en `src/lib/mascot.js` (`useMascot`, `setMascot`).

## Pendiente / decisiones abiertas

1. **Elegir la mascota por defecto** (`encapuchado`, `campana` o `glitch`; solo se usa si no hay una guardada, porque el arranque obliga a elegir).
2. ~~Elegir la versión de la campana con glitch.~~ Resuelto: el sitio usa la **C** de `design/mascotas/mascota-hacker.png` (`GLITCH_SPRITE` en `src/lib/creature.js`). Las seis opciones de `campana-glitch-opciones.png` quedan descartadas (la 1 se parecía pero copiaba el cuerpo entero, no solo el marco).
3. Revisar en producción (Vercel) que el arranque, el selector y las fuentes propias se vean bien, y que `vercel.json` no cambie la caché de los archivos con hash.
4. Ideas sin hacer: pies diminutos para el encapuchado (hay una propuesta con `FEET=tiny` en `design/mascotas/circuitos.mjs`), cara "consola" también para la campana y el glitch, y una variante con holograma o auriculares del encapuchado (`design/mascotas/encapuchado-estilos.png`).
5. Dudas de diseño que quedaron abiertas: si en Inicio conviene que el cuarto sea más grande ahora que el encapuchado ocupa más alto.
6. La foto del perfil es un selfie con flash frente al espejo: una foto de frente, sin flash, mejoraría mucho la primera impresión.
7. Desbordes que ya existían y no se tocaron: *Sobre mí* hace scroll por diseño; *Servicios* desborda unos 11 px a 1280×640.
