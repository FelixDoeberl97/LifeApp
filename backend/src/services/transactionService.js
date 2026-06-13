import { ApiError } from "./apiError.js";
import { getCategoryById } from "../repositories/categoryRepository.js";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactionsByUser,
  updateTransaction
} from "../repositories/transactionRepository.js";
import { validateTransaction } from "../validators/transactionValidator.js";

export async function getTransactions(database, userId) {
  return getTransactionsByUser(database, userId);
}

export async function createUserTransaction(database, userId, transactionData) {
  await validateTransactionOrThrow(database, userId, transactionData);
  return createTransaction(database, userId, transactionData);
}

export async function updateUserTransaction(database, userId, transactionId, transactionData) {
  const existingTransaction = await getTransactionById(database, userId, transactionId);

  if (!existingTransaction) {
    throw new ApiError(404, "Transaction not found.");
  }

  await validateTransactionOrThrow(database, userId, transactionData);
  return updateTransaction(database, userId, transactionId, transactionData);
}

export async function deleteUserTransaction(database, userId, transactionId) {
  const wasDeleted = await deleteTransaction(database, userId, transactionId);

  if (!wasDeleted) {
    throw new ApiError(404, "Transaction not found.");
  }

  return { deleted: true };
}

async function validateTransactionOrThrow(database, userId, transactionData) {
  const validation = validateTransaction(transactionData);

  if (!validation.isValid) {
    throw new ApiError(400, validation.errors.join(" "));
  }

  const category = await getCategoryById(database, userId, Number(transactionData.categoryId));

  if (!category) {
    throw new ApiError(400, "Category must belong to the current user.");
  }

  if (category.type !== transactionData.type) {
    throw new ApiError(400, "Transaction type must match category type.");
  }
}
