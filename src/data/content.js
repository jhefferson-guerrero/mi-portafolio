// Todo el texto del portafolio vive aquí. Los fragmentos con strong: true se
// resaltan con el color de acento.
export const content = {
  meta: {
    name: "Jhefferson Guerrero",
    location: "Lima, Perú",
    availability: "Disponible para prácticas",
    version: "v2026.10",
  },

  // Orden de las secciones: lo usan el menú superior y la barra de estado.
  nav: [
    { id: "inicio", label: "inicio" },
    { id: "about", label: "sobre mí" },
    { id: "skills", label: "stack" },
    { id: "proyectos", label: "proyectos" },
    { id: "servicios", label: "qué hago" },
    { id: "contacto", label: "contacto" },
  ],

  hero: {
    eyebrow: "~/portafolio",
    firstName: "Jhefferson",
    lastName: "Guerrero",
    role: "Frontend Developer",
    description:
      "Egresado de Ingeniería de Software en Lima. Construyo interfaces rápidas y accesibles con React, y busco prácticas preprofesionales para aportar en un equipo de desarrollo.",
    cvLink: "/assets/CV-Jhefferson-Guerrero.pdf",
    stats: [
      { label: "Estado", value: "Disponible", tone: "ok" },
      { label: "Busco", value: "Prácticas preprofesionales" },
      { label: "Ubicación", value: "Lima, Perú" },
      { label: "Stack principal", value: "React · Tailwind · Firebase" },
    ],
  },

  about: {
    bio: [
      [
        { text: "Soy " },
        { text: "Jhefferson Guerrero", strong: true },
        { text: ", egresado de Ingeniería de Software de la UTP y desarrollador web en Lima. Me enfoco en el " },
        { text: "front-end", strong: true },
        { text: ": interfaces claras, rápidas y accesibles, hechas con React y JavaScript." },
      ],
      [
        {
          text: "Tengo proyectos reales en producción: el sitio de una academia con más de 200 alumnos y un sistema de trámites con autenticación y base de datos en tiempo real. Ahora busco prácticas preprofesionales para aportar en un equipo y seguir aprendiendo.",
        },
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
          "Diseñé y desarrollé el sitio institucional con React y Tailwind CSS: servicios, horarios y captación de alumnos.",
          "Optimicé la carga en móvil con lazy loading, skeleton loading e Intersection Observer.",
          "Gestioné la comunicación digital por Facebook y WhatsApp para más de 150 familias.",
          "Lideré la renovación completa de la plataforma: React, Vite, Tailwind CSS v4, Framer Motion y SEO con JSON-LD y Open Graph.",
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

  // main: true marca el stack principal.
  stack: [
    {
      label: "Lenguajes",
      items: [
        { name: "JavaScript", main: true },
        { name: "HTML5" },
        { name: "CSS3" },
        { name: "Python" },
        { name: "PHP" },
      ],
    },
    {
      label: "Frameworks",
      items: [
        { name: "React", main: true },
        { name: "Tailwind CSS", main: true },
        { name: "Node.js" },
      ],
    },
    {
      label: "Bases de datos",
      items: [
        { name: "Firebase (Firestore, Auth)", main: true },
        { name: "MySQL" },
        { name: "SQL Server" },
      ],
    },
    {
      label: "Versiones",
      items: [{ name: "Git" }, { name: "GitHub" }],
    },
    {
      label: "Herramientas",
      items: [{ name: "VS Code" }, { name: "Figma" }, { name: "WordPress" }],
    },
    {
      label: "Metodología",
      items: [{ name: "Scrum" }],
    },
  ],

  services: [
    {
      title: "Desarrollo web",
      desc: "Sitios y aplicaciones responsivos con React, JavaScript y Tailwind CSS, pensados primero para móvil.",
    },
    {
      title: "Interfaces y accesibilidad",
      desc: "Componentes claros, navegables con teclado y con animaciones que ayudan sin estorbar.",
    },
    {
      title: "Rendimiento y SEO",
      desc: "Lazy loading, skeleton loading e Intersection Observer para cargas rápidas en celular; datos estructurados y Open Graph para los buscadores.",
    },
    {
      title: "Diseño UI/UX",
      desc: "Diseño centrado en el usuario, prototipos en Figma y sistemas de diseño escalables.",
    },
  ],

  projects: [
    {
      title: "Sitio web Academia Fertex",
      short: "fertex",
      desc: "Sitio de una academia de artes marciales con 20 años de trayectoria y más de 200 alumnos activos.",
      highlights: [
        "Diseño mobile-first con skeleton loading, lazy loading e Intersection Observer.",
        "Secciones de disciplinas, galería, horarios, instructores y mapa de locales.",
      ],
      result: "Más visibilidad digital y captación de alumnos, con la información disponible 24/7.",
      tags: ["React", "Vite", "Tailwind CSS", "Framer Motion", "SEO"],
      link: "https://www.taekwondofertex.com/",
      code: "https://github.com/jhefferson-guerrero/fertex-web",
      image: "/assets/projects/fertex.webp",
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
