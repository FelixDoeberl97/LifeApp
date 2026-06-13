import { useEffect, useState } from "react";

const currentDate = new Date();

export default function BudgetForm({ initialBudget, onSubmit, onCancel }) {
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [amount, setAmount] = useState("");

  useEffect(() => {
    setMonth(initialBudget?.month ?? currentDate.getMonth() + 1);
    setYear(initialBudget?.year ?? currentDate.getFullYear());
    setAmount(initialBudget?.amount ?? "");
  }, [initialBudget]);

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({ month, year, amount });
    setAmount("");
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Month
        <input data-testid="budget-month" type="number" min="1" max="12" value={month} onChange={(event) => setMonth(event.target.value)} />
      </label>
      <label>
        Year
        <input data-testid="budget-year" type="number" min="2000" max="2100" value={year} onChange={(event) => setYear(event.target.value)} />
      </label>
      <label>
        Amount
        <input data-testid="budget-amount" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
      </label>
      <div className="form-actions">
        <button data-testid="create-budget-button" type="submit">{initialBudget ? "Save" : "Create"}</button>
        {initialBudget && <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
