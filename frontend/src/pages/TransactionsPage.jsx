import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient.js";
import TransactionForm from "../components/TransactionForm.jsx";

export default function TransactionsPage() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    try {
      const [categoryResult, transactionResult] = await Promise.all([
        apiRequest("/categories"),
        apiRequest("/transactions")
      ]);
      setCategories(categoryResult);
      setTransactions(transactionResult);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function saveTransaction(transactionData) {
    setErrorMessage("");

    try {
      if (editingTransaction) {
        await apiRequest(`/transactions/${editingTransaction.id}`, { method: "PUT", body: JSON.stringify(transactionData) });
        setEditingTransaction(null);
      } else {
        await apiRequest("/transactions", { method: "POST", body: JSON.stringify(transactionData) });
      }

      await loadPageData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function removeTransaction(transactionId) {
    setErrorMessage("");

    try {
      await apiRequest(`/transactions/${transactionId}`, { method: "DELETE" });
      await loadPageData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>Record income and expenses.</p>
        </div>
      </div>
      {errorMessage && <p className="error-message" data-testid="api-error">{errorMessage}</p>}
      {categories.length === 0 && <p className="notice">Create at least one category before adding transactions.</p>}
      <section className="data-panel">
        <TransactionForm categories={categories} initialTransaction={editingTransaction} onSubmit={saveTransaction} onCancel={() => setEditingTransaction(null)} />
      </section>
      <section className="data-panel">
        <h2>Transaction list</h2>
        <div className="table-list" data-testid="transaction-list">
          {transactions.map((transaction) => (
            <div className="table-row" key={transaction.id}>
              <span>{transaction.transactionDate}</span>
              <span>{transaction.categoryName}</span>
              <strong>{formatMoney(transaction.amount)}</strong>
              <span>{transaction.type}</span>
              <button data-testid={`edit-transaction-${transaction.id}`} onClick={() => setEditingTransaction(transaction)}>Edit</button>
              <button data-testid={`delete-transaction-${transaction.id}`} className="danger-button" onClick={() => removeTransaction(transaction.id)}>Delete</button>
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
