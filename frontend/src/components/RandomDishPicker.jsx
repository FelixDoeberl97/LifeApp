import { useState } from "react";
import { GetRandomDish } from "../services/dishService.js";

export default function RandomDishPicker({ dishes }) {
  const [selectedDish, setSelectedDish] = useState(null);
  const [message, setMessage] = useState("");

  function chooseRandomDish() {
    const dish = GetRandomDish(dishes);

    if (!dish) {
      setSelectedDish(null);
      setMessage("Keine Gerichte vorhanden");
      return;
    }

    setSelectedDish(dish);
    setMessage("");
  }

  return (
    <section className="data-panel">
      <div className="section-header">
        <h2>Zufallsauswahl</h2>
        <button type="button" onClick={chooseRandomDish}>Zufaellig auswaehlen</button>
      </div>
      {message && <p className="notice">{message}</p>}
      {selectedDish && (
        <div className="random-result">
          <strong>{selectedDish.name}</strong>
          <span>{selectedDish.durationMinutes} Minuten · {selectedDish.difficulty}</span>
        </div>
      )}
    </section>
  );
}
