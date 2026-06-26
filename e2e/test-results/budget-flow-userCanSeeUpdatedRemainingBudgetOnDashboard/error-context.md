# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: budget-flow.spec.js >> userCanSeeUpdatedRemainingBudgetOnDashboard
- Location: budget-flow.spec.js:59:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.selectOption: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('transaction-category')
    - locator resolved to <select data-testid="transaction-category">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    57 × waiting for element to be visible and enabled
       - did not find some options
     - retrying select option action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]: LifeApp
    - navigation "App wechseln" [ref=e6]:
      - link "BudgetFlow" [ref=e7] [cursor=pointer]:
        - /url: /budget/dashboard
      - link "Koch-Assistenz" [ref=e8] [cursor=pointer]:
        - /url: /dishes
    - navigation "Bereichsnavigation" [ref=e9]:
      - link "Start" [ref=e10] [cursor=pointer]:
        - /url: /
      - link "Dashboard" [ref=e11] [cursor=pointer]:
        - /url: /budget/dashboard
      - link "Budgets" [ref=e12] [cursor=pointer]:
        - /url: /budget/budgets
      - link "Categories" [ref=e13] [cursor=pointer]:
        - /url: /budget/categories
      - link "Transactions" [active] [ref=e14] [cursor=pointer]:
        - /url: /budget/transactions
    - button "Logout" [ref=e15] [cursor=pointer]
  - main [ref=e16]:
    - generic [ref=e17]:
      - generic [ref=e19]:
        - heading "Transactions" [level=1] [ref=e20]
        - paragraph [ref=e21]: Record income and expenses.
      - generic [ref=e23]:
        - generic [ref=e24]:
          - text: Type
          - combobox "Type" [ref=e25]:
            - option "Expense" [selected]
            - option "Income"
        - generic [ref=e26]:
          - text: Category
          - combobox "Category" [ref=e27]:
            - option "Select category"
            - option "Groceries" [selected]
        - generic [ref=e28]:
          - text: Amount
          - spinbutton "Amount" [ref=e29]
        - generic [ref=e30]:
          - text: Date
          - textbox "Date" [ref=e31]: 2026-06-25
        - generic [ref=e32]:
          - text: Description
          - textbox "Description" [ref=e33]
        - button "Create" [ref=e35] [cursor=pointer]
      - heading "Transaction list" [level=2] [ref=e37]
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | function uniqueEmail(prefix) {
  4   |   return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;
  5   | }
  6   | 
  7   | async function register(page, email) {
  8   |   await page.goto("/register");
  9   |   await page.getByTestId("register-email").fill(email);
  10  |   await page.getByTestId("register-password").fill("password123");
  11  |   await page.getByTestId("register-submit").click();
  12  |   await expect(page).toHaveURL(/dashboard/);
  13  | }
  14  | 
  15  | async function login(page, email) {
  16  |   await page.goto("/login");
  17  |   await page.getByTestId("login-email").fill(email);
  18  |   await page.getByTestId("login-password").fill("password123");
  19  |   await page.getByTestId("login-submit").click();
  20  |   await expect(page).toHaveURL(/dashboard/);
  21  | }
  22  | 
  23  | test("userCanRegisterLoginAndCreateBudget", async ({ page }) => {
  24  |   const email = uniqueEmail("budget");
  25  |   await register(page, email);
  26  |   await page.getByTestId("logout-button").click();
  27  |   await login(page, email);
  28  | 
  29  |   await page.getByRole("link", { name: "Budgets" }).click();
  30  |   await page.getByTestId("budget-month").fill("1");
  31  |   await page.getByTestId("budget-year").fill("2026");
  32  |   await page.getByTestId("budget-amount").fill("1500");
  33  |   await page.getByTestId("create-budget-button").click();
  34  | 
  35  |   await expect(page.getByTestId("budget-list")).toContainText("1/2026");
  36  |   await expect(page.getByTestId("budget-list")).toContainText("1,500");
  37  | });
  38  | 
  39  | test("userCanCreateCategoryAndTransaction", async ({ page }) => {
  40  |   await register(page, uniqueEmail("transaction"));
  41  | 
  42  |   await page.getByRole("link", { name: "Categories" }).click();
  43  |   await page.getByTestId("category-name").fill("Groceries");
  44  |   await page.getByTestId("category-type").selectOption("expense");
  45  |   await page.getByTestId("category-submit").click();
  46  |   await expect(page.getByTestId("category-list")).toContainText("Groceries");
  47  | 
  48  |   await page.getByRole("link", { name: "Transactions" }).click();
  49  |   await page.getByTestId("transaction-type").selectOption("expense");
  50  |   await page.getByTestId("transaction-category").selectOption({ label: "Groceries" });
  51  |   await page.getByTestId("transaction-amount").fill("42");
  52  |   await page.getByTestId("transaction-description").fill("Weekly groceries");
  53  |   await page.getByTestId("transaction-submit").click();
  54  | 
  55  |   await expect(page.getByTestId("transaction-list")).toContainText("Groceries");
  56  |   await expect(page.getByTestId("transaction-list")).toContainText("42");
  57  | });
  58  | 
  59  | test("userCanSeeUpdatedRemainingBudgetOnDashboard", async ({ page }) => {
  60  |   await register(page, uniqueEmail("dashboard"));
  61  | 
  62  |   await page.getByRole("link", { name: "Budgets" }).click();
  63  |   await page.getByTestId("budget-month").fill("1");
  64  |   await page.getByTestId("budget-year").fill("2026");
  65  |   await page.getByTestId("budget-amount").fill("1000");
  66  |   await page.getByTestId("create-budget-button").click();
  67  | 
  68  |   await page.getByRole("link", { name: "Categories" }).click();
  69  |   await page.getByTestId("category-name").fill("Salary");
  70  |   await page.getByTestId("category-type").selectOption("income");
  71  |   await page.getByTestId("category-submit").click();
  72  |   await expect(page.getByTestId("category-list")).toContainText("Salary");
  73  |   await page.getByTestId("category-name").fill("Groceries");
  74  |   await page.getByTestId("category-type").selectOption("expense");
  75  |   await page.getByTestId("category-submit").click();
  76  |   await expect(page.getByTestId("category-list")).toContainText("Groceries");
  77  | 
  78  |   await page.getByRole("link", { name: "Transactions" }).click();
  79  |   await page.getByTestId("transaction-type").selectOption("income");
> 80  |   await page.getByTestId("transaction-category").selectOption({ label: "Salary" });
      |                                                  ^ Error: locator.selectOption: Test timeout of 30000ms exceeded.
  81  |   await page.getByTestId("transaction-amount").fill("500");
  82  |   await page.getByTestId("transaction-date").fill("2026-01-10");
  83  |   await page.getByTestId("transaction-submit").click();
  84  |   await expect(page.getByTestId("transaction-list")).toContainText("Salary");
  85  |   await page.getByTestId("transaction-type").selectOption("expense");
  86  |   await page.getByTestId("transaction-category").selectOption({ label: "Groceries" });
  87  |   await page.getByTestId("transaction-amount").fill("200");
  88  |   await page.getByTestId("transaction-date").fill("2026-01-11");
  89  |   await page.getByTestId("transaction-submit").click();
  90  | 
  91  |   await page.getByRole("link", { name: "Dashboard" }).click();
  92  |   await page.getByTestId("dashboard-month").fill("1");
  93  |   await page.getByTestId("dashboard-year").fill("2026");
  94  | 
  95  |   await expect(page.getByTestId("dashboard-remaining-budget")).toContainText("1,300");
  96  | });
  97  | 
  98  | test("userCannotAccessDashboardWithoutLogin", async ({ page }) => {
  99  |   await page.goto("/dashboard");
  100 | 
  101 |   await expect(page).toHaveURL(/login/);
  102 | });
  103 | 
```