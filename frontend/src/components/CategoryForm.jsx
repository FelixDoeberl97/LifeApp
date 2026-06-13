import { useEffect, useState } from "react";

export default function CategoryForm({ initialCategory, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");

  useEffect(() => {
    setName(initialCategory?.name ?? "");
    setType(initialCategory?.type ?? "expense");
  }, [initialCategory]);

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({ name, type });
    setName("");
    setType("expense");
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Name
        <input data-testid="category-name" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        Type
        <select data-testid="category-type" value={type} onChange={(event) => setType(event.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>
      <div className="form-actions">
        <button data-testid="category-submit" type="submit">{initialCategory ? "Save" : "Create"}</button>
        {initialCategory && <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
