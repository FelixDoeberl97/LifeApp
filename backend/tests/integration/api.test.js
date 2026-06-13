import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";
import { closeDatabase, initializeDatabase } from "../../src/database/database.js";
import { runMigrations } from "../../src/database/migrate.js";

let app;
let database;

beforeEach(async () => {
  await closeDatabase();
  database = await initializeDatabase(":memory:");
  await runMigrations(database);
  app = await createApp(database);
});

afterEach(async () => {
  await closeDatabase();
});

async function registerUser(email = "user@example.com") {
  const response = await request(app)
    .post("/api/auth/register")
    .send({ email, password: "password123" });

  return response.body.token;
}

async function createCategory(token, name = "Groceries", type = "expense") {
  const response = await request(app)
    .post("/api/categories")
    .set("Authorization", `Bearer ${token}`)
    .send({ name, type });

  return response.body;
}

describe("auth api", () => {
  it("register_ShouldCreateUser", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "new@example.com", password: "password123" });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe("new@example.com");
  });

  it("login_ShouldReturnToken_WhenCredentialsAreValid", async () => {
    await registerUser("login@example.com");

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
  });
});

describe("budget api", () => {
  it("createBudget_ShouldPersistBudget", async () => {
    const token = await registerUser();

    const response = await request(app)
      .post("/api/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send({ month: 1, year: 2026, amount: 1200 });

    expect(response.status).toBe(201);
    expect(response.body.amount).toBe(1200);
  });

  it("createBudget_ShouldRejectDuplicateMonthForSameUser", async () => {
    const token = await registerUser();

    await request(app)
      .post("/api/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send({ month: 1, year: 2026, amount: 1200 });

    const response = await request(app)
      .post("/api/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send({ month: 1, year: 2026, amount: 1300 });

    expect(response.status).toBe(409);
  });

  it("getBudgets_ShouldOnlyReturnBudgetsOfCurrentUser", async () => {
    const firstToken = await registerUser("first@example.com");
    const secondToken = await registerUser("second@example.com");

    await request(app)
      .post("/api/budgets")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({ month: 1, year: 2026, amount: 1200 });
    await request(app)
      .post("/api/budgets")
      .set("Authorization", `Bearer ${secondToken}`)
      .send({ month: 2, year: 2026, amount: 2200 });

    const response = await request(app)
      .get("/api/budgets")
      .set("Authorization", `Bearer ${firstToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].amount).toBe(1200);
  });
});

describe("category and transaction api", () => {
  it("createCategory_ShouldPersistCategory", async () => {
    const token = await registerUser();

    const response = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Salary", type: "income" });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Salary");
  });

  it("createTransaction_ShouldRejectCategoryFromAnotherUser", async () => {
    const firstToken = await registerUser("first@example.com");
    const secondToken = await registerUser("second@example.com");
    const category = await createCategory(firstToken);

    const response = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${secondToken}`)
      .send({
        categoryId: category.id,
        type: "expense",
        amount: 40,
        description: "Invalid category",
        transactionDate: "2026-01-10"
      });

    expect(response.status).toBe(400);
  });
});

describe("dashboard api", () => {
  it("getDashboard_ShouldReturnCorrectMonthlySummary", async () => {
    const token = await registerUser();
    await request(app)
      .post("/api/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send({ month: 1, year: 2026, amount: 1000 });

    const incomeCategory = await createCategory(token, "Salary", "income");
    const expenseCategory = await createCategory(token, "Groceries", "expense");

    await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ categoryId: incomeCategory.id, type: "income", amount: 500, description: "Salary", transactionDate: "2026-01-10" });
    await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ categoryId: expenseCategory.id, type: "expense", amount: 200, description: "Groceries", transactionDate: "2026-01-11" });

    const response = await request(app)
      .get("/api/dashboard?month=1&year=2026")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.monthlyBudget).toBe(1000);
    expect(response.body.totalIncome).toBe(500);
    expect(response.body.totalExpenses).toBe(200);
    expect(response.body.remainingBudget).toBe(1300);
    expect(response.body.transactionCount).toBe(2);
  });
});
