export async function createUser(database, userData) {
  const result = await database.run(
    "INSERT INTO users (email, passwordHash) VALUES (?, ?)",
    userData.email,
    userData.passwordHash
  );

  return findUserById(database, result.lastID);
}

export async function findUserByEmail(database, email) {
  return database.get("SELECT * FROM users WHERE email = ?", email);
}

export async function findUserById(database, userId) {
  return database.get("SELECT id, email, createdAt FROM users WHERE id = ?", userId);
}
