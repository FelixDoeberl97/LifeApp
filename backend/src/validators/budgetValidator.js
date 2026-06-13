export function validateBudget(budgetData) {
  const errors = [];
  const amount = Number(budgetData.amount);
  const month = Number(budgetData.month);
  const year = Number(budgetData.year);

  if (!Number.isFinite(amount) || amount <= 0) {
    errors.push("Amount must be greater than 0.");
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    errors.push("Month must be between 1 and 12.");
  }

  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    errors.push("Year must be between 2000 and 2100.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
