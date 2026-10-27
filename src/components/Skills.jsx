import { content } from "../data/content";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const Skills = () => (
  <section id="skills" className="section" aria-labelledby="skills-title">
    <div className="container">
      <SectionHead index="03" id="skills-title" title="stack" hint="// con qué construyo" />

      <Reveal>
        <div className="panel">
          <div className="panel-head">
            <span>~/stack.conf</span>
            <span className="legend">
              <span className="legend-dot" aria-hidden="true" /> stack principal
            </span>
          </div>

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
        </div>
      </Reveal>
    </div>
  </section>
);

export default Skills;
