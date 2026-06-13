import { describe, expect, it } from "vitest";
import { validateBudget } from "../../src/validators/budgetValidator.js";
import { validateCategory } from "../../src/validators/categoryValidator.js";
import { validateTransaction } from "../../src/validators/transactionValidator.js";

describe("budget validator", () => {
  it("validateBudget_ShouldRejectAmountLessThanOrEqualZero", () => {
    const result = validateBudget({ month: 1, year: 2026, amount: 0 });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Amount must be greater than 0.");
  });

  it("validateBudget_ShouldRejectInvalidMonth", () => {
    const result = validateBudget({ month: 13, year: 2026, amount: 100 });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Month must be between 1 and 12.");
  });

  it("validateBudget_ShouldRejectInvalidYear", () => {
    const result = validateBudget({ month: 1, year: 1999, amount: 100 });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Year must be between 2000 and 2100.");
  });
});

describe("category validator", () => {
  it("validateCategory_ShouldRejectEmptyName", () => {
    const result = validateCategory({ name: "", type: "expense" });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Name must not be empty.");
  });

  it("validateCategory_ShouldRejectInvalidType", () => {
    const result = validateCategory({ name: "Salary", type: "other" });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Type must be income or expense.");
  });
});

describe("transaction validator", () => {
  it("validateTransaction_ShouldRejectNegativeAmount", () => {
    const result = validateTransaction({
      categoryId: 1,
      type: "expense",
      amount: -5,
      description: "",
      transactionDate: "2026-01-01"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Amount must be greater than 0.");
  });

  it("validateTransaction_ShouldRejectInvalidType", () => {
    const result = validateTransaction({
      categoryId: 1,
      type: "other",
      amount: 5,
      description: "",
      transactionDate: "2026-01-01"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Type must be income or expense.");
  });

  it("validateTransaction_ShouldRejectTooLongDescription", () => {
    const result = validateTransaction({
      categoryId: 1,
      type: "expense",
      amount: 5,
      description: "a".repeat(256),
      transactionDate: "2026-01-01"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Description must not be longer than 255 characters.");
  });
});
