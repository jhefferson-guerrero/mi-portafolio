# Notas de trabajo del portafolio

Resumen del estado del proyecto y de lo que se hizo, para retomarlo desde otro equipo. Última actualización: 30/10/2026.

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
- Se verifica con tamaños 1366×650, 1338×575, 1280×720, 1093×600, 1920×1080 y 2560×1440, y móvil 390×844.

## Estado actual (lo hecho)

**Contenido y secciones**: inicio, sobre mí (línea de tiempo en zigzag, CV nuevo con el proyecto de CBS), tecnologías (16 tecnologías en 4 filas, cada una con su barra de nivel; el stack principal va destacado), proyectos (5, imagen completa a la izquierda), servicios, intereses (14 etiquetas), contacto (cuatro canales, escala con la altura). Todo el texto vive en `src/data/content.js`.

**Consola** (`src/lib/commands.js`): `help`, `ls`, `cd`, `open`, `whoami`, `stack`, `languages`, `hobbies`, `projects`, `email`, `cv`, `github`, `linkedin`, `neofetch`, `history`, `date`, `clear`, **`kill`/`close`/`cerrar`** (cierra la sección) y **`mascota [nombre]`** (cambia de mascota). Atajos: `/` enfoca la consola, `1`-`7` cambian de sección, `Esc` cierra la sección abierta.

**Cerrar secciones**: cada panel tiene una X (y `Esc`). Al cerrar queda un espacio vacío con la mascota dormida y un botón "abrir inicio".

**Arranque (preloader)**: dura como mínimo ~8,5 s y **no se puede saltar**. Espera las tipografías y la foto del perfil (máximo 20 s) y después precarga las capturas de los proyectos una por una (no lo hace con "ahorrar datos"). Con movimiento reducido muestra solo la pantalla final. Se amplía en pantallas grandes igual que la interfaz. Abajo a la derecha tiene el **selector de mascota**.

**Rendimiento**: tipografías propias (sin Google Fonts), precarga de recursos, `vercel.json` con caché de un día para capturas y CV, y el cálculo de la posición del cursor de la mascota va una vez por cuadro.

**Inicio**: sin caja alrededor de la mascota; el rol es una línea de terminal (`> Frontend Developer`); el suelo del cuarto queda alineado con la base de los botones.

**Mascotas** — tres, definidas en `src/lib/creature.js`:

| Nombre | Descripción | Reacción a 5 clics seguidos |
| --- | --- | --- |
| `campana` | La original: criatura con visor y ojos blancos. | se marea (ojos en X) |
| `encapuchado` | Figura con capucha, circuitos lila y ojos lila en escalón (el "ceño" es su reposo). Borde inferior con muescas hace de pies. | se enfurece (ceño más grueso) |
| `glitch` | La campana con una copia fantasma lila y otra verde que titilan, y ojos verdes en escalón. | se marea |

- Mascota con la que empieza el sitio: `meta.mascot` en `src/data/content.js` (ahora `"encapuchado"`). Quien visita puede cambiarla en el selector del arranque o con el comando `mascota`; se recuerda en su navegador.
- Caras: reposo, curioso (cursor cerca), sorprendido, dormido (tras 25 s sin actividad), contento (sobre Contactar/CV), mareado o furioso (5 clics), y **consola** (al escribir un comando; solo la tiene el encapuchado). Los ojos siguen el cursor.
- Una miniatura del rostro de la mascota marca la sección activa en el menú (`src/components/NavMascot.jsx`); se oculta en pantallas angostas y en móvil.
- El estado de la mascota elegida vive en `src/lib/mascot.js` (`useMascot`, `setMascot`).

## Pendiente / decisiones abiertas

1. **Elegir la mascota por defecto** (`encapuchado`, `campana` o `glitch`).
2. **Elegir la versión de la campana con glitch.** Hay seis propuestas en `design/mascotas/campana-glitch-opciones.png`; el sitio usa la **1 (separación de color)**. Si se prefiere otra, hay que reflejarla en `GLITCH_SPRITE` de `src/lib/creature.js`.
3. Revisar en producción (Vercel) que el arranque, el selector y las fuentes propias se vean bien, y que `vercel.json` no cambie la caché de los archivos con hash.
4. Ideas sin hacer: pies diminutos para el encapuchado (hay una propuesta con `FEET=tiny` en `design/mascotas/circuitos.mjs`), cara "consola" también para la campana y el glitch, y una variante con holograma o auriculares del encapuchado (`design/mascotas/encapuchado-estilos.png`).
5. Dudas de diseño que quedaron abiertas: si el rostro en miniatura del menú se ve bien con las tres mascotas, y si en Inicio conviene que el cuarto sea más grande ahora que el encapuchado ocupa más alto.
