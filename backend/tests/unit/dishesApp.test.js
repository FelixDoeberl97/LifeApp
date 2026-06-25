import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateDish, GetDishes, GetRandomDish, UpdateDish } from "../../../frontend/src/services/dishService.js";
import { CreateEmptyMealPlan } from "../../../frontend/src/services/mealPlanService.js";
import { CleanIngredients, ValidateDish } from "../../../frontend/src/utils/validationUtils.js";

function CreateLocalStorageMock() {
  const storage = new Map();

  return {
    getItem(storageKey) {
      return storage.has(storageKey) ? storage.get(storageKey) : null;
    },
    setItem(storageKey, value) {
      storage.set(storageKey, String(value));
    },
    clear() {
      storage.clear();
    }
  };
}

describe("dishes app unit tests", () => {
  beforeEach(() => {
    globalThis.localStorage = CreateLocalStorageMock();
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("test-id");
  });

  it("CleanIngredients_ShouldTrimIngredientsAndRemoveEmptyValues", () => {
    const result = CleanIngredients(["  Rice ", "", "  ", "Beans"]);

    expect(result).toEqual(["Rice", "Beans"]);
  });

  it("ValidateDish_ShouldAcceptValidDish", () => {
    const result = ValidateDish({
      name: "Vegetable Curry",
      durationMinutes: 45,
      difficulty: "Medium",
      category: "Dinner"
    });

    expect(result).toEqual({
      isValid: true,
      errors: []
    });
  });

  it("ValidateDish_ShouldRejectInvalidDurationDifficultyAndCategory", () => {
    const result = ValidateDish({
      name: "Soup",
      durationMinutes: 0,
      difficulty: "Simple",
      category: "Breakfast"
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Dauer muss zwischen 1 und 600 Minuten liegen.");
    expect(result.errors).toContain("Schwierigkeit ist ungueltig.");
    expect(result.errors).toContain("Kategorie ist ungueltig.");
  });

  it("CreateDish_ShouldCleanDishDataAndStoreDish", () => {
    const result = CreateDish({
      name: "  Pasta  ",
      durationMinutes: "30",
      difficulty: "Easy",
      category: "Lunch",
      baseIngredients: [" Noodles ", "", "Tomato"]
    });

    expect(result).toEqual({
      id: "test-id",
      name: "Pasta",
      durationMinutes: 30,
      difficulty: "Easy",
      category: "Lunch",
      baseIngredients: ["Noodles", "Tomato"]
    });
    expect(GetDishes()).toEqual([result]);
  });

  it("UpdateDish_ShouldUpdateExistingDishAndKeepId", () => {
    const createdDish = CreateDish({
      name: "Pasta",
      durationMinutes: 30,
      difficulty: "Easy",
      category: "Lunch",
      baseIngredients: ["Noodles"]
    });

    const result = UpdateDish(createdDish.id, {
      name: "Pasta Bake",
      durationMinutes: 50,
      difficulty: "Medium",
      category: "Dinner",
      baseIngredients: ["Noodles", "Cheese"]
    });

    expect(result).toEqual({
      id: createdDish.id,
      name: "Pasta Bake",
      durationMinutes: 50,
      difficulty: "Medium",
      category: "Dinner",
      baseIngredients: ["Noodles", "Cheese"]
    });
  });

  it("GetRandomDish_ShouldReturnNullForEmptyDishList", () => {
    const result = GetRandomDish([]);

    expect(result).toBeNull();
  });

  it("CreateEmptyMealPlan_ShouldCreateSevenEntriesFromWeekStartDate", () => {
    const result = CreateEmptyMealPlan("2026-06-22");

    expect(result).toEqual({
      id: "test-id",
      weekStartDate: "2026-06-22",
      entries: [
        { date: "2026-06-22", dishId: null },
        { date: "2026-06-23", dishId: null },
        { date: "2026-06-24", dishId: null },
        { date: "2026-06-25", dishId: null },
        { date: "2026-06-26", dishId: null },
        { date: "2026-06-27", dishId: null },
        { date: "2026-06-28", dishId: null }
      ]
    });
  });
});
