import { ApiError } from "./apiError.js";
import { validateBudget } from "../validators/budgetValidator.js";
import {
  createBudget,
  deleteBudget,
  getBudgetById,
  getBudgetByMonth,
  getBudgetsByUser,
  updateBudget
} from "../repositories/budgetRepository.js";

export async function getBudgets(database, userId) {
  return getBudgetsByUser(database, userId);
}

export async function createUserBudget(database, userId, budgetData) {
  validateBudgetOrThrow(budgetData);

  const existingBudget = await getBudgetByMonth(
    database,
    userId,
    Number(budgetData.month),
    Number(budgetData.year)
  );

  if (existingBudget) {
    throw new ApiError(409, "A budget for this month and year already exists.");
  }

  return createBudget(database, userId, budgetData);
}

export async function updateUserBudget(database, userId, budgetId, budgetData) {
  validateBudgetOrThrow(budgetData);

  const existingBudget = await getBudgetById(database, userId, budgetId);

  if (!existingBudget) {
    throw new ApiError(404, "Budget not found.");
  }

  const duplicateBudget = await getBudgetByMonth(
    database,
    userId,
    Number(budgetData.month),
    Number(budgetData.year)
  );

  if (duplicateBudget && duplicateBudget.id !== Number(budgetId)) {
    throw new ApiError(409, "A budget for this month and year already exists.");
  }

  return updateBudget(database, userId, budgetId, budgetData);
}

export async function deleteUserBudget(database, userId, budgetId) {
  const wasDeleted = await deleteBudget(database, userId, budgetId);

  if (!wasDeleted) {
    throw new ApiError(404, "Budget not found.");
  }

  return { deleted: true };
}

function validateBudgetOrThrow(budgetData) {
  const validation = validateBudget(budgetData);

  if (!validation.isValid) {
    throw new ApiError(400, validation.errors.join(" "));
  }
}
