import { GetItems, SetItems } from "./storageService.js";
import { GetWeekDays } from "../utils/dateUtils.js";

const mealPlansStorageKey = "weeklyMealPlans";

export function GetMealPlanByWeekStartDate(weekStartDate) {
  return GetItems(mealPlansStorageKey).find((mealPlan) => mealPlan.weekStartDate === weekStartDate)
    ?? CreateEmptyMealPlan(weekStartDate);
}

export function SaveMealPlan(weekStartDate, entries) {
  const mealPlans = GetItems(mealPlansStorageKey);
  const existingMealPlan = mealPlans.find((mealPlan) => mealPlan.weekStartDate === weekStartDate);
  const mealPlan = {
    id: existingMealPlan?.id ?? CreateId(),
    weekStartDate,
    entries
  };
  const updatedMealPlans = existingMealPlan
    ? mealPlans.map((currentMealPlan) => currentMealPlan.weekStartDate === weekStartDate ? mealPlan : currentMealPlan)
    : [...mealPlans, mealPlan];

  SetItems(mealPlansStorageKey, updatedMealPlans);
  return mealPlan;
}

export function CreateEmptyMealPlan(weekStartDate) {
  return {
    id: CreateId(),
    weekStartDate,
    entries: GetWeekDays(weekStartDate).map((date) => ({
      date,
      dishId: null
    }))
  };
}

function CreateId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}
