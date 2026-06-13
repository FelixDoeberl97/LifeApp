import { useMemo, useState } from "react";
import { GetCookingLogsByDate, GetCookingLogsByMonth } from "../services/cookingLogService.js";
import { FormatDate, GetMonthDays } from "../utils/dateUtils.js";

export default function CookingCalendar({ dishes, refreshKey }) {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(null);
  const monthDays = GetMonthDays(year, month);
  const monthLogs = useMemo(() => GetCookingLogsByMonth(year, month), [year, month, refreshKey]);
  const markedDates = new Set(monthLogs.map((cookingLog) => cookingLog.date));
  const selectedLogs = selectedDate ? GetCookingLogsByDate(selectedDate) : [];

  function changeMonth(monthDifference) {
    const nextDate = new Date(year, month - 1 + monthDifference, 1);
    setYear(nextDate.getFullYear());
    setMonth(nextDate.getMonth() + 1);
    setSelectedDate(null);
  }

  function getDishName(dishId) {
    return dishes.find((dish) => dish.id === dishId)?.name ?? "Unbekanntes Gericht";
  }

  return (
    <section className="data-panel">
      <div className="section-header">
        <h2>Kalender</h2>
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={() => changeMonth(-1)}>Vorheriger Monat</button>
          <button type="button" className="secondary-button" onClick={() => changeMonth(1)}>Naechster Monat</button>
        </div>
      </div>
      <p>{new Intl.DateTimeFormat("de-AT", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1))}</p>
      <div className="calendar-grid">
        {monthDays.map((date) => (
          <button
            type="button"
            className={markedDates.has(date) ? "calendar-day has-log" : "calendar-day"}
            key={date}
            onClick={() => setSelectedDate(date)}
          >
            {Number(date.slice(8, 10))}
          </button>
        ))}
      </div>
      <div className="calendar-details">
        <h3>{selectedDate ? FormatDate(selectedDate) : "Kein Datum ausgewaehlt"}</h3>
        {selectedDate && selectedLogs.length === 0 && <p>Keine gekochten Gerichte an diesem Tag.</p>}
        {selectedLogs.map((cookingLog) => (
          <p key={cookingLog.id}>{getDishName(cookingLog.dishId)}</p>
        ))}
      </div>
    </section>
  );
}
