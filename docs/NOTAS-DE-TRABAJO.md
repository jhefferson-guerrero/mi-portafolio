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
- **Menú en el celular** (`max-width: 600px`): cabe entero; solo la sección activa muestra su nombre y las demás son íconos (a ≤380 px van un poco más juntos). La activa se centra sola si hace falta deslizar.
- **Salida de la consola en el celular**: el panel flotante se retira solo (de ~3,4 s a 8 s según su largo; se pausa al tocarlo) y desaparece al cambiar de sección con el menú; si el cambio lo hizo un comando (`cd`, `kill`) se queda unos segundos.
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
| `glitch` → **bug** | Salió de una propuesta de "hacker de terminal": la campana con el marco duplicado (fantasma lila y verde que titilan), tres filas rasgadas, ojos verdes en escalón, prompt verde en el pecho y líneas de exploración. Reposo, parpadeo y mirada a los lados son los de la propuesta; el resto de caras (curioso, sorprendido, mareado, contento, dormido, consola) son propias, con cuerpo más rasgado en el mareado (`faceSprites` en `creature.js`). Hoja: `design/mascotas/glitch-estados.png`. | se marea |

- Mascota con la que empieza el sitio: `meta.mascot` en `src/data/content.js` (ahora `"encapuchado"`). Quien visita la elige en el arranque (obligatorio, en cada carga) o la cambia con el comando `mascota bit|nox|bug`; se recuerda en su navegador.
- **Destellos de los clics**: `MascotCard` guarda en `flares` los clics recientes y retira cada uno a los 1,8 s. No hay que dejarlos dibujados: el panel de Inicio se oculta al cambiar de sección y, al volver, todas las animaciones CSS que sigan en el DOM se reinician, así que los destellos viejos se repetían de golpe, como si se hubiera presionado la mascota varias veces.
- **Animación del clic**: cada mascota puede tener la suya (la escena lleva la clase `bot-<nombre>` y `is-hop` mientras dura, 0,45 s). **bit** hace una campanada (`ring` en `shell.css`): se balancea ±3° colgada de su parte de arriba, por pasos. **nox** se desliza (`dash`): se corre 3 píxeles a un lado, alternando izquierda y derecha (el lado llega en la variable `--dash`, que pone `MascotCard` en `hop` como 1 o -1), vuelve por pasos y deja en su sitio una copia tenue que se apaga (`.sc-ghost`, un `<use>` de su cuerpo; se activa con `trail: true` en `creature.js`). **bug** hace una falla (`tear` en `creature.js`: las filas por donde se corta, 6 y 10): el cuerpo se parte en tres franjas (cabeza, visor con los ojos, falda) que se corren 3/-3/2 píxeles, se alinean por pasos y titilan; son tres `<use>` del cuerpo recortados con `clipPath` (`.sc-tear`), y al 60 % de la animación vuelve el cuerpo entero (si no, la unión entre franjas deja una línea fina). Las animaciones de las franjas van dentro de `.is-hop`: declaradas siempre no se reinician al mostrarse. **Reglas para estas animaciones**: píxeles enteros, 0,45 s en total y que el cuerpo original quede visible al terminar.
- Caras: reposo, curioso (cursor cerca), sorprendido, dormido (tras 25 s sin actividad), contento (sobre Contactar/CV), mareado o furioso (5 clics), y **consola** (al escribir un comando; la tienen las tres: bit un prompt `>_` verde con el cursor lila, nox texto en el visor con los circuitos encendidos y bug lluvia de código). Los ojos siguen el cursor, salvo en la cara de consola de bit, para que su texto no pise el marco del visor.
- Una miniatura de la **cabeza** de la mascota (recorte `nav.box` en `creature.js`, sin el cuerpo) marca la sección activa en el menú (`src/components/NavMascot.jsx`); se oculta en pantallas angostas y en móvil.
- **Intereses**: las categorías (idiomas aparte, y los intereses por filas) se muestran siempre, también en pantallas bajas (1280×560 cabe sin desbordar). Antes, con la caja de 300 px de alto o menos, se ocultaban los títulos y las etiquetas fluían juntas; se quitó a pedido.
- **Reposo por mascota**: cada una se mueve a su manera aunque no se le haga clic (reglas `.bot-<nombre> .scene-bot` en `shell.css`, antes de las caras y los clics, que mandan sobre ellas). **bit** el vaivén de 1 px cada 2,4 s y, con el cursor cerca o encima, un saltito de 2 px cada 1,2 s (`bob-happy`); **nox** casi quieto, un vaivén de 1 px cada 5,2 s que no se acelera con el cursor (solo lo siguen los ojos); **bug** sin vaivén: quieto y, a ratos y sin ritmo, un temblor de 1 px (`glitch-idle`, ciclo de 7 s; con el cursor cerca, de 2,6 s). Había una regla `.mascot-btn:hover .scene-bot` que aceleraba el vaivén de las tres al pasar el cursor; se quitó para que no se vuelvan a igualar.
- **Pared y frases por mascota**: la sala (racks, escritorio, monitor) es común, pero las dos piezas de pared y las frases son de cada mascota. `wall` en `creature.js` son dos dibujos de 9×7 píxeles, quietos a propósito, que reemplazan a las ventanas que había (las estrellas titilantes sumaban ruido a las auras): **bit** una taza de café en una repisa y un póster de un mando; **nox** un cartel con el prompt `>_` y un candado; **bug** un bicho verde (su nombre) y una carita triste, como la de una pantalla de error. Cada pieza debe decir algo con solo mirarla: una pantalla de estática y un cartel de advertencia rojo se probaron y se descartaron (no decían nada y el rojo desentonaba). Cada letra es un color (`.sc-art--<letra>` en `shell.css`). `lines` son las frases del globo (`say`; la primera es el saludo y cada clic pasa a la siguiente, empezando por el saludo al cambiar de mascota), lo que dice al tocarla sin parar (`upset`), al despertarla (`wake`) y dormida (`sleep`); unos 30 caracteres como máximo. Voces: bit cálida y cercana (la única con mayúscula inicial, para que se lea como alguien que te habla), nox seca y de terminal (minúscula; las pausas van con «…», porque un punto seguido de minúscula parece una errata) y bug de errores y bromas de programador (minúscula).
- **Aura**: cada mascota define la suya en `aura` (`creature.js`). **bit** usa `glint: true`: brillos, 6 estrellitas en cruz que aparecen de golpe, se encogen a un punto breve y se apagan en sitios repartidos alrededor de la cabeza (`glintsOf` y `.sc-shine`), y al presionar salen 3 más por clic. Se quitó el polvo flotante de la escena (`sc-dust`), que sumaba ruido a las auras. El arco de seis puntos de antes (`auraOf`) queda como aura por defecto para una mascota nueva que no defina la suya. **bug** usa `noise: true`: estática, 28 píxeles que titilan en su sitio en una franja de 1 a 5 píxeles alrededor del cuerpo (`noiseOf` y `.sc-noise`), y al presionar salen 10 más por clic. Se probaron y descartaron los cortes desplazados. **nox** usa `ash: true`: 14 píxeles que se desprenden del borde de su propio cuerpo (con el color de esa celda) y se van flotando hacia fuera y arriba (`ashOf` en `PixelScene.jsx`, `.sc-ash` en `shell.css`), y al presionar se desprenden más (`sparkle`). Se probaron y descartaron las pistas de circuito (muy rígidas); las propuestas están en `design/mascotas/encapuchado-aura*.png`.
- El estado de la mascota elegida vive en `src/lib/mascot.js` (`useMascot`, `setMascot`).

