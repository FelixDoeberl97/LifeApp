import { NavLink, useLocation } from "react-router-dom";

export default function Navigation({ onLogout }) {
  const location = useLocation();
  const isBudgetArea = location.pathname.startsWith("/budget");
  const isDishesArea = location.pathname.startsWith("/dishes");

  return (
    <header className="top-navigation">
      <div className="brand">LifeApp</div>
      <nav className="app-switcher" aria-label="App wechseln">
        <NavLink className={isBudgetArea ? "active" : ""} to="/budget/dashboard">BudgetFlow</NavLink>
        <NavLink className={isDishesArea ? "active" : ""} to="/dishes">Koch-Assistenz</NavLink>
      </nav>
      <nav className="section-navigation" aria-label="Bereichsnavigation">
        <NavLink to="/">Start</NavLink>
        <NavLink to="/budget/dashboard">Dashboard</NavLink>
        <NavLink to="/budget/budgets">Budgets</NavLink>
        <NavLink to="/budget/categories">Categories</NavLink>
        <NavLink to="/budget/transactions">Transactions</NavLink>
      </nav>
      <button data-testid="logout-button" onClick={onLogout}>Logout</button>
    </header>
  );
}
