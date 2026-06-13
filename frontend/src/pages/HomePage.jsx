import { Link } from "react-router-dom";

export default function HomePage({ isAuthenticated }) {
  return (
    <section className="home-page">
      <div className="page-header">
        <div>
          <h1>App-Auswahl</h1>
          <p>Waehle aus, welche Anwendung du oeffnen moechtest.</p>
        </div>
      </div>
      <div className="app-choice-grid">
        <article className="app-choice-card">
          <span>Haushalt</span>
          <h2>BudgetFlow</h2>
          <p>Verwalte Monatsbudgets, Kategorien, Einnahmen, Ausgaben und dein Dashboard.</p>
          <Link className="choice-button" to={isAuthenticated ? "/budget/dashboard" : "/budget/login"}>
            Haushaltsbudget oeffnen
          </Link>
        </article>
        <article className="app-choice-card">
          <span>Kueche</span>
          <h2>Koch-Assistenz</h2>
          <p>Verwalte Gerichte, plane Wochen, markiere gekochte Speisen und nutze den Kalender.</p>
          <Link className="choice-button" to={isAuthenticated ? "/dishes" : "/dishes/login"}>
            Gerichtsapp oeffnen
          </Link>
        </article>
      </div>
    </section>
  );
}
