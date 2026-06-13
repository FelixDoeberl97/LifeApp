import { GetRecentCookingLogs } from "../services/cookingLogService.js";
import { FormatDate } from "../utils/dateUtils.js";

export default function RecentCookingLogs({ dishes, refreshKey }) {
  const cookingLogs = GetRecentCookingLogs(20);

  function getDish(dishId) {
    return dishes.find((dish) => dish.id === dishId);
  }

  return (
    <section className="data-panel">
      <h2>Zuletzt gekocht</h2>
      {cookingLogs.length === 0 && <p>Keine Eintraege vorhanden.</p>}
      <div className="recent-log-list" data-refresh-key={refreshKey}>
        {cookingLogs.map((cookingLog) => {
          const dish = getDish(cookingLog.dishId);
          return (
            <div className="total-row" key={cookingLog.id}>
              <span>{FormatDate(cookingLog.date)}</span>
              <strong>{dish?.name ?? "Unbekanntes Gericht"}</strong>
              <span>{dish?.category ?? ""}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
