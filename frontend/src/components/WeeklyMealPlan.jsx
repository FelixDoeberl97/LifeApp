import { useEffect, useState } from "react";
import { CreateEmptyMealPlan, GetMealPlanByWeekStartDate, SaveMealPlan } from "../services/mealPlanService.js";
import { FormatDate, GetWeekStartDate } from "../utils/dateUtils.js";

export default function WeeklyMealPlan({ dishes }) {
  const [weekStartDate, setWeekStartDate] = useState(GetWeekStartDate(new Date()));
  const [entries, setEntries] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const mealPlan = GetMealPlanByWeekStartDate(weekStartDate);
    setEntries(mealPlan.entries);
    setStatusMessage("");
  }, [weekStartDate]);

  function changeWeek(dayDifference) {
    const nextDate = new Date(weekStartDate);
    nextDate.setDate(nextDate.getDate() + dayDifference);
    setWeekStartDate(GetWeekStartDate(nextDate));
  }

  function updateEntry(date, dishId) {
    const nextEntries = entries.map((entry) => (
      entry.date === date ? { ...entry, dishId: dishId || null } : entry
    ));
    setEntries(nextEntries);
  }

  function saveMealPlan() {
    const planEntries = entries.length === 7 ? entries : CreateEmptyMealPlan(weekStartDate).entries;
    SaveMealPlan(weekStartDate, planEntries);
    setStatusMessage("Wochenplan gespeichert.");
  }

  return (
    <section className="data-panel">
      <div className="section-header">
        <h2>Wochenplan</h2>
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={() => changeWeek(-7)}>Vorwoche</button>
          <button type="button" className="secondary-button" onClick={() => changeWeek(7)}>Naechste Woche</button>
          <button type="button" onClick={saveMealPlan}>Speichern</button>
        </div>
      </div>
      <p>Woche ab {FormatDate(weekStartDate)}</p>
      {statusMessage && <p className="notice">{statusMessage}</p>}
      <div className="meal-plan-grid">
        {entries.map((entry) => (
          <label className="meal-plan-day" key={entry.date}>
            <span>{FormatDate(entry.date)}</span>
            <select value={entry.dishId ?? ""} onChange={(event) => updateEntry(entry.date, event.target.value)}>
              <option value="">Kein Gericht</option>
              {dishes.map((dish) => (
                <option key={dish.id} value={dish.id}>{dish.name}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </section>
  );
}
