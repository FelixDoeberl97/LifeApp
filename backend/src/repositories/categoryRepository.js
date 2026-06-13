export async function getCategoriesByUser(database, userId) {
  return database.all(
    "SELECT * FROM categories WHERE userId = ? ORDER BY type, name",
    userId
  );
}

export async function getCategoryById(database, userId, categoryId) {
  return database.get(
    "SELECT * FROM categories WHERE id = ? AND userId = ?",
    categoryId,
    userId
  );
}

export async function getCategoryByNameAndType(database, userId, name, type) {
  return database.get(
    "SELECT * FROM categories WHERE userId = ? AND lower(name) = lower(?) AND type = ?",
    userId,
    name,
    type
  );
}

export async function createCategory(database, userId, categoryData) {
  const result = await database.run(
    "INSERT INTO categories (userId, name, type) VALUES (?, ?, ?)",
    userId,
    categoryData.name.trim(),
    categoryData.type
  );

  return getCategoryById(database, userId, result.lastID);
}

export async function updateCategory(database, userId, categoryId, categoryData) {
  await database.run(
    "UPDATE categories SET name = ?, type = ? WHERE id = ? AND userId = ?",
    categoryData.name.trim(),
    categoryData.type,
    categoryId,
    userId
  );

  return getCategoryById(database, userId, categoryId);
}

export async function deleteCategory(database, userId, categoryId) {
  const result = await database.run(
    "DELETE FROM categories WHERE id = ? AND userId = ?",
    categoryId,
    userId
  );

  return result.changes > 0;
}
