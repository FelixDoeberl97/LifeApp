import { useEffect, useState } from "react";

const today = new Date().toISOString().slice(0, 10);

export default function TransactionForm({ categories, initialTransaction, onSubmit, onCancel }) {
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState(today);

  useEffect(() => {
    const firstCategory = categories.find((category) => category.type === "expense") ?? categories[0];
    setCategoryId(initialTransaction?.categoryId ?? firstCategory?.id ?? "");
    setType(initialTransaction?.type ?? firstCategory?.type ?? "expense");
    setAmount(initialTransaction?.amount ?? "");
    setDescription(initialTransaction?.description ?? "");
    setTransactionDate(initialTransaction?.transactionDate ?? today);
  }, [categories, initialTransaction]);

  function handleTypeChange(nextType) {
    setType(nextType);
    const matchingCategory = categories.find((category) => category.type === nextType);
    setCategoryId(matchingCategory?.id ?? "");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({ categoryId, type, amount, description, transactionDate });
    setAmount("");
    setDescription("");
  }

  const visibleCategories = categories.filter((category) => category.type === type);

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Type
        <select data-testid="transaction-type" value={type} onChange={(event) => handleTypeChange(event.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>
      <label>
        Category
        <select data-testid="transaction-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">Select category</option>
          {visibleCategories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </label>
      <label>
        Amount
        <input data-testid="transaction-amount" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
      </label>
      <label>
        Date
        <input data-testid="transaction-date" type="date" value={transactionDate} onChange={(event) => setTransactionDate(event.target.value)} />
      </label>
      <label className="wide-field">
        Description
        <input data-testid="transaction-description" maxLength="255" value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <div className="form-actions">
        <button data-testid="transaction-submit" type="submit" disabled={!categoryId}>{initialTransaction ? "Save" : "Create"}</button>
        {initialTransaction && <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
