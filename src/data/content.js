import { Code, Layout, Server, Smartphone, Globe } from "lucide-react";

export const content = {
  hero: {
    cvLink: "/assets/CV-Jhefferson-Guerrero.pdf",
  },
  about: {
    education: {
      title: "Educación",
      institution: "Ingeniería de Software",
      degree: "Universidad Tecnológica del Perú (UTP)",
      date: "2021 - 2025"
    },
    experience: {
      title: "Experiencia Laboral",
      role: "Desarrollador Web Frontend",
      company: "Academia Fertex Artes Marciales",
      date: "Feb 2023 – Actualidad",
      desc: "Lideré la digitalización inicial de la academia y recientemente estuve a cargo de la renovación tecnológica completa de su plataforma web. Implementé React, Vite, Tailwind CSS v4, animaciones con Framer Motion, y optimización SEO avanzada (JSON-LD, Open Graph).",
      linkLive: "https://www.taekwondofertex.com/",
      linkCode: "https://github.com/jhefferson-guerrero/fertex-web"
    },
    stack: [
      "React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", 
      "Firebase", "MySQL", "Git", "Figma"
    ]
  },
  services: [
    {
      title: "Desarrollo Web",
      desc: "Creación de sitios web responsivos y optimizados usando las últimas tecnologías como React y Tailwind CSS.",
      icon: Globe,
    },
    {
      title: "Desarrollo Frontend",
      desc: "Implementación de interfaces de usuario interactivas, accesibles y con animaciones fluidas.",
      icon: Code,
    },
    {
      title: "Diseño UI/UX",
      desc: "Diseño centrado en el usuario, prototipado en Figma y creación de sistemas de diseño escalables.",
      icon: Smartphone,
    },
  ],
  projects: [
    {
      title: "Sistema Mesa de Partes Virtual",
      desc: "Plataforma para digitalización de trámites con autenticación segura, notificaciones automáticas y base de datos en tiempo real.",
      tags: ["JavaScript", "HTML5", "CSS3", "Firebase"],
      link: "https://mesa-de-partes-5c6c2.web.app/",
      code: "https://github.com/jhefferson-guerrero/mesa-de-partes-ccjn",
      image: "/assets/projects/mesa-partes.webp",
    },
    {
      title: "Pastelia Bakery - Landing Page",
      desc: "Landing page premium de repostería con animaciones fluidas, navegación suave y un diseño UI/UX altamente atractivo.",
      tags: ["React 19", "Vite", "Tailwind CSS v4", "Framer Motion", "Lenis", "React Router"],
      link: "https://pasteliabakery.vercel.app/",
      code: "https://github.com/jhefferson-guerrero/pastelia-landing",
      image: "/assets/projects/placeholder.webp",
    },
    {
      title: "Sistema de Gestión para Academia (ERP)",
      desc: "Plataforma web integral para el control eficiente de alumnos, pagos y análisis de datos financieros mediante gráficos interactivos.",
      tags: ["React 19", "Tailwind CSS", "Supabase", "Recharts"],
      link: "",
      code: "https://github.com/jhefferson-guerrero/sistema-taekwondo",
      image: "/assets/projects/placeholder.webp",
    },
  ],
  socials: {
    linkedin: "https://linkedin.com/in/jhefferson-guerrero",
    github: "https://github.com/jhefferson-guerrero",
    email: "mailto:jheffer17x@gmail.com",
  },
};
