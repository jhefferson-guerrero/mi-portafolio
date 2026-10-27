import { useScrollReveal } from "../hooks/useScrollReveal";

// Envuelve un bloque y lo anima (fade + subida corta) al entrar en pantalla.
const Reveal = ({ as = "div", delay = 0, className = "", children, ...rest }) => {
  const Tag = as;
  const [ref, isVisible] = useScrollReveal();

  return (
    <Tag
      ref={ref}
      className={`reveal ${isVisible ? "is-visible" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
