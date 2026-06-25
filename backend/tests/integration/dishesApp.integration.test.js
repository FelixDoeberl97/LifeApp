import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateCookingLog, GetCookingLogsByDate, GetCookingLogsByMonth, GetRecentCookingLogs } from "../../../frontend/src/services/cookingLogService.js";
import { CreateDish, DeleteDish, GetDishById, GetDishes, UpdateDish } from "../../../frontend/src/services/dishService.js";
import { GetMealPlanByWeekStartDate, SaveMealPlan } from "../../../frontend/src/services/mealPlanService.js";

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

function MockRandomIds(ids) {
  let index = 0;

  vi.spyOn(globalThis.crypto, "randomUUID").mockImplementation(() => {
    const id = ids[index] ?? ids[ids.length - 1];
    index += 1;
    return id;
  });
}

describe("dishes app integration tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    globalThis.localStorage = CreateLocalStorageMock();
  });

  it("CreateDishAndGetDishById_ShouldReturnStoredDish", () => {
    MockRandomIds(["dish-1"]);

    const dish = CreateDish({
      name: "Chili",
      durationMinutes: 40,
      difficulty: "Medium",
      category: "Dinner",
      baseIngredients: ["Beans"]
    });

    expect(GetDishById(dish.id)).toEqual(dish);
    expect(GetDishes()).toEqual([dish]);
  });

  it("UpdateDish_ShouldPersistChangesInDishList", () => {
    MockRandomIds(["dish-1"]);
    const dish = CreateDish({
      name: "Rice Bowl",
      durationMinutes: 25,
      difficulty: "Easy",
      category: "Lunch",
      baseIngredients: ["Rice"]
    });

    UpdateDish(dish.id, {
      name: "Rice Bowl Deluxe",
      durationMinutes: 35,
      difficulty: "Medium",
      category: "Dinner",
      baseIngredients: ["Rice", "Vegetables"]
    });

    expect(GetDishes()).toEqual([
      {
        id: "dish-1",
        name: "Rice Bowl Deluxe",
        durationMinutes: 35,
        difficulty: "Medium",
        category: "Dinner",
        baseIngredients: ["Rice", "Vegetables"]
      }
    ]);
  });

  it("DeleteDish_ShouldRemoveDishWithoutRemovingOtherDishes", () => {
    MockRandomIds(["dish-1", "dish-2"]);
    const firstDish = CreateDish({
      name: "Soup",
      durationMinutes: 20,
      difficulty: "Easy",
      category: "Lunch",
      baseIngredients: ["Carrots"]
    });
    const secondDish = CreateDish({
      name: "Curry",
      durationMinutes: 45,
      difficulty: "Medium",
      category: "Dinner",
      baseIngredients: ["Rice"]
    });

    DeleteDish(firstDish.id);

    expect(GetDishes()).toEqual([secondDish]);
    expect(GetDishById(firstDish.id)).toBeNull();
  });

  it("SaveMealPlanAndGetMealPlanByWeekStartDate_ShouldReturnSavedEntries", () => {
    MockRandomIds(["dish-1", "meal-plan-1"]);
    const dish = CreateDish({
      name: "Pasta",
      durationMinutes: 30,
      difficulty: "Easy",
      category: "Dinner",
      baseIngredients: ["Noodles"]
    });
    const entries = [
      { date: "2026-06-22", dishId: dish.id },
      { date: "2026-06-23", dishId: null }
    ];

    const savedMealPlan = SaveMealPlan("2026-06-22", entries);

    expect(GetMealPlanByWeekStartDate("2026-06-22")).toEqual(savedMealPlan);
  });

  it("CreateCookingLog_ShouldBeAvailableInRecentDateAndMonthQueries", () => {
    MockRandomIds(["dish-1", "log-1"]);
    vi.setSystemTime(new Date("2026-06-24T12:00:00.000Z"));
    const dish = CreateDish({
      name: "Salad",
      durationMinutes: 15,
      difficulty: "Easy",
      category: "Lunch",
      baseIngredients: ["Lettuce"]
    });

    const cookingLog = CreateCookingLog("2026-06-24", dish.id);

    expect(GetRecentCookingLogs()).toEqual([cookingLog]);
    expect(GetCookingLogsByDate("2026-06-24")).toEqual([cookingLog]);
    expect(GetCookingLogsByMonth(2026, 6)).toEqual([cookingLog]);
    vi.useRealTimers();
  });
});
