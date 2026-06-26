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

async function RegisterUser(email = "budget-user@example.com") {
  const response = await request(app)
    .post("/api/auth/register")
    .send({ email, password: "password123" });

  return response.body.token;
}

async function CreateBudget(token, month = 6, year = 2026, amount = 1000) {
  const response = await request(app)
    .post("/api/budgets")
    .set("Authorization", `Bearer ${token}`)
    .send({ month, year, amount });

  return response.body;
}

async function CreateCategory(token, name, type) {
  const response = await request(app)
    .post("/api/categories")
    .set("Authorization", `Bearer ${token}`)
    .send({ name, type });

  return response.body;
}

async function CreateTransaction(token, categoryId, type, amount, transactionDate) {
  const response = await request(app)
    .post("/api/transactions")
    .set("Authorization", `Bearer ${token}`)
    .send({
      categoryId,
      type,
      amount,
      description: "Integration test",
      transactionDate
    });

  return response.body;
}

describe("budget app additional integration tests", () => {
  it("getBudgets_ShouldRejectMissingAuthorization", async () => {
    const response = await request(app)
      .get("/api/budgets");

    expect(response.status).toBe(401);
  });

  it("updateBudget_ShouldPersistChangedBudget", async () => {
    const token = await RegisterUser();
    const budget = await CreateBudget(token);

    const updateResponse = await request(app)
      .put(`/api/budgets/${budget.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ month: 7, year: 2026, amount: 1500 });

    const listResponse = await request(app)
      .get("/api/budgets")
      .set("Authorization", `Bearer ${token}`);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.month).toBe(7);
    expect(updateResponse.body.amount).toBe(1500);
    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0].month).toBe(7);
  });

  it("deleteBudget_ShouldRemoveBudgetFromList", async () => {
    const token = await RegisterUser();
    const budget = await CreateBudget(token);

    const deleteResponse = await request(app)
      .delete(`/api/budgets/${budget.id}`)
      .set("Authorization", `Bearer ${token}`);

    const listResponse = await request(app)
      .get("/api/budgets")
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({ deleted: true });
    expect(listResponse.body).toEqual([]);
  });

  it("createTransaction_ShouldRejectTypeMismatchWithCategory", async () => {
    const token = await RegisterUser();
    const category = await CreateCategory(token, "Salary", "income");

    const response = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        categoryId: category.id,
        type: "expense",
        amount: 50,
        description: "Wrong type",
        transactionDate: "2026-06-24"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Transaction type must match category type.");
  });

  it("getDashboard_ShouldOnlyIncludeTransactionsFromRequestedMonth", async () => {
    const token = await RegisterUser();
    await CreateBudget(token, 6, 2026, 1000);
    const expenseCategory = await CreateCategory(token, "Food", "expense");

    await CreateTransaction(token, expenseCategory.id, "expense", 100, "2026-06-10");
    await CreateTransaction(token, expenseCategory.id, "expense", 200, "2026-07-10");

    const response = await request(app)
      .get("/api/dashboard?month=6&year=2026")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.totalExpenses).toBe(100);
    expect(response.body.remainingBudget).toBe(900);
    expect(response.body.transactionCount).toBe(1);
  });
});
