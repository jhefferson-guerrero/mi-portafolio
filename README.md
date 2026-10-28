# Portafolio — Jhefferson Guerrero

Portafolio personal hecho con React 19 y Vite, con forma de pequeña "app" de una sola pantalla
(`jg-shell`): perfil y navegación a la izquierda, un panel por sección y una consola donde se pueden
escribir comandos. Tema negro con un único acento lila.

Producción: https://jhefferson-guerrero.vercel.app/

## Stack

- React 19 + Vite 7
- lucide-react (iconos)
- CSS propio (`src/styles/shell.css`), sin framework
- Tipografías: Space Grotesk (títulos) e IBM Plex Mono (interfaz y consola)

## Scripts

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run preview  # previsualiza el build
npm run lint     # ESLint
```

## Cómo se usa

- Navegación: menú lateral, teclas `1`–`7` o enlaces con ancla (`/#proyectos`).
- Consola: tecla `/` para enfocarla. Escribe `help` para ver los comandos
  (`cd`, `open`, `stack`, `projects`, `email`, `cv`, `neofetch`...). `↑ ↓` recorren el historial,
  `Tab` completa y `Esc` cierra la salida.
- En escritorio cada sección cabe en una sola pantalla, también en laptops de poca altura.
  En móvil la página hace scroll normal y la consola queda fija abajo.

## Estructura

```
src/
  components/   Titlebar, Sidebar, Pane, Console, Hero, About, Skills, Projects, Services,
                Contact, Interests, LevelBar, LoadingScreen, PixelScene
  data/         content.js — textos, proyectos, enlaces y redes
  hooks/        useConsole — salida e historial de la consola
  lib/          commands.js — comandos y autocompletado; creature.js — sprite; levels.js — escala de nivel
  styles/       shell.css — tokens de diseño y estilos de toda la interfaz
public/
  assets/       CV y capturas de proyectos
```

## Editar el contenido

Casi todo el texto vive en [`src/data/content.js`](src/data/content.js): presentación, bio, experiencia,
educación, stack, servicios, proyectos y redes sociales. Los comandos de la consola leen de ahí, así que
no hay que duplicar nada.

Para agregar un proyecto, añade un objeto a `content.projects` y guarda su captura en
`public/assets/projects/` (formato `.webp`, unos 1200 px de ancho para que pese poco). Mientras la
imagen no exista, el panel muestra un marcador con el nombre corto del proyecto. Con `focus` en el
proyecto se elige qué parte de la captura se ve en la miniatura (por ejemplo `"left top"`).

Para agregar un comando, añade un objeto a `COMMANDS` en [`src/lib/commands.js`](src/lib/commands.js).
