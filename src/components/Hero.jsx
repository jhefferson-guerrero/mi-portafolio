import { useState, useEffect } from "react";
import { Download, Mail } from "lucide-react";
import { content } from "../data/content";
import Pane from "./Pane";
import MascotCard from "./MascotCard";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TypewriterText = ({ fullText }) => {
  const [reduced] = useState(prefersReducedMotion);
  const [text, setText] = useState(() => (reduced ? fullText : ""));

  useEffect(() => {
    if (reduced) return;

    let index = 0;
    let typeWriter;
    const startTyping = setTimeout(() => {
      typeWriter = setInterval(() => {
        index++;
        setText(fullText.slice(0, index));
        if (index >= fullText.length) clearInterval(typeWriter);
      }, 70);
    }, 700);

    return () => {
      clearTimeout(startTyping);
      clearInterval(typeWriter);
    };
  }, [fullText, reduced]);

  return (
    <>
      <span aria-label={fullText}>{text}</span>
      <span className="cursor" aria-hidden="true" />
    </>
  );
};

// Vista de inicio. `navigate` cambia de vista.
const Hero = ({ active, navigate }) => {
  const { hero, socials } = content;

  return (
    <Pane id="inicio" active={active} file="inicio.md" home>
      <div className="home">
        <div className="home-main">
          <p className="eyebrow">{hero.eyebrow} · {content.meta.location.toLowerCase()}</p>

          <h1>
            {hero.firstName}
            <br />
            <span className="h1-last">{hero.lastName}</span>
          </h1>

          <p className="prompt">
            <span className="prompt-sign" aria-hidden="true">&gt;</span>
            <TypewriterText fullText={hero.role} />
          </p>

          <p className="hero-desc">{hero.description}</p>

          <div className="actions">
            <button type="button" className="btn btn--primary" onClick={() => navigate("proyectos")}>
              Ver proyectos
            </button>
            <a href={socials.email} className="btn">
              <Mail size={15} /> Contactar
            </a>
            <a href={hero.cvLink} download className="btn">
              <Download size={15} /> CV
            </a>
          </div>
        </div>

        <div className="home-side">
          <MascotCard />
        </div>
      </div>
    </Pane>
  );
};

export default Hero;
