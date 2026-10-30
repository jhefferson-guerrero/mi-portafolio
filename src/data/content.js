// Todo el texto del portafolio vive aquí. Los fragmentos con strong: true se
// resaltan con el color de acento.
export const content = {
  meta: {
    name: "Jhefferson Guerrero",
    location: "Lima, Perú",
    availability: "Abierto a oportunidades",
    version: "v2026.10",
    studies: "UTP · Ing. de Software (egresado)",
    seeking: "Primera oportunidad como Desarrollador Frontend",
  },

  // Orden de las secciones. id: ancla de la URL; cmd: nombre que se escribe en la consola;
  // file: archivo que la consola dice abrir; icon: clave que los componentes traducen a un icono.
  nav: [
    { id: "inicio", label: "inicio", cmd: "inicio", file: "inicio.md", icon: "house" },
    { id: "about", label: "sobre mí", cmd: "sobre-mi", file: "sobre-mi.md", icon: "user" },
    { id: "skills", label: "tecnologías", cmd: "tecnologias", file: "tecnologias.conf", icon: "layers" },
    { id: "proyectos", label: "proyectos", cmd: "proyectos", file: "proyectos/", icon: "folder" },
    { id: "servicios", label: "servicios", cmd: "servicios", file: "servicios.md", icon: "wrench" },
    { id: "extra", label: "intereses", cmd: "intereses", file: "intereses.md", icon: "gamepad" },
    { id: "contacto", label: "contacto", cmd: "contacto", file: "contacto.sh", icon: "mail" },
  ],

  hero: {
    eyebrow: "~/portafolio",
    firstName: "Jhefferson",
    lastName: "Guerrero",
    role: "Frontend Developer",
    description:
      "Egresado de Ingeniería de Software en Lima. Construyo interfaces rápidas y accesibles con React y TypeScript. Hoy practico en el área de TI de CBS y busco mi primera oportunidad como desarrollador frontend.",
    cvLink: "/assets/CV-Jhefferson-Guerrero.pdf",
  },

  about: {
    bio: [
      [
        { text: "Soy " },
        { text: "Jhefferson Guerrero", strong: true },
        { text: ", egresado de Ingeniería de Software de la UTP y desarrollador " },
        { text: "front-end", strong: true },
        { text: " en Lima. Trabajo con React, TypeScript y Tailwind CSS, y hago mis prácticas en el área de TI de CBS, donde desarrollé su sitio web corporativo. Busco mi " },
        { text: "primera oportunidad como Desarrollador Frontend", strong: true },
        { text: "." },
      ],
    ],
    history: [
      {
        date: "jun 2026 → nov 2026",
        year: "2026",
        kind: "experiencia",
        title: "Practicante de TI",
        org: "CBS · Construtora Baiana de Saneamento",
        bullets: [
          "Soporte técnico a usuarios y apoyo en los requerimientos del área de TI.",
          "Sitio web corporativo con React 19, TypeScript, Vite y Tailwind CSS 4.",
          "SEO con prerenderizado propio, publicado en Vercel con cabeceras de seguridad.",
        ],
      },
      {
        date: "feb 2023 → feb 2024 · may → ago 2026",
        year: "2023",
        kind: "experiencia",
        title: "Desarrollador Web Frontend",
        org: "Academia Fertex Artes Marciales",
        bullets: [
          "Rediseño desde cero con React, Vite y Tailwind CSS v4, estética brutalista moderna, Framer Motion y Lenis.",
          "SEO técnico (JSON-LD, Open Graph), Core Web Vitals optimizados y migración a Vercel.",
          "Landing original que digitalizó servicios y horarios, y comunicación digital de más de 150 familias.",
        ],
      },
      {
        date: "2021 → 2025",
        year: "2021",
        kind: "educación",
        title: "Ingeniería de Software",
        org: "Universidad Tecnológica del Perú (UTP)",
        note: "Egresado",
      },
    ],
  },

  // level: 1 inicial · 2 básico · 3 intermedio · 4 sólido · 5 experto. main: true marca el stack principal.
  stack: [
    {
      label: "Lenguajes",
      items: [
        { name: "JavaScript", level: 4, main: true },
        { name: "TypeScript", level: 3, main: true },
        { name: "HTML5", level: 4 },
        { name: "CSS3", level: 4 },
      ],
    },
    {
      label: "Frameworks",
      items: [
        { name: "React", level: 4, main: true },
        { name: "Tailwind CSS", level: 4, main: true },
        { name: "Vite", level: 4 },
        { name: "Framer Motion", level: 3 },
        { name: "Node.js", level: 2 },
      ],
    },
    {
      label: "Bases de datos",
      items: [
        { name: "Supabase", level: 3 },
        { name: "Firebase (Firestore, Auth)", level: 3 },
        { name: "MySQL", level: 3 },
      ],
    },
    {
      label: "Herramientas",
      items: [
        { name: "Git", level: 3 },
        { name: "GitHub", level: 3 },
        { name: "Vercel", level: 3 },
        { name: "Figma", level: 3 },
      ],
    },
  ],

  services: [
    {
      title: "Desarrollo web",
      icon: "code",
      desc: "Sitios y aplicaciones responsivos con React, TypeScript y Tailwind CSS, pensados primero para móvil.",
      tags: ["React", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "Interfaces y accesibilidad",
      icon: "accessibility",
      desc: "Componentes claros, navegables con teclado y con animaciones que ayudan sin estorbar.",
      tags: ["Teclado", "ARIA", "Framer Motion"],
    },
    {
      title: "Rendimiento y SEO",
      icon: "gauge",
      desc: "Core Web Vitals, lazy loading y skeleton loading para cargas rápidas en celular; SEO técnico con JSON-LD, Open Graph y prerenderizado.",
      tags: ["Core Web Vitals", "Lazy loading", "JSON-LD", "Prerenderizado"],
    },
    {
      title: "Diseño UI/UX",
      icon: "pen",
      desc: "Diseño centrado en el usuario, prototipos en Figma y sistemas de diseño escalables.",
      tags: ["Figma", "Prototipos", "Sistemas de diseño"],
    },
  ],

  languages: [
    { name: "Español", label: "Nativo", level: 5 },
    { name: "Inglés", label: "Intermedio", level: 3 },
  ],

  // icon: clave que Interests.jsx traduce a un icono. group: fila en la que se agrupa.
  hobbies: [
    { name: "Programación", icon: "code", group: "Tecnología" },
    { name: "Diseño", icon: "palette", group: "Tecnología" },
    { name: "IA", icon: "bot", group: "Tecnología" },
    { name: "Animación web", icon: "wand", group: "Tecnología" },
    { name: "Videojuegos", icon: "gamepad", group: "Entretenimiento" },
    { name: "Ver series", icon: "tv", group: "Entretenimiento" },
    { name: "Anime", icon: "sparkles", group: "Entretenimiento" },
    { name: "Cine", icon: "clapperboard", group: "Entretenimiento" },
    { name: "Música", icon: "music", group: "Entretenimiento" },
    { name: "Gym", icon: "dumbbell", group: "Deporte" },
    { name: "Artes marciales", icon: "medal", group: "Deporte" },
    { name: "UFC", icon: "swords", group: "Deporte" },
    { name: "Animales", icon: "paw", group: "Día a día" },
    { name: "Comida", icon: "utensils", group: "Día a día" },
    { name: "Redes sociales", icon: "share", group: "Día a día" },
  ],

  projects: [
    {
      title: "CBS Perú — Sitio web corporativo",
      short: "cbs",
      desc: "Sitio institucional para una constructora de obras de saneamiento en Perú y Brasil.",
      highlights: [
        "Sitio multipágina con empresa, certificaciones, clientes, contacto y una página por proyecto.",
        "Contenido separado del diseño: se agregan proyectos o textos editando un solo archivo.",
        "SEO con prerenderizado propio y metadatos por página.",
      ],
      tags: ["React 19", "TypeScript", "Vite", "Tailwind CSS 4", "Framer Motion", "Vercel"],
      link: "https://cbs-web-tan.vercel.app/",
      code: "https://github.com/jhefferson-guerrero/cbs-web",
      image: "/assets/projects/cbs.webp",
    },
    {
      title: "Sitio web Academia Fertex",
      short: "fertex",
      desc: "Plataforma web de una academia de artes marciales con 24 años de trayectoria y más de 150 familias.",
      highlights: [
        "Rediseño desde cero con React, Vite y Tailwind CSS v4, estética brutalista moderna, Framer Motion y Lenis.",
        "SEO técnico (JSON-LD, Open Graph), Core Web Vitals optimizados y migración a Vercel.",
        "Landing original que digitalizó servicios y horarios, y comunicación digital de más de 150 familias.",
      ],
      result: "Más visibilidad digital y captación de nuevos alumnos.",
      tags: ["React", "Vite", "Tailwind CSS v4", "Framer Motion", "Lenis", "SEO"],
      link: "https://www.taekwondofertex.com/",
      code: "https://github.com/jhefferson-guerrero/fertex-web",
      image: "/assets/projects/fertex.webp",
    },
    {
      title: "Sistema Mesa de Partes Virtual",
      short: "mesa-de-partes",
      desc: "Plataforma completa para digitalizar trámites administrativos.",
      highlights: [
        "Autenticación completa: registro, inicio de sesión y recuperación de cuenta.",
        "Dashboard personalizado con historial de trámites y validación de carga de documentos.",
        "Notificaciones automáticas por correo y sincronización en tiempo real con Firestore.",
      ],
      result: "Automaticé el 100 % de la recepción documental.",
      tags: ["JavaScript", "HTML5", "CSS3", "Firebase"],
      link: "https://mesa-de-partes-5c6c2.web.app/",
      code: "https://github.com/jhefferson-guerrero/mesa-de-partes-ccjn",
      image: "/assets/projects/mesa-partes.webp",
    },
    {
      title: "Pastelia Bakery — Landing page",
      short: "pastelia",
      desc: "Sitio web moderno y atractivo para una repostería artesanal.",
      highlights: [
        "Landing mobile-first enfocada en el producto y la conversión: tortas, queques, clásicos y cuchareables.",
        "Animaciones fluidas con Framer Motion y scroll suave con Lenis.",
        "Componentes reutilizables (botones magnéticos, cursor personalizado, lightbox) y navegación entre inicio y catálogo.",
      ],
      result: "Optimizada para rendimiento, con despliegue automatizado en Vercel.",
      tags: ["React 19", "Vite", "Tailwind CSS 4", "Framer Motion", "Lenis", "React Router"],
      link: "https://pasteliabakery.vercel.app/",
      code: "https://github.com/jhefferson-guerrero/pastelia-landing",
      image: "/assets/projects/pastelia.webp",
    },
    {
      title: "Sistema de gestión para academia (ERP)",
      short: "erp-academia",
      desc: "Plataforma web integral para administración, control de alumnos y finanzas.",
      highlights: [
        "Panel administrativo seguro con autenticación y protección anti-bots (Cloudflare Turnstile).",
        "Módulos de alumnos, mensualidades, promoción de cinturones, asistencias y profesores.",
        "Gráficos interactivos en tiempo real y reportes financieros exportables a PDF.",
      ],
      result: "Digitalicé y automaticé la carga administrativa y operativa interna del dojang.",
      tags: ["React 19", "Tailwind CSS", "Supabase", "Recharts", "Cloudflare Turnstile"],
      link: "",
      code: "https://github.com/jhefferson-guerrero/sistema-taekwondo",
      image: "/assets/projects/erp.webp",
      ratio: 1.96,
    },
  ],

  socials: {
    linkedin: "https://linkedin.com/in/jhefferson-guerrero",
    linkedinLabel: "in/jhefferson-guerrero",
    github: "https://github.com/jhefferson-guerrero",
    githubLabel: "github.com/jhefferson-guerrero",
    email: "mailto:jheffer17x@gmail.com",
  },
};
