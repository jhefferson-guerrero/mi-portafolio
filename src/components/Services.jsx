import { Accessibility, Code2, Gauge, PenTool } from "lucide-react";
import { content } from "../data/content";
import Pane from "./Pane";

const ICONS = {
  code: Code2,
  accessibility: Accessibility,
  gauge: Gauge,
  pen: PenTool,
};

// Cuatro áreas de trabajo en tarjetas que llenan el panel.
const Services = ({ active }) => (
  <Pane id="servicios" active={active} file="servicios.md" fill>
    <ul className="svc-grid">
      {content.services.map((service) => {
        const Icon = ICONS[service.icon] ?? Code2;
        return (
          <li key={service.title} className="svc">
            <div className="svc-head">
              <span className="svc-icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <h3>{service.title}</h3>
            </div>
            <p>{service.desc}</p>
            {service.tags && (
              <ul className="tag-row svc-tags">
                {service.tags.map((tag) => (
                  <li key={tag} className="tag">{tag}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  </Pane>
);

export default Services;
