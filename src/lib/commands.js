import { content } from "../data/content";
import { LEVEL_LABELS } from "./levels";
import { CLOSED_VIEW } from "./paneClose";
import { MASCOTS } from "./creature";
import { findMascot, getMascotName, mascotNames, setMascot } from "./mascot";

// Cada línea de salida: { kind, text, name?, href? }
// kind: text | dim | ok | err | head | kv | link
const text = (value, kind = "text") => ({ kind, text: value });
const kv = (name, value) => ({ kind: "kv", name, text: value });

const SECTIONS = content.nav;
const PROJECTS = content.projects;
const EMAIL = content.socials.email.replace("mailto:", "");

// Nombres alternativos que también llevan a una sección.
const SECTION_ALIASES = {
  home: "inicio",
  inicio: "inicio",
  about: "about",
  sobre: "about",
  "sobre-mi": "about",
  sobremi: "about",
  skills: "skills",
  stack: "skills",
  tecnologias: "skills",
  proyectos: "proyectos",
  projects: "proyectos",
  servicios: "servicios",
  services: "servicios",
  hago: "servicios",
  "que-hago": "servicios",
  intereses: "extra",
  extra: "extra",
  contacto: "contacto",
  contact: "contacto",
};

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\/$/, "");

const resolveSection = (token = "") => SECTION_ALIASES[normalize(token)] ?? null;

// Acepta número (1-4) o parte del nombre corto (fertex, mesa, erp...).
const resolveProject = (token = "") => {
  const value = normalize(token);
  if (!value) return -1;
  if (/^\d+$/.test(value)) {
    const index = Number(value) - 1;
    return index >= 0 && index < PROJECTS.length ? index : -1;
  }
  return PROJECTS.findIndex((project) => project.short.startsWith(value));
};

const COMMANDS = [
  {
    name: "help",
    aliases: ["?", "ayuda"],
    desc: "muestra esta lista",
    run: () => [
      text("Comandos disponibles", "head"),
      ...COMMANDS.filter((command) => !command.hidden).map((command) =>
        kv(command.usage ?? command.name, command.desc)
      ),
      text("Atajos: / enfoca la consola · 1-7 cambian de sección · Esc cierra la sección · ↑ ↓ historial · Tab completa", "dim"),
    ],
  },
  {
    name: "ls",
    desc: "lista las secciones",
    run: () => [text(SECTIONS.map((section) => `${section.cmd}/`).join("   "))],
  },
  {
    name: "cd",
    usage: "cd <sección>",
    desc: "va a una sección (también basta con escribir su nombre)",
    run: ([target], ctx) => {
      if (!target) {
        ctx.navigate("inicio");
        return null;
      }
      const id = resolveSection(target);
      if (!id) return [text(`cd: no existe la sección "${target}". Prueba con "ls".`, "err")];
      ctx.navigate(id);
      return null;
    },
  },
  {
    name: "kill",
    aliases: ["close", "cerrar"],
    desc: "cierra la sección abierta",
    run: (_args, ctx) => {
      const section = SECTIONS.find((item) => item.id === ctx.view);
      if (!section) return [text("kill: no hay ninguna sección abierta.", "dim")];
      ctx.navigate(CLOSED_VIEW);
      return [text(`Cerrando ${section.file} ...`, "dim"), text("listo", "ok")];
    },
  },
  {
    name: "open",
    usage: "open <n|nombre>",
    desc: "abre un proyecto: open 1, open fertex",
    run: ([target], ctx) => {
      if (!target) return [text("uso: open <n|nombre>. Escribe \"projects\" para ver la lista.", "err")];
      const index = resolveProject(target);
      if (index >= 0) {
        ctx.openProject(index);
        return null;
      }
      const id = resolveSection(target);
      if (id) {
        ctx.navigate(id);
        return null;
      }
      return [text(`open: no encontré "${target}".`, "err")];
    },
  },
  {
    name: "mascota",
    aliases: ["mascot"],
    usage: "mascota [nombre]",
    desc: "cambia la mascota: bit, nox o bug",
    run: ([target]) => {
      const names = mascotNames();
      if (!target) return [kv("actual", MASCOTS[getMascotName()].label), kv("opciones", names.join(", ")), text("mascota <nombre> para cambiarla", "dim")];
      const name = findMascot(normalize(target));
      if (!name) return [text(`mascota: no existe "${target}". Opciones: ${names.join(", ")}.`, "err")];
      setMascot(name);
      return [text(`Mascota: ${MASCOTS[name].label}`, "ok")];
    },
  },
  {
    name: "whoami",
    desc: "quién soy",
    run: () => [
      text(`${content.meta.name} — ${content.hero.role} en ${content.meta.location}.`),
      text(`${content.meta.studies}.`, "dim"),
      text(`Busco: ${content.meta.seeking.toLowerCase()}.`, "ok"),
    ],
  },
  {
    name: "stack",
    desc: "tecnologías que uso",
    run: () => [
      ...content.stack.map((group) =>
        kv(group.label, group.items.map((item) => `${item.name} ${item.level}/5`).join(", "))
      ),
      text(`Nivel: 1 ${LEVEL_LABELS[0]} → 5 ${LEVEL_LABELS[4]}`, "dim"),
    ],
  },
  {
    name: "languages",
    aliases: ["idiomas", "langs"],
    desc: "idiomas y nivel",
    run: (_args, ctx) => {
      ctx.navigate("extra");
      return content.languages.map((language) => kv(language.name, language.label.toLowerCase()));
    },
  },
  {
    name: "hobbies",
    desc: "mis intereses fuera del código",
    run: (_args, ctx) => {
      ctx.navigate("extra");
      return [text(content.hobbies.map((hobby) => hobby.name.toLowerCase()).join(" · "))];
    },
  },
  {
    name: "projects",
    desc: "lista mis proyectos",
    run: () => [
      ...PROJECTS.map((project, i) =>
        kv(`${String(i + 1).padStart(2, "0")} ${project.short}`, project.link ? "en línea" : "solo código")
      ),
      text("open <n> para ver el detalle", "dim"),
    ],
  },
  {
    name: "email",
    desc: "copia mi correo al portapapeles",
    run: async (_args, ctx) => {
      const copied = await ctx.copyEmail();
      return copied
        ? [text(`Copiado: ${EMAIL}`, "ok")]
        : [text("No pude copiarlo. Escríbeme a:"), { kind: "link", text: EMAIL, href: content.socials.email }];
    },
  },
  {
    name: "cv",
    desc: "descarga mi CV",
    run: (_args, ctx) => {
      ctx.downloadCv();
      return [text("Descargando CV-Jhefferson-Guerrero.pdf ...", "ok")];
    },
  },
  {
    name: "github",
    desc: "abre mi GitHub",
    run: (_args, ctx) => {
      ctx.openUrl(content.socials.github);
      return [text(`Abriendo ${content.socials.githubLabel} ...`, "dim")];
    },
  },
  {
    name: "linkedin",
    desc: "abre mi LinkedIn",
    run: (_args, ctx) => {
      ctx.openUrl(content.socials.linkedin);
      return [text(`Abriendo ${content.socials.linkedinLabel} ...`, "dim")];
    },
  },
  {
    name: "neofetch",
    desc: "ficha rápida del sistema",
    run: () => [
      text(`${content.meta.name.split(" ")[0].toLowerCase()}@portafolio`, "head"),
      kv("rol", content.hero.role),
      kv("ubicación", content.meta.location),
      kv("estudios", content.meta.studies),
      kv("stack", "React · TypeScript · Tailwind CSS"),
      kv("shell", `jg-shell ${content.meta.version}`),
      kv("estado", content.meta.availability.toLowerCase()),
    ],
  },
  {
    name: "history",
    desc: "comandos usados en esta sesión",
    run: (_args, ctx) =>
      ctx.history.length
        ? ctx.history.map((entry, i) => kv(String(i + 1).padStart(2, " "), entry))
        : [text("Aún no hay historial.", "dim")],
  },
  {
    name: "date",
    desc: "fecha y hora en Lima",
    run: () => [
      text(new Date().toLocaleString("es-PE", { timeZone: "America/Lima", dateStyle: "full", timeStyle: "short" })),
    ],
  },
  {
    name: "clear",
    aliases: ["cls"],
    desc: "limpia la salida",
    run: () => null,
  },
  {
    name: "exit",
    aliases: ["quit"],
    desc: "cierra la salida",
    run: () => null,
  },
  {
    name: "echo",
    hidden: true,
    run: (args) => [text(args.join(" "))],
  },
  {
    name: "sudo",
    hidden: true,
    run: (args, ctx) => {
      if (normalize(args.join(" ")) === "hire me") {
        ctx.navigate("contacto");
        return [
          text("[sudo] contraseña de reclutador: ········", "dim"),
          text("Permiso concedido. Buena decisión.", "ok"),
          { kind: "link", text: EMAIL, href: content.socials.email },
        ];
      }
      return [text(`${content.meta.name.split(" ")[0].toLowerCase()} no está en el archivo sudoers. Este incidente será reportado.`, "err")];
    },
  },
  {
    name: "rm",
    hidden: true,
    run: () => [text("rm: operación no permitida. Buen intento.", "err")],
  },
];

