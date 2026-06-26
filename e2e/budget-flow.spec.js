import { expect, test } from "@playwright/test";

function uniqueEmail(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;
}

async function register(page, email) {
  await page.goto("/register");
  await page.getByTestId("register-email").fill(email);
  await page.getByTestId("register-password").fill("password123");
  await page.getByTestId("register-submit").click();
  await expect(page).toHaveURL(/dashboard/);
}

async function login(page, email) {
  await page.goto("/login");
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill("password123");
  await page.getByTestId("login-submit").click();
  await expect(page).toHaveURL(/dashboard/);
}

test("userCanRegisterLoginAndCreateBudget", async ({ page }) => {
  const email = uniqueEmail("budget");
  await register(page, email);
  await page.getByTestId("logout-button").click();
  await login(page, email);

  await page.getByRole("link", { name: "Budgets" }).click();
  await page.getByTestId("budget-month").fill("1");
  await page.getByTestId("budget-year").fill("2026");
  await page.getByTestId("budget-amount").fill("1500");
  await page.getByTestId("create-budget-button").click();

  await expect(page.getByTestId("budget-list")).toContainText("1/2026");
  await expect(page.getByTestId("budget-list")).toContainText("1,500");
});

test("userCanCreateCategoryAndTransaction", async ({ page }) => {
  await register(page, uniqueEmail("transaction"));

  await page.getByRole("link", { name: "Categories" }).click();
  await page.getByTestId("category-name").fill("Groceries");
  await page.getByTestId("category-type").selectOption("expense");
  await page.getByTestId("category-submit").click();
  await expect(page.getByTestId("category-list")).toContainText("Groceries");

  await page.getByRole("link", { name: "Transactions" }).click();
  await page.getByTestId("transaction-type").selectOption("expense");
  await page.getByTestId("transaction-category").selectOption({ label: "Groceries" });
  await page.getByTestId("transaction-amount").fill("42");
  await page.getByTestId("transaction-description").fill("Weekly groceries");
  await page.getByTestId("transaction-submit").click();

  await expect(page.getByTestId("transaction-list")).toContainText("Groceries");
  await expect(page.getByTestId("transaction-list")).toContainText("42");
});

test("userCanSeeUpdatedRemainingBudgetOnDashboard", async ({ page }) => {
  await register(page, uniqueEmail("dashboard"));

  await page.getByRole("link", { name: "Budgets" }).click();
  await page.getByTestId("budget-month").fill("1");
  await page.getByTestId("budget-year").fill("2026");
  await page.getByTestId("budget-amount").fill("1000");
  await page.getByTestId("create-budget-button").click();

  await page.getByRole("link", { name: "Categories" }).click();
  await page.getByTestId("category-name").fill("Salary");
  await page.getByTestId("category-type").selectOption("income");
  await page.getByTestId("category-submit").click();
  await expect(page.getByTestId("category-list")).toContainText("Salary");
  await page.getByTestId("category-name").fill("Groceries");
  await page.getByTestId("category-type").selectOption("expense");
  await page.getByTestId("category-submit").click();
  await expect(page.getByTestId("category-list")).toContainText("Groceries");

  await page.getByRole("link", { name: "Transactions" }).click();
  await page.getByTestId("transaction-type").selectOption("income");
  await page.getByTestId("transaction-category").selectOption({ label: "Salary" });
  await page.getByTestId("transaction-amount").fill("500");
  await page.getByTestId("transaction-date").fill("2026-01-10");
  await page.getByTestId("transaction-submit").click();
  await expect(page.getByTestId("transaction-list")).toContainText("Salary");
  await page.getByTestId("transaction-type").selectOption("expense");
  await page.getByTestId("transaction-category").selectOption({ label: "Groceries" });
  await page.getByTestId("transaction-amount").fill("200");
  await page.getByTestId("transaction-date").fill("2026-01-11");
  await page.getByTestId("transaction-submit").click();

  await page.getByRole("link", { name: "Dashboard" }).click();
  await page.getByTestId("dashboard-month").fill("1");
  await page.getByTestId("dashboard-year").fill("2026");

  await expect(page.getByTestId("dashboard-remaining-budget")).toContainText("1,300");
});

test("userCannotAccessDashboardWithoutLogin", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/login/);
});
