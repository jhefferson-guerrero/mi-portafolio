import { content } from "../data/content";
import Pane from "./Pane";

const Skills = ({ active }) => (
  <Pane id="skills" active={active} file="stack.conf" hint="// con qué construyo">
    <p className="legend-line">
      <span className="legend">
        <span className="legend-dot" aria-hidden="true" /> stack principal
      </span>
    </p>

    <dl className="kv-list">
      {content.stack.map((group) => (
        <div key={group.label} className="kv">
          <dt>{group.label}</dt>
          <dd>
            <ul className="tag-row">
              {group.items.map((item) => (
                <li key={item.name} className={`tag ${item.main ? "tag--main" : ""}`}>
                  {item.main && <span className="legend-dot" aria-hidden="true" />}
                  {item.name}
                  {item.main && <span className="sr-only"> (stack principal)</span>}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  </Pane>
);

export default Skills;
