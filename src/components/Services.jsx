import { content } from "../data/content";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const pad = (n) => String(n).padStart(2, "0");

const Services = () => (
  <section id="servicios" className="section" aria-labelledby="servicios-title">
    <div className="container">
      <SectionHead index="05" id="servicios-title" title="qué hago" hint="// áreas de trabajo" />

      <Reveal>
        <ol className="panel rows">
          {content.services.map((service, i) => (
            <li key={service.title} className="row">
              <span className="row-idx" aria-hidden="true">{pad(i + 1)}</span>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  </section>
);

export default Services;
