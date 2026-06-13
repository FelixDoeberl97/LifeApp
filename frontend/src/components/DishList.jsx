export default function DishList({ dishes, onEdit, onDelete, onCookToday }) {
  if (dishes.length === 0) {
    return <p className="notice">Keine Gerichte vorhanden.</p>;
  }

  return (
    <div className="dish-grid">
      {dishes.map((dish) => (
        <article className="dish-card" key={dish.id}>
          <div>
            <h3>{dish.name}</h3>
            <p>{dish.durationMinutes} Minuten · {dish.difficulty} · {dish.category}</p>
          </div>
          <div className="ingredient-list">
            {dish.baseIngredients.length === 0 && <span className="muted-text">Keine Grundzutaten</span>}
            {dish.baseIngredients.map((ingredient) => (
              <span className="ingredient-label" key={ingredient}>{ingredient}</span>
            ))}
          </div>
          <div className="card-actions">
            <button type="button" onClick={() => onCookToday(dish.id)}>Heute gekocht</button>
            <button type="button" className="secondary-button" onClick={() => onEdit(dish)}>Bearbeiten</button>
            <button type="button" className="danger-button" onClick={() => onDelete(dish.id)}>Loeschen</button>
          </div>
        </article>
      ))}
    </div>
  );
}
