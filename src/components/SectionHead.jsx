import Reveal from "./Reveal";

const SectionHead = ({ index, id, title, hint }) => (
  <Reveal as="header" className="sec-head">
    <span className="sec-idx" aria-hidden="true">{index}</span>
    <h2 id={id}>{title}</h2>
    <span className="sec-rule" aria-hidden="true" />
    {hint && <span className="sec-hint" aria-hidden="true">{hint}</span>}
  </Reveal>
);

export default SectionHead;
