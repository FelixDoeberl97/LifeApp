import { useState } from "react";

export default function MealReadyNotification() {
  const [statusMessage, setStatusMessage] = useState("");

  async function sendMealReadyNotification() {
    if (!("Notification" in window)) {
      setStatusMessage("Benachrichtigungen werden von diesem Browser nicht unterstuetzt.");
      return;
    }

    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
      new Notification("Essen fertig", {
        body: "Dein Essen ist fertig. Mahlzeit!"
      });
      setStatusMessage("Benachrichtigung gesendet.");
      return;
    }

    setStatusMessage("Benachrichtigungen sind nicht erlaubt.");
  }

  return (
    <section className="data-panel">
      <div className="section-header">
        <h2>Essen fertig</h2>
        <button type="button" onClick={sendMealReadyNotification}>Notifikation senden</button>
      </div>
      {statusMessage && <p className="notice">{statusMessage}</p>}
    </section>
  );
}
