import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient.js";
import CategoryForm from "../components/CategoryForm.jsx";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setCategories(await apiRequest("/categories"));
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function saveCategory(categoryData) {
    setErrorMessage("");

    try {
      if (editingCategory) {
        await apiRequest(`/categories/${editingCategory.id}`, { method: "PUT", body: JSON.stringify(categoryData) });
        setEditingCategory(null);
      } else {
        await apiRequest("/categories", { method: "POST", body: JSON.stringify(categoryData) });
      }

      await loadCategories();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function removeCategory(categoryId) {
    setErrorMessage("");

    try {
      await apiRequest(`/categories/${categoryId}`, { method: "DELETE" });
      await loadCategories();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Manage income and expense categories.</p>
        </div>
      </div>
      {errorMessage && <p className="error-message" data-testid="api-error">{errorMessage}</p>}
      <section className="data-panel">
        <CategoryForm initialCategory={editingCategory} onSubmit={saveCategory} onCancel={() => setEditingCategory(null)} />
      </section>
      <section className="data-panel">
        <h2>Category list</h2>
        <div className="table-list" data-testid="category-list">
          {categories.map((category) => (
            <div className="table-row" key={category.id}>
              <span>{category.name}</span>
              <strong>{category.type}</strong>
              <button data-testid={`edit-category-${category.id}`} onClick={() => setEditingCategory(category)}>Edit</button>
              <button data-testid={`delete-category-${category.id}`} className="danger-button" onClick={() => removeCategory(category.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
