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
  // icon: clave que los componentes traducen a un icono.
  nav: [
    { id: "inicio", label: "inicio", cmd: "inicio", icon: "house" },
    { id: "about", label: "sobre mí", cmd: "sobre-mi", icon: "user" },
    { id: "skills", label: "stack", cmd: "stack", icon: "layers" },
    { id: "proyectos", label: "proyectos", cmd: "proyectos", icon: "folder" },
    { id: "servicios", label: "qué hago", cmd: "servicios", icon: "wrench" },
    { id: "extra", label: "intereses", cmd: "intereses", icon: "gamepad" },
    { id: "contacto", label: "contacto", cmd: "contacto", icon: "mail" },
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
        title: "Desarrollador Web Frontend",
        org: "Academia Fertex Artes Marciales",
        bullets: [
          "Landing original y comunicación digital para más de 150 familias.",
          "Rediseño con React, Vite, Tailwind CSS v4, Framer Motion y Lenis; SEO técnico.",
        ],
      },
      {
        date: "2021 → 2025",
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
        { name: "PHP", level: 2 },
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
        { name: "SQL Server", level: 2 },
      ],
    },
    {
      label: "Git y deploy",
      items: [{ name: "Git", level: 3 }, { name: "GitHub", level: 3 }, { name: "Vercel", level: 3 }],
    },
    {
      label: "Herramientas",
      items: [
        { name: "VS Code", level: 4 },
        { name: "Figma", level: 3 },
        { name: "WordPress", level: 2 },
        { name: "Scrum", level: 2 },
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

  // icon: clave que Interests.jsx traduce a un icono.
  hobbies: [
    { name: "Programación", icon: "code" },
    { name: "Diseño", icon: "palette" },
    { name: "Videojuegos", icon: "gamepad" },
    { name: "Ver series", icon: "tv" },
    { name: "Anime", icon: "sparkles" },
    { name: "Cine", icon: "clapperboard" },
    { name: "Música", icon: "music" },
    { name: "Gym", icon: "dumbbell" },
    { name: "UFC", icon: "swords" },
    { name: "Animales", icon: "paw" },
    { name: "Comida", icon: "utensils" },
    { name: "Redes sociales", icon: "share" },
  ],

  projects: [
    {
      title: "Sitio web corporativo CBS",
      short: "cbs",
      desc: "Sitio de una constructora de infraestructura de agua y saneamiento en Perú y Brasil, desarrollado durante mis prácticas profesionales.",
      highlights: [
        "Páginas por proyecto y una para su empresa hermana, Limp City.",
        "SEO con prerenderizado propio, cabeceras de seguridad y formulario de contacto.",
      ],
      tags: ["React 19", "TypeScript", "Vite", "Tailwind CSS 4", "SEO"],
      link: "https://cbs-web-tan.vercel.app/",
      code: "https://github.com/jhefferson-guerrero/cbs-web",
      image: "/assets/projects/cbs.webp",
      focus: "left top",
    },
    {
      title: "Sitio web Academia Fertex",
      short: "fertex",
      desc: "Plataforma de una academia de Taekwondo ITF, Muay Thai y Capoeira con 24 años de trayectoria y comunicación digital para más de 150 familias.",
      highlights: [
        "Rediseño desde cero con React, Vite y Tailwind CSS v4, animaciones con Framer Motion y scroll suave con Lenis.",
        "SEO técnico (JSON-LD, Open Graph), Core Web Vitals optimizados y migración a Vercel.",
      ],
      result: "Más visibilidad digital y captación de nuevos alumnos.",
      tags: ["React", "Vite", "Tailwind CSS", "Framer Motion", "SEO"],
      link: "https://www.taekwondofertex.com/",
      code: "https://github.com/jhefferson-guerrero/fertex-web",
      image: "/assets/projects/fertex.webp",
      focus: "left top",
    },
    {
      title: "Sistema Mesa de Partes Virtual",
      short: "mesa-de-partes",
      desc: "Plataforma para digitalizar trámites administrativos y centralizar la gestión documental.",
      highlights: [
        "Autenticación completa, historial de trámites y carga de documentos PDF/Word con validación de formato.",
        "Notificaciones automáticas por correo y sincronización en tiempo real con Firestore.",
      ],
      result: "Automatizó el 100 % de la recepción documental y eliminó los errores de registro manual.",
      tags: ["JavaScript", "HTML5", "CSS3", "Firebase"],
      link: "https://mesa-de-partes-5c6c2.web.app/",
      code: "https://github.com/jhefferson-guerrero/mesa-de-partes-ccjn",
      image: "/assets/projects/mesa-partes.webp",
    },
    {
      title: "Pastelia Bakery — Landing page",
      short: "pastelia",
      desc: "Landing page de repostería con animaciones fluidas, navegación suave y una interfaz cuidada.",
      tags: ["React 19", "Vite", "Tailwind CSS v4", "Framer Motion", "Lenis", "React Router"],
      link: "https://pasteliabakery.vercel.app/",
      code: "https://github.com/jhefferson-guerrero/pastelia-landing",
      image: "/assets/projects/pastelia.webp",
    },
    {
      title: "Sistema de gestión para academia (ERP)",
      short: "erp-academia",
      desc: "Panel administrativo seguro para gestionar alumnos, mensualidades, cinturones, asistencias y profesores.",
      highlights: [
        "Autenticación y protección anti-bots con Cloudflare Turnstile.",
        "Gráficos interactivos en tiempo real y reportes financieros exportables a PDF.",
      ],
      tags: ["React 19", "Tailwind CSS", "Supabase", "Recharts", "Cloudflare Turnstile"],
      link: "",
      code: "https://github.com/jhefferson-guerrero/sistema-taekwondo",
      image: "/assets/projects/erp.webp",
      focus: "left top",
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
