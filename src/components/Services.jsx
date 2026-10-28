import { Accessibility, Code2, Gauge, PenTool } from "lucide-react";
import { content } from "../data/content";
import Pane from "./Pane";

const ICONS = {
  code: Code2,
  accessibility: Accessibility,
  gauge: Gauge,
  pen: PenTool,
};

const Services = ({ active }) => (
  <Pane id="servicios" active={active} file="servicios.md" hint="// áreas de trabajo">
    <ol className="rows">
      {content.services.map((service) => {
        const Icon = ICONS[service.icon] ?? Code2;
        return (
          <li key={service.title} className="row">
            <Icon size={18} className="row-icon" aria-hidden="true" />
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </li>
        );
      })}
    </ol>
  </Pane>
);

export default Services;
