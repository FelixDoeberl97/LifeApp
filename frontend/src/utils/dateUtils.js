export function GetTodayDateString() {
  return ToDateString(new Date());
}

export function GetWeekStartDate(date) {
  const parsedDate = new Date(date);
  const day = parsedDate.getDay();
  const distanceToMonday = day === 0 ? -6 : 1 - day;
  parsedDate.setDate(parsedDate.getDate() + distanceToMonday);
  return ToDateString(parsedDate);
}

export function GetWeekDays(weekStartDate) {
  const startDate = new Date(weekStartDate);

  return Array.from({ length: 7 }, (_, index) => {
    const nextDate = new Date(startDate);
    nextDate.setDate(startDate.getDate() + index);
    return ToDateString(nextDate);
  });
}

export function GetMonthDays(year, month) {
  const firstDate = new Date(year, month - 1, 1);
  const days = [];

  while (firstDate.getMonth() === month - 1) {
    days.push(ToDateString(firstDate));
    firstDate.setDate(firstDate.getDate() + 1);
  }

  return days;
}

export function FormatDate(dateString) {
  return new Intl.DateTimeFormat("de-AT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(dateString));
}

function ToDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
