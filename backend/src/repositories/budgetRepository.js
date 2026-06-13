export async function getBudgetsByUser(database, userId) {
  return database.all(
    "SELECT * FROM budgets WHERE userId = ? ORDER BY year DESC, month DESC",
    userId
  );
}

export async function getBudgetById(database, userId, budgetId) {
  return database.get(
    "SELECT * FROM budgets WHERE id = ? AND userId = ?",
    budgetId,
    userId
  );
}

export async function getBudgetByMonth(database, userId, month, year) {
  return database.get(
    "SELECT * FROM budgets WHERE userId = ? AND month = ? AND year = ?",
    userId,
    month,
    year
  );
}

export async function createBudget(database, userId, budgetData) {
  const result = await database.run(
    "INSERT INTO budgets (userId, month, year, amount) VALUES (?, ?, ?, ?)",
    userId,
    Number(budgetData.month),
    Number(budgetData.year),
    Number(budgetData.amount)
  );

  return getBudgetById(database, userId, result.lastID);
}

export async function updateBudget(database, userId, budgetId, budgetData) {
  await database.run(
    "UPDATE budgets SET month = ?, year = ?, amount = ? WHERE id = ? AND userId = ?",
    Number(budgetData.month),
    Number(budgetData.year),
    Number(budgetData.amount),
    budgetId,
    userId
  );

  return getBudgetById(database, userId, budgetId);
}

export async function deleteBudget(database, userId, budgetId) {
  const result = await database.run(
    "DELETE FROM budgets WHERE id = ? AND userId = ?",
    budgetId,
    userId
  );

  return result.changes > 0;
}
