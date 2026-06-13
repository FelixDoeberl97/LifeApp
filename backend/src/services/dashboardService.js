import { getBudgetByMonth } from "../repositories/budgetRepository.js";
import { getTransactionsByMonth } from "../repositories/transactionRepository.js";

export function calculateRemainingBudget(monthlyBudget, totalIncome, totalExpenses) {
  return Number(monthlyBudget) + Number(totalIncome) - Number(totalExpenses);
}

export function groupTransactionsByCategory(transactions, type) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((totals, transaction) => {
      const categoryName = transaction.categoryName;
      const existingTotal = totals[categoryName] ?? 0;
      totals[categoryName] = existingTotal + Number(transaction.amount);
      return totals;
    }, {});
}

export async function getDashboardSummary(database, userId, month, year) {
  const parsedMonth = Number(month);
  const parsedYear = Number(year);
  const budget = await getBudgetByMonth(database, userId, parsedMonth, parsedYear);
  const transactions = await getTransactionsByMonth(database, userId, parsedMonth, parsedYear);
  const monthlyBudget = Number(budget?.amount ?? 0);
  const totalIncome = sumTransactionsByType(transactions, "income");
  const totalExpenses = sumTransactionsByType(transactions, "expense");
  const remainingBudget = calculateRemainingBudget(monthlyBudget, totalIncome, totalExpenses);

  return {
    month: parsedMonth,
    year: parsedYear,
    monthlyBudget,
    totalIncome,
    totalExpenses,
    remainingBudget,
    expenseByCategory: groupTransactionsByCategory(transactions, "expense"),
    incomeByCategory: groupTransactionsByCategory(transactions, "income"),
    transactionCount: transactions.length
  };
}

function sumTransactionsByType(transactions, type) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
}
