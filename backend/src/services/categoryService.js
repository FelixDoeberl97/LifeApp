import { ApiError } from "./apiError.js";
import { validateCategory } from "../validators/categoryValidator.js";
import {
  createCategory,
  deleteCategory,
  getCategoriesByUser,
  getCategoryById,
  getCategoryByNameAndType,
  updateCategory
} from "../repositories/categoryRepository.js";

export async function getCategories(database, userId) {
  return getCategoriesByUser(database, userId);
}

export async function createUserCategory(database, userId, categoryData) {
  validateCategoryOrThrow(categoryData);

  const existingCategory = await getCategoryByNameAndType(
    database,
    userId,
    categoryData.name.trim(),
    categoryData.type
  );

  if (existingCategory) {
    throw new ApiError(409, "A category with this name and type already exists.");
  }

  return createCategory(database, userId, categoryData);
}

export async function updateUserCategory(database, userId, categoryId, categoryData) {
  validateCategoryOrThrow(categoryData);

  const existingCategory = await getCategoryById(database, userId, categoryId);

  if (!existingCategory) {
    throw new ApiError(404, "Category not found.");
  }

  const duplicateCategory = await getCategoryByNameAndType(
    database,
    userId,
    categoryData.name.trim(),
    categoryData.type
  );

  if (duplicateCategory && duplicateCategory.id !== Number(categoryId)) {
    throw new ApiError(409, "A category with this name and type already exists.");
  }

  return updateCategory(database, userId, categoryId, categoryData);
}

export async function deleteUserCategory(database, userId, categoryId) {
  const wasDeleted = await deleteCategory(database, userId, categoryId);

  if (!wasDeleted) {
    throw new ApiError(404, "Category not found.");
  }

  return { deleted: true };
}

function validateCategoryOrThrow(categoryData) {
  const validation = validateCategory(categoryData);

  if (!validation.isValid) {
    throw new ApiError(400, validation.errors.join(" "));
  }
}
