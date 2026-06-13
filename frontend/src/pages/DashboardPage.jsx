import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient.js";
import SummaryCard from "../components/SummaryCard.jsx";

const currentDate = new Date();

export default function DashboardPage() {
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [summary, setSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadDashboard();
  }, [month, year]);

  async function loadDashboard() {
    setErrorMessage("");

    try {
      const result = await apiRequest(`/dashboard?month=${month}&year=${year}`);
      setSummary(result);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Monthly summary for the selected period.</p>
        </div>
        <div className="period-picker">
          <input data-testid="dashboard-month" type="number" min="1" max="12" value={month} onChange={(event) => setMonth(event.target.value)} />
          <input data-testid="dashboard-year" type="number" min="2000" max="2100" value={year} onChange={(event) => setYear(event.target.value)} />
        </div>
      </div>
      {errorMessage && <p className="error-message" data-testid="api-error">{errorMessage}</p>}
      {summary && (
        <>
          <div className="summary-grid">
            <SummaryCard label="Monthly budget" value={formatMoney(summary.monthlyBudget)} testId="dashboard-monthly-budget" />
            <SummaryCard label="Income" value={formatMoney(summary.totalIncome)} testId="dashboard-total-income" />
            <SummaryCard label="Expenses" value={formatMoney(summary.totalExpenses)} testId="dashboard-total-expenses" />
            <SummaryCard label="Remaining" value={formatMoney(summary.remainingBudget)} testId="dashboard-remaining-budget" />
            <SummaryCard label="Transactions" value={summary.transactionCount} testId="dashboard-transaction-count" />
          </div>
          <div className="two-column">
            <CategoryTotals title="Expenses by category" totals={summary.expenseByCategory} />
            <CategoryTotals title="Income by category" totals={summary.incomeByCategory} />
          </div>
        </>
      )}
    </section>
  );
}

function CategoryTotals({ title, totals }) {
  const entries = Object.entries(totals);

  return (
    <section className="data-panel">
      <h2>{title}</h2>
      {entries.length === 0 && <p>No values for this month.</p>}
      {entries.map(([categoryName, amount]) => (
        <div className="total-row" key={categoryName}>
          <span>{categoryName}</span>
          <strong>{formatMoney(amount)}</strong>
        </div>
      ))}
    </section>
  );
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(Number(value));
}
