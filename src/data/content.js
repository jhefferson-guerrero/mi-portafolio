import { Code, Layout, Server} from "lucide-react";

export const content = {
  hero: {
    cvLink: "/assets/CV-Jhefferson-Guerrero.pdf",
  },
  services: [
    {
      title: "Desarrollo Frontend",
      desc: "Creación de interfaces web modernas y responsivas con React, JavaScript y Tailwind CSS.",
      icon: Layout,
    },
    {
      title: "Desarrollo Full Stack",
      desc: "Aplicaciones web completas integrando frontend React con Firebase, Node.js y bases de datos SQL.",
      icon: Server,
    },
    {
      title: "Diseño UI/UX",
      desc: "Prototipado en Figma enfocado en experiencias de usuario intuitivas y diseños funcionales.",
      icon: Code,
    },
  ],
  projects: [
    {
      title: "Academia Fertex",
      desc: "Plataforma web para digitalizar la presencia de la academia. Aumentó la visibilidad y facilitó el acceso a la información.",
      tags: ["React", "Tailwind CSS", "UX/UI"],
      link: "https://taekwondofertex.com",
      image: "/assets/projects/fertex.webp",
    },
    {
      title: "Mesa de Partes Virtual",
      desc: "Sistema que automatizó el 100% de la recepción documental, eliminando el uso de papel y errores manuales.",
      tags: ["JavaScript", "Firebase", "CSS3"],
      link: "https://mesa-de-partes-5c6c2.web.app",
      image: "/assets/projects/mesa-partes.webp",
    },
    {
      title: "Memory Fruit",
      desc: "Juego interactivo de memoria con 4 niveles de dificultad. Incluye temporizador, sistema de puntuación y pixel art design.",
      tags: ["JavaScript", "HTML5", "CSS3"],
      link: "https://memory-fruit.netlify.app",
      image: "/assets/projects/memory-fruit.webp",
    },
  ],
  socials: {
    linkedin: "https://linkedin.com/in/jhefferson-guerrero",
    github: "https://github.com/jhefferson-guerrero",
    email: "mailto:jheffer17x@gmail.com",
  },
};
