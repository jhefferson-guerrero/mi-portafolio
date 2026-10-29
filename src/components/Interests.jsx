import {
  Clapperboard,
  Code2,
  Dumbbell,
  Gamepad2,
  Music,
  Palette,
  PawPrint,
  Share2,
  Sparkles,
  Swords,
  Tv,
  Utensils,
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
};

// Idiomas y hobbies. Los datos viven en content.js.
const Interests = ({ active }) => {
  return (
    <Pane id="extra" active={active} file="intereses.md" hint="// fuera del código" fill>
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
            <ul className="box-body hobbies">
              {content.hobbies.map((hobby) => {
                const Icon = ICONS[hobby.icon] ?? Sparkles;
                return (
                  <li key={hobby.name} className="hobby">
                    <Icon aria-hidden="true" />
                    {hobby.name}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </Pane>
  );
};

export default Interests;