const LOOKUP = new Map(
  COMMANDS.flatMap((command) => [command.name, ...(command.aliases ?? [])].map((name) => [name, command]))
);

// Ejecuta una línea. Devuelve las líneas de salida, o null si no hay nada que mostrar.
export const runCommand = async (raw, ctx) => {
  const [name, ...args] = raw.trim().split(/\s+/);
  const key = normalize(name);

  const command = LOOKUP.get(key);
  if (command) return command.run(args, ctx);

  // Escribir solo el nombre de una sección también navega.
  const sectionId = resolveSection(key);
  if (sectionId) {
    ctx.navigate(sectionId);
    return null;
  }

  return [text(`comando no encontrado: "${name}". Escribe "help".`, "err")];
};

const commonPrefix = (words) =>
  words.reduce((prefix, word) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === word[i]) i++;
    return prefix.slice(0, i);
  });

// Autocompletado con Tab: comandos en la primera palabra, secciones y proyectos en la segunda.
export const complete = (value) => {
  const trimmedStart = value.replace(/^\s+/, "");
  const parts = trimmedStart.split(/\s+/);
  const current = normalize(parts[parts.length - 1] ?? "");
  let pool;

  if (parts.length === 1) {
    pool = [
      ...COMMANDS.filter((command) => !command.hidden).map((command) => command.name),
      ...SECTIONS.map((section) => section.cmd),
    ];
  } else if (["cd", "open"].includes(parts[0])) {
    pool = [...SECTIONS.map((section) => section.cmd), ...PROJECTS.map((project) => project.short)];
  } else if (["mascota", "mascot"].includes(parts[0])) {
    pool = mascotNames();
  } else {
    return value;
  }

  const matches = [...new Set(pool.filter((entry) => normalize(entry).startsWith(current)))];
  if (!matches.length) return value;

  const completion = matches.length === 1 ? matches[0] : commonPrefix(matches);
  const head = parts.slice(0, -1).join(" ");
  return `${head ? `${head} ` : ""}${completion}${matches.length === 1 ? " " : ""}`;
};
