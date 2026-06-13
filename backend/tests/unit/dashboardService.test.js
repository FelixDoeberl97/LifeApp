import { describe, expect, it } from "vitest";
import {
  calculateRemainingBudget,
  groupTransactionsByCategory
} from "../../src/services/dashboardService.js";

describe("dashboard service", () => {
  it("calculateRemainingBudget_ShouldReturnBudgetPlusIncomeMinusExpenses", () => {
    const result = calculateRemainingBudget(1000, 500, 300);

    expect(result).toBe(1200);
  });

  it("groupTransactionsByCategory_ShouldReturnCorrectCategoryTotals", () => {
    const transactions = [
      { categoryName: "Groceries", type: "expense", amount: 20 },
      { categoryName: "Groceries", type: "expense", amount: 30 },
      { categoryName: "Salary", type: "income", amount: 100 }
    ];

    const result = groupTransactionsByCategory(transactions, "expense");

    expect(result).toEqual({ Groceries: 50 });
  });
});
