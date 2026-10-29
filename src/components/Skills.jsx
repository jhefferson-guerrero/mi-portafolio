import { content } from "../data/content";
import Pane from "./Pane";
import LevelBar from "./LevelBar";

const Skills = ({ active }) => (
  <Pane id="skills" active={active} file="tecnologias.conf" fill>
    <p className="legend-line">
      <span className="legend">
        <span className="legend-dot" aria-hidden="true" /> stack principal
      </span>
      <span className="legend">
        <LevelBar level={3} /> nivel: de inicial a experto
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
                  <LevelBar level={item.level} />
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
