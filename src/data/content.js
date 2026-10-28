// Todo el texto del portafolio vive aquí. Los fragmentos con strong: true se
// resaltan con el color de acento.
export const content = {
  meta: {
    name: "Jhefferson Guerrero",
    location: "Lima, Perú",
    availability: "Disponible para prácticas",
    version: "v2026.10",
    studies: "UTP · Ing. de Software (egresado)",
    seeking: "Prácticas preprofesionales",
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
      "Egresado de Ingeniería de Software en Lima. Construyo interfaces rápidas y accesibles con React, y busco prácticas preprofesionales para aportar en un equipo de desarrollo.",
    cvLink: "/assets/CV-Jhefferson-Guerrero.pdf",
  },

  about: {
    bio: [
      [
        { text: "Soy " },
        { text: "Jhefferson Guerrero", strong: true },
        { text: ", egresado de Ingeniería de Software de la UTP y desarrollador web en Lima. Me enfoco en el " },
        { text: "front-end", strong: true },
        { text: ": interfaces claras, rápidas y accesibles, hechas con React y JavaScript. Tengo proyectos reales en producción y ahora busco " },
        { text: "prácticas preprofesionales", strong: true },
        { text: " para aportar en un equipo y seguir aprendiendo." },
      ],
    ],
    metrics: [
      { value: "200+", label: "alumnos activos en la academia que usa el sitio de Fertex" },
      { value: "100%", label: "de la recepción documental automatizada en Mesa de Partes" },
      { value: "150+", label: "familias atendidas por Facebook y WhatsApp" },
    ],
    history: [
      {
        date: "feb 2023 → actualidad",
        title: "Desarrollador Web",
        org: "Academia Fertex Artes Marciales",
        bullets: [
          "Sitio institucional con React y Tailwind CSS: servicios, horarios y captación de alumnos.",
          "Carga móvil optimizada con lazy loading, skeleton loading e Intersection Observer.",
          "Comunicación digital por Facebook y WhatsApp para más de 150 familias.",
          "Renovación completa: React, Vite, Tailwind CSS v4, Framer Motion y SEO con JSON-LD.",
        ],
        links: [
          { label: "Sitio en vivo", href: "https://www.taekwondofertex.com/" },
          { label: "Código", href: "https://github.com/jhefferson-guerrero/fertex-web" },
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
        { name: "HTML5", level: 4 },
        { name: "CSS3", level: 4 },
        { name: "Python", level: 2 },
        { name: "PHP", level: 2 },
      ],
    },
    {
      label: "Frameworks",
      items: [
        { name: "React", level: 4, main: true },
        { name: "Tailwind CSS", level: 4, main: true },
        { name: "Node.js", level: 2 },
      ],
    },
    {
      label: "Bases de datos",
      items: [
        { name: "Firebase (Firestore, Auth)", level: 3, main: true },
        { name: "MySQL", level: 3 },
        { name: "SQL Server", level: 2 },
      ],
    },
    {
      label: "Versiones",
      items: [{ name: "Git", level: 3 }, { name: "GitHub", level: 3 }],
    },
    {
      label: "Herramientas",
      items: [{ name: "VS Code", level: 4 }, { name: "Figma", level: 3 }, { name: "WordPress", level: 2 }],
    },
    {
      label: "Metodología",
      items: [{ name: "Scrum", level: 2 }],
    },
  ],

  services: [
    {
      title: "Desarrollo web",
      icon: "code",
      desc: "Sitios y aplicaciones responsivos con React, JavaScript y Tailwind CSS, pensados primero para móvil.",
    },
    {
      title: "Interfaces y accesibilidad",
      icon: "accessibility",
      desc: "Componentes claros, navegables con teclado y con animaciones que ayudan sin estorbar.",
    },
    {
      title: "Rendimiento y SEO",
      icon: "gauge",
      desc: "Lazy loading, skeleton loading e Intersection Observer para cargas rápidas en celular; datos estructurados y Open Graph para los buscadores.",
    },
    {
      title: "Diseño UI/UX",
      icon: "pen",
      desc: "Diseño centrado en el usuario, prototipos en Figma y sistemas de diseño escalables.",
    },
  ],

  languages: [
    { name: "Español", label: "Nativo", level: 5 },
    { name: "Inglés", label: "Intermedio", level: 3 },
  ],

  // icon: clave que Interests.jsx traduce a un icono.
  hobbies: [
    { name: "Videojuegos", icon: "gamepad" },
    { name: "Ver series", icon: "tv" },
    { name: "Gym", icon: "dumbbell" },
    { name: "Música", icon: "music" },
    { name: "Anime", icon: "sparkles" },
    { name: "Cine", icon: "clapperboard" },
    { name: "Fútbol", icon: "goal" },
    { name: "Café", icon: "coffee" },
  ],

  projects: [
    {
      title: "Sitio web Academia Fertex",
      short: "fertex",
      desc: "Sitio de una academia de Taekwondo ITF, Muay Thai y Capoeira con 24 años de trayectoria y más de 200 alumnos activos.",
      highlights: [
        "Diseño mobile-first con skeleton loading, lazy loading e Intersection Observer.",
        "Secciones de disciplinas, galería, horarios, instructores y mapa de locales.",
      ],
      result: "Más visibilidad digital y captación de alumnos, con la información disponible 24/7.",
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
      desc: "Plataforma web para controlar alumnos y pagos, con gráficos interactivos para analizar los datos financieros.",
      tags: ["React 19", "Tailwind CSS", "Supabase", "Recharts"],
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
