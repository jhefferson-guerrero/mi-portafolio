import { MASCOTS } from "../lib/creature";
import { setMascot, useMascot } from "../lib/mascot";

// Selector de mascota del arranque. La elección se aplica al instante (la escena de la pantalla de carga la
// muestra) y se recuerda para el resto del sitio.
const MascotPicker = () => {
  const current = useMascot();

  return (
    <div className="boot-picker" role="group" aria-label="Elige la mascota">
      <span>mascota</span>
      {Object.values(MASCOTS).map((mascot) => (
        <button
          key={mascot.name}
          type="button"
          className="boot-picker-btn"
          aria-pressed={mascot.name === current.name}
          onClick={() => setMascot(mascot.name)}
        >
          {mascot.label}
        </button>
      ))}
    </div>
  );
};

export default MascotPicker;
