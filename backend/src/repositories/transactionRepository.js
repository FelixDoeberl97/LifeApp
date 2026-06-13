export async function getTransactionsByUser(database, userId) {
  return database.all(
    `SELECT transactions.*, categories.name AS categoryName
     FROM transactions
     JOIN categories ON categories.id = transactions.categoryId
     WHERE transactions.userId = ?
     ORDER BY transactionDate DESC, transactions.id DESC`,
    userId
  );
}

export async function getTransactionsByMonth(database, userId, month, year) {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);

  return database.all(
    `SELECT transactions.*, categories.name AS categoryName
     FROM transactions
     JOIN categories ON categories.id = transactions.categoryId
     WHERE transactions.userId = ?
       AND transactionDate >= ?
       AND transactionDate < ?
     ORDER BY transactionDate DESC, transactions.id DESC`,
    userId,
    startDate,
    endDate
  );
}

export async function getTransactionById(database, userId, transactionId) {
  return database.get(
    `SELECT transactions.*, categories.name AS categoryName
     FROM transactions
     JOIN categories ON categories.id = transactions.categoryId
     WHERE transactions.id = ? AND transactions.userId = ?`,
    transactionId,
    userId
  );
}

export async function createTransaction(database, userId, transactionData) {
  const result = await database.run(
    `INSERT INTO transactions (userId, categoryId, type, amount, description, transactionDate)
     VALUES (?, ?, ?, ?, ?, ?)`,
    userId,
    Number(transactionData.categoryId),
    transactionData.type,
    Number(transactionData.amount),
    transactionData.description ?? "",
    transactionData.transactionDate
  );

  return getTransactionById(database, userId, result.lastID);
}

export async function updateTransaction(database, userId, transactionId, transactionData) {
  await database.run(
    `UPDATE transactions
     SET categoryId = ?, type = ?, amount = ?, description = ?, transactionDate = ?
     WHERE id = ? AND userId = ?`,
    Number(transactionData.categoryId),
    transactionData.type,
    Number(transactionData.amount),
    transactionData.description ?? "",
    transactionData.transactionDate,
    transactionId,
    userId
  );

  return getTransactionById(database, userId, transactionId);
}

export async function deleteTransaction(database, userId, transactionId) {
  const result = await database.run(
    "DELETE FROM transactions WHERE id = ? AND userId = ?",
    transactionId,
    userId
  );

  return result.changes > 0;
}
