# Portafolio — Jhefferson Guerrero

Portafolio personal de una sola página, hecho con React 19 y Vite. Estilo "terminal minimalista":
fondo casi negro, bordes de 1px, tipografía monoespaciada y un único acento ámbar.
Siempre abre en modo oscuro; el botón de la barra superior alterna el tema solo durante la sesión.

Producción: https://jhefferson-guerrero.vercel.app/

## Stack

- React 19 + Vite 7
- lucide-react (iconos)
- CSS propio (`src/styles/App.css`), sin framework

## Scripts

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run preview  # previsualiza el build
npm run lint     # ESLint
```

## Estructura

```
src/
  components/   Navbar, StatusBar, Hero, About, Skills, Projects, Services, Contact,
                LoadingScreen, PixelBot, Reveal, SectionHead
  data/         content.js — textos, proyectos, enlaces y redes
  hooks/        useScrollReveal, useActiveSection
  styles/       App.css — tokens de diseño y estilos de todas las secciones
public/
  assets/       CV y capturas de proyectos
```

## Editar el contenido

Casi todo el texto vive en [`src/data/content.js`](src/data/content.js): presentación, bio, experiencia,
educación, stack, servicios, proyectos y redes sociales.

Para agregar un proyecto, añade un objeto a `content.projects` y guarda su captura en
`public/assets/projects/` (formato `.webp`). Mientras la imagen no exista, la tarjeta muestra un
marcador con el nombre corto del proyecto. Las capturas pendientes son:

- `public/assets/projects/pastelia.webp`
- `public/assets/projects/erp.webp`

## Tema

El tema oscuro se fija en `index.html` (`data-theme="dark"`). Los colores están definidos como
variables CSS al inicio de `App.css`, con un bloque `[data-theme='light']` para el modo claro.
