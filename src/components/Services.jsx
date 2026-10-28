import { content } from "../data/content";
import Pane from "./Pane";

const pad = (n) => String(n).padStart(2, "0");

const Services = ({ active }) => (
  <Pane id="servicios" active={active} file="servicios.md" hint="// áreas de trabajo">
    <ol className="rows">
      {content.services.map((service, i) => (
        <li key={service.title} className="row">
          <span className="row-idx" aria-hidden="true">{pad(i + 1)}</span>
          <h3>{service.title}</h3>
          <p>{service.desc}</p>
        </li>
      ))}
    </ol>
  </Pane>
);

export default Services;
