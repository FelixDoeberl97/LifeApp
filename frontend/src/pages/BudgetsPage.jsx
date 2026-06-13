import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient.js";
import BudgetForm from "../components/BudgetForm.jsx";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadBudgets();
  }, []);

  async function loadBudgets() {
    try {
      setBudgets(await apiRequest("/budgets"));
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function saveBudget(budgetData) {
    setErrorMessage("");

    try {
      if (editingBudget) {
        await apiRequest(`/budgets/${editingBudget.id}`, { method: "PUT", body: JSON.stringify(budgetData) });
        setEditingBudget(null);
      } else {
        await apiRequest("/budgets", { method: "POST", body: JSON.stringify(budgetData) });
      }

      await loadBudgets();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function removeBudget(budgetId) {
    setErrorMessage("");

    try {
      await apiRequest(`/budgets/${budgetId}`, { method: "DELETE" });
      await loadBudgets();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Budgets</h1>
          <p>Create one budget per month.</p>
        </div>
      </div>
      {errorMessage && <p className="error-message" data-testid="api-error">{errorMessage}</p>}
      <section className="data-panel">
        <BudgetForm initialBudget={editingBudget} onSubmit={saveBudget} onCancel={() => setEditingBudget(null)} />
      </section>
      <section className="data-panel">
        <h2>Budget list</h2>
        <div className="table-list" data-testid="budget-list">
          {budgets.map((budget) => (
            <div className="table-row" key={budget.id}>
              <span>{budget.month}/{budget.year}</span>
              <strong>{formatMoney(budget.amount)}</strong>
              <button data-testid={`edit-budget-${budget.id}`} onClick={() => setEditingBudget(budget)}>Edit</button>
              <button data-testid={`delete-budget-${budget.id}`} className="danger-button" onClick={() => removeBudget(budget.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(Number(value));
}
