import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CookingCalendar from "../components/CookingCalendar.jsx";
import DishForm from "../components/DishForm.jsx";
import DishList from "../components/DishList.jsx";
import MealReadyNotification from "../components/MealReadyNotification.jsx";
import RandomDishPicker from "../components/RandomDishPicker.jsx";
import RecentCookingLogs from "../components/RecentCookingLogs.jsx";
import WeeklyMealPlan from "../components/WeeklyMealPlan.jsx";
import { CreateCookingLog } from "../services/cookingLogService.js";
import { CreateDish, DeleteDish, GetDishes, UpdateDish } from "../services/dishService.js";
import { GetTodayDateString } from "../utils/dateUtils.js";

const tabs = [
  { id: "dishes", label: "Gerichte" },
  { id: "plan", label: "Wochenplan" },
  { id: "calendar", label: "Kalender" },
  { id: "recent", label: "Zuletzt gekocht" },
  { id: "notification", label: "Essen fertig" }
];

export default function DishesPage() {
  const [activeTab, setActiveTab] = useState("dishes");
  const [dishes, setDishes] = useState([]);
  const [editingDish, setEditingDish] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadDishes();
  }, []);

  function loadDishes() {
    setDishes(GetDishes());
  }

  function showCreateForm() {
    setEditingDish(null);
    setIsFormVisible(true);
    setStatusMessage("");
  }

  function editDish(dish) {
    setEditingDish(dish);
    setIsFormVisible(true);
    setStatusMessage("");
  }

  function saveDish(dishData) {
    if (editingDish) {
      UpdateDish(editingDish.id, dishData);
      setStatusMessage("Gericht aktualisiert.");
    } else {
      CreateDish(dishData);
      setStatusMessage("Gericht erstellt.");
    }

    setEditingDish(null);
    setIsFormVisible(false);
    loadDishes();
  }

  function deleteDish(dishId) {
    const shouldDelete = window.confirm("Soll dieses Gericht wirklich geloescht werden?");

    if (!shouldDelete) {
      return;
    }

    DeleteDish(dishId);
    loadDishes();
    setRefreshKey((currentRefreshKey) => currentRefreshKey + 1);
    setStatusMessage("Gericht geloescht.");
  }

  function cookToday(dishId) {
    CreateCookingLog(GetTodayDateString(), dishId);
    setRefreshKey((currentRefreshKey) => currentRefreshKey + 1);
    setStatusMessage("Als heute gekocht markiert.");
  }

  return (
    <section className="dishes-app">
      <div className="page-header">
        <div>
          <h1>Koch-Assistenz</h1>
          <p>Entscheide schneller, was gekocht wird, und behalte deine Koch-Historie im Blick.</p>
        </div>
        <Link className="secondary-link-button" to="/">Zur App-Auswahl</Link>
      </div>
      <div className="dishes-tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            className={activeTab === tab.id ? "active-tab" : "secondary-button"}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {statusMessage && <p className="notice">{statusMessage}</p>}
      {activeTab === "dishes" && (
        <>
          <section className="data-panel">
            <div className="section-header">
              <h2>Gerichte</h2>
              <button type="button" onClick={showCreateForm}>Gericht hinzufuegen</button>
            </div>
          </section>
          <RandomDishPicker dishes={dishes} />
          {isFormVisible && (
            <DishForm
              dish={editingDish}
              onSave={saveDish}
              onCancel={() => {
                setEditingDish(null);
                setIsFormVisible(false);
              }}
            />
          )}
          <DishList dishes={dishes} onEdit={editDish} onDelete={deleteDish} onCookToday={cookToday} />
        </>
      )}
      {activeTab === "plan" && <WeeklyMealPlan dishes={dishes} />}
      {activeTab === "calendar" && <CookingCalendar dishes={dishes} refreshKey={refreshKey} />}
      {activeTab === "recent" && <RecentCookingLogs dishes={dishes} refreshKey={refreshKey} />}
      {activeTab === "notification" && <MealReadyNotification />}
    </section>
  );
}
