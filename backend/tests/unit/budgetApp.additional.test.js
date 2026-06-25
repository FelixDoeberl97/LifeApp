import { describe, expect, it } from "vitest";
import { validateBudget } from "../../src/validators/budgetValidator.js";
import { validateCategory } from "../../src/validators/categoryValidator.js";
import { validateTransaction } from "../../src/validators/transactionValidator.js";
import {
  calculateRemainingBudget,
  groupTransactionsByCategory
} from "../../src/services/dashboardService.js";

describe("budget app additional unit tests", () => {
  it("validateBudget_ShouldAcceptValidBudget", () => {
    const result = validateBudget({ month: 6, year: 2026, amount: 1500 });

    expect(result).toEqual({
      isValid: true,
      errors: []
    });
  });

  it("validateBudget_ShouldRejectNonNumericAmount", () => {
    const result = validateBudget({ month: 6, year: 2026, amount: "abc" });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Amount must be greater than 0.");
  });

  it("validateCategory_ShouldTrimNameAndAcceptValidExpense", () => {
    const result = validateCategory({ name: "  Food  ", type: "expense" });

    expect(result).toEqual({
      isValid: true,
      errors: []
    });
  });

  it("validateTransaction_ShouldAcceptValidIncomeTransaction", () => {
    const result = validateTransaction({
      categoryId: 1,
      type: "income",
      amount: "250.50",
      description: "Bonus",
      transactionDate: "2026-06-24"
    });

    expect(result).toEqual({
      isValid: true,
      errors: []
    });
  });

  it("validateTransaction_ShouldRejectMissingDate", () => {
    const result = validateTransaction({
      categoryId: 1,
      type: "expense",
      amount: 25,
      description: "Groceries",
      transactionDate: ""
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Transaction date must be a valid date.");
  });

  it("calculateRemainingBudget_ShouldHandleNumericStrings", () => {
    const result = calculateRemainingBudget("1000", "250.50", "100.25");

    expect(result).toBe(1150.25);
  });

  it("groupTransactionsByCategory_ShouldIgnoreOtherTransactionTypes", () => {
    const transactions = [
      { categoryName: "Food", type: "expense", amount: 30 },
      { categoryName: "Food", type: "income", amount: 100 },
      { categoryName: "Rent", type: "expense", amount: "700" }
    ];

    const result = groupTransactionsByCategory(transactions, "expense");

    expect(result).toEqual({
      Food: 30,
      Rent: 700
    });
  });
});
