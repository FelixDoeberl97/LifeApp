export function validateTransaction(transactionData) {
  const errors = [];
  const amount = Number(transactionData.amount);
  const description = String(transactionData.description ?? "");
  const transactionDate = new Date(transactionData.transactionDate);

  if (!Number.isFinite(amount) || amount <= 0) {
    errors.push("Amount must be greater than 0.");
  }

  if (!["income", "expense"].includes(transactionData.type)) {
    errors.push("Type must be income or expense.");
  }

  if (!transactionData.transactionDate || Number.isNaN(transactionDate.getTime())) {
    errors.push("Transaction date must be a valid date.");
  }

  if (description.length > 255) {
    errors.push("Description must not be longer than 255 characters.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