## Pendiente / decisiones abiertas

1. **Elegir la mascota por defecto** (`encapuchado`, `campana` o `glitch`; solo se usa si no hay una guardada, porque el arranque obliga a elegir).
2. ~~Elegir la versión de la campana con glitch.~~ Resuelto: el sitio usa la opción C de aquella ronda (`GLITCH_SPRITE` en `src/lib/creature.js`). Las otras seis quedaron descartadas (la 1 se parecía pero copiaba el cuerpo entero, no solo el marco).
3. Revisar en producción (Vercel) que el arranque, el selector y las fuentes propias se vean bien, y que `vercel.json` no cambie la caché de los archivos con hash.
4. Ideas sin hacer: pies diminutos para el encapuchado y una variante con holograma o auriculares. Las hojas de propuestas de esas ideas se borraron; se rehacen con los sprites de `creature.js`.
5. Dudas de diseño que quedaron abiertas: si en Inicio conviene que el cuarto sea más grande ahora que el encapuchado ocupa más alto.
6. La foto del perfil es un selfie con flash frente al espejo: una foto de frente, sin flash, mejoraría mucho la primera impresión.
7. Desbordes que ya existían y no se tocaron: *Sobre mí* hace scroll por diseño; *Servicios* desborda unos 11 px a 1280×640.
