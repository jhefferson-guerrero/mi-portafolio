import {
  Bot,
  Clapperboard,
  Code2,
  Dumbbell,
  Gamepad2,
  Medal,
  Music,
  Palette,
  PawPrint,
  Share2,
  Sparkles,
  Swords,
  Tv,
  Utensils,
  Wand2,
} from "lucide-react";
import { content } from "../data/content";
import Pane from "./Pane";
import LevelBar from "./LevelBar";

const ICONS = {
  code: Code2,
  palette: Palette,
  gamepad: Gamepad2,
  tv: Tv,
  sparkles: Sparkles,
  clapperboard: Clapperboard,
  music: Music,
  dumbbell: Dumbbell,
  swords: Swords,
  paw: PawPrint,
  utensils: Utensils,
  share: Share2,
  bot: Bot,
  wand: Wand2,
  medal: Medal,
};

// Los intereses se agrupan por categoría conservando el orden de content.js.
const groupHobbies = (hobbies) =>
  hobbies.reduce((groups, hobby) => {
    const group = groups.find((item) => item.name === hobby.group);
    if (group) group.items.push(hobby);
    else groups.push({ name: hobby.group, items: [hobby] });
    return groups;
  }, []);

// Idiomas y hobbies. Los datos viven en content.js.
const Interests = ({ active }) => {
  const hobbyGroups = groupHobbies(content.hobbies);

  return (
    <Pane id="extra" active={active} file="intereses.md" fill>
      <div className="extra-grid">
        <div className="extra-col">
          <section className="box" aria-labelledby="idiomas-title">
            <h3 id="idiomas-title" className="box-title">idiomas</h3>
            <ul className="box-body langs">
              {content.languages.map((language) => (
                <li key={language.name} className="lang">
                  <span className="lang-name">{language.name}</span>
                  <span className="lang-label">{language.label}</span>
                  <LevelBar level={language.level} large />
                </li>
              ))}
            </ul>
          </section>

          <section className="box" aria-labelledby="hobbies-title">
            <h3 id="hobbies-title" className="box-title">intereses</h3>
            <dl className="box-body kv-list">
              {hobbyGroups.map((group) => (
                <div key={group.name} className="kv">
                  <dt>{group.name}</dt>
                  <dd>
                    <ul className="hobbies">
                      {group.items.map((hobby) => {
                        const Icon = ICONS[hobby.icon] ?? Sparkles;
                        return (
                          <li key={hobby.name} className="hobby">
                            <Icon aria-hidden="true" />
                            {hobby.name}
                          </li>
                        );
                      })}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </Pane>
  );
};

export default Interests;
