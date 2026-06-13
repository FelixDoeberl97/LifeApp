export function CleanIngredients(ingredients) {
  return ingredients
    .map((ingredient) => String(ingredient).trim())
    .filter((ingredient) => ingredient.length > 0);
}

export function ValidateDish(dishData) {
  const errors = [];
  const name = String(dishData.name ?? "").trim();
  const durationMinutes = Number(dishData.durationMinutes);

  if (!name) {
    errors.push("Name ist erforderlich.");
  }

  if (name.length > 80) {
    errors.push("Name darf maximal 80 Zeichen lang sein.");
  }

  if (!Number.isFinite(durationMinutes) || durationMinutes < 1 || durationMinutes > 600) {
    errors.push("Dauer muss zwischen 1 und 600 Minuten liegen.");
  }

  if (!["Easy", "Medium", "Hard"].includes(dishData.difficulty)) {
    errors.push("Schwierigkeit ist ungueltig.");
  }

  if (!["Lunch", "Dinner"].includes(dishData.category)) {
    errors.push("Kategorie ist ungueltig.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
