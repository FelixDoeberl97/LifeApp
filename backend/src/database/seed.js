import bcrypt from "bcrypt";
import { initializeDatabase, closeDatabase } from "./database.js";
import { runMigrations } from "./migrate.js";

async function seedDatabase() {
  const database = await initializeDatabase();
  await runMigrations(database);

  const passwordHash = await bcrypt.hash("password123", 10);
  await database.run(
    `INSERT INTO users (email, passwordHash)
     VALUES (?, ?)
     ON CONFLICT(email) DO UPDATE SET passwordHash = excluded.passwordHash`,
    "demo@example.com",
    passwordHash
  );

  const user = await database.get("SELECT * FROM users WHERE email = ?", "demo@example.com");
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  await database.run(
    `INSERT INTO budgets (userId, month, year, amount)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(userId, month, year) DO UPDATE SET amount = excluded.amount`,
    user.id,
    month,
    year,
    2500
  );

  const categories = [
    { name: "Salary", type: "income" },
    { name: "Groceries", type: "expense" },
    { name: "Rent", type: "expense" },
    { name: "Transport", type: "expense" }
  ];

  for (const category of categories) {
    await database.run(
      `INSERT OR IGNORE INTO categories (userId, name, type)
       VALUES (?, ?, ?)`,
      user.id,
      category.name,
      category.type
    );
  }

  await database.run("DELETE FROM transactions WHERE userId = ?", user.id);

  const salaryCategory = await database.get(
    "SELECT * FROM categories WHERE userId = ? AND name = ? AND type = ?",
    user.id,
    "Salary",
    "income"
  );
  const groceriesCategory = await database.get(
    "SELECT * FROM categories WHERE userId = ? AND name = ? AND type = ?",
    user.id,
    "Groceries",
    "expense"
  );
  const rentCategory = await database.get(
    "SELECT * FROM categories WHERE userId = ? AND name = ? AND type = ?",
    user.id,
    "Rent",
    "expense"
  );
  const transportCategory = await database.get(
    "SELECT * FROM categories WHERE userId = ? AND name = ? AND type = ?",
    user.id,
    "Transport",
    "expense"
  );

  const transactionDatePrefix = `${year}-${String(month).padStart(2, "0")}`;
  const transactions = [
    { categoryId: salaryCategory.id, type: "income", amount: 3200, description: "Monthly salary", transactionDate: `${transactionDatePrefix}-01` },
    { categoryId: rentCategory.id, type: "expense", amount: 950, description: "Apartment rent", transactionDate: `${transactionDatePrefix}-02` },
    { categoryId: groceriesCategory.id, type: "expense", amount: 180, description: "Weekly groceries", transactionDate: `${transactionDatePrefix}-05` },
    { categoryId: transportCategory.id, type: "expense", amount: 49, description: "Monthly ticket", transactionDate: `${transactionDatePrefix}-06` }
  ];

  for (const transaction of transactions) {
    await database.run(
      `INSERT INTO transactions (userId, categoryId, type, amount, description, transactionDate)
       VALUES (?, ?, ?, ?, ?, ?)`,
      user.id,
      transaction.categoryId,
      transaction.type,
      transaction.amount,
      transaction.description,
      transaction.transactionDate
    );
  }

  await closeDatabase();
  console.log("Database seed completed.");
}

seedDatabase();
