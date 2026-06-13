import { useEffect, useState } from "react";
import { ValidateDish } from "../utils/validationUtils.js";

const emptyDish = {
  name: "",
  durationMinutes: "",
  difficulty: "Easy",
  category: "Dinner",
  baseIngredients: []
};

export default function DishForm({ dish, onSave, onCancel }) {
  const [dishData, setDishData] = useState(emptyDish);
  const [ingredientInput, setIngredientInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setDishData(dish ?? emptyDish);
    setIngredientInput("");
    setErrorMessage("");
  }, [dish]);

  function updateField(fieldName, value) {
    setDishData((currentDishData) => ({
      ...currentDishData,
      [fieldName]: value
    }));
  }

  function addIngredient() {
    const ingredient = ingredientInput.trim();

    if (!ingredient) {
      return;
    }

    setDishData((currentDishData) => ({
      ...currentDishData,
      baseIngredients: [...currentDishData.baseIngredients, ingredient]
    }));
    setIngredientInput("");
  }

  function removeIngredient(ingredientIndex) {
    setDishData((currentDishData) => ({
      ...currentDishData,
      baseIngredients: currentDishData.baseIngredients.filter((ingredient, index) => index !== ingredientIndex)
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validation = ValidateDish(dishData);

    if (!validation.isValid) {
      setErrorMessage(validation.errors.join(" "));
      return;
    }

    onSave(dishData);
    setDishData(emptyDish);
    setErrorMessage("");
  }

  return (
    <section className="data-panel">
      <h2>{dish ? "Gericht bearbeiten" : "Gericht hinzufuegen"}</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form className="form-grid dish-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input value={dishData.name} maxLength="80" onChange={(event) => updateField("name", event.target.value)} />
        </label>
        <label>
          Dauer in Minuten
          <input type="number" min="1" max="600" value={dishData.durationMinutes} onChange={(event) => updateField("durationMinutes", event.target.value)} />
        </label>
        <label>
          Schwierigkeit
          <select value={dishData.difficulty} onChange={(event) => updateField("difficulty", event.target.value)}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
        <label>
          Kategorie
          <select value={dishData.category} onChange={(event) => updateField("category", event.target.value)}>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </label>
        <label className="wide-field">
          Grundzutaten
          <div className="inline-input-row">
            <input value={ingredientInput} onChange={(event) => setIngredientInput(event.target.value)} />
            <button type="button" className="secondary-button" onClick={addIngredient}>Hinzufuegen</button>
          </div>
        </label>
        <div className="ingredient-list wide-field">
          {dishData.baseIngredients.map((ingredient, index) => (
            <button type="button" className="ingredient-chip" key={`${ingredient}-${index}`} onClick={() => removeIngredient(index)}>
              {ingredient} entfernen
            </button>
          ))}
        </div>
        <div className="form-actions">
          <button type="submit">Speichern</button>
          <button type="button" className="secondary-button" onClick={onCancel}>Abbrechen</button>
        </div>
      </form>
    </section>
  );
}
