import {
  Clapperboard,
  Coffee,
  Dumbbell,
  Gamepad2,
  Goal,
  Music,
  Sparkles,
  Tv,
} from "lucide-react";
import { content } from "../data/content";
import Pane from "./Pane";
import LevelBar from "./LevelBar";

const ICONS = {
  gamepad: Gamepad2,
  tv: Tv,
  dumbbell: Dumbbell,
  music: Music,
  sparkles: Sparkles,
  clapperboard: Clapperboard,
  goal: Goal,
  coffee: Coffee,
};

// Idiomas con su nivel y hobbies. Los datos viven en content.js.
const Interests = ({ active }) => (
  <Pane id="extra" active={active} file="intereses.md" hint="// fuera del código">
    <div className="extra-grid">
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
        <ul className="box-body hobbies">
          {content.hobbies.map((hobby) => {
            const Icon = ICONS[hobby.icon] ?? Sparkles;
            return (
              <li key={hobby.name} className="hobby">
                <Icon size={14} aria-hidden="true" />
                {hobby.name}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  </Pane>
);

export default Interests;
