export function validateCategory(categoryData) {
  const errors = [];
  const name = String(categoryData.name ?? "").trim();

  if (!name) {
    errors.push("Name must not be empty.");
  }

  if (!["income", "expense"].includes(categoryData.type)) {
    errors.push("Type must be income or expense.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
