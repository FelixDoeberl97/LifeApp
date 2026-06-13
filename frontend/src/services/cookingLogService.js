import { GetItems, SetItems } from "./storageService.js";

const cookingLogsStorageKey = "cookingLogs";

export function CreateCookingLog(date, dishId) {
  const cookingLogs = GetItems(cookingLogsStorageKey);
  const cookingLog = {
    id: CreateId(),
    date,
    dishId,
    createdAtUtc: new Date().toISOString()
  };

  SetItems(cookingLogsStorageKey, [...cookingLogs, cookingLog]);
  return cookingLog;
}

export function GetRecentCookingLogs(take = 20) {
  return GetItems(cookingLogsStorageKey)
    .sort(CompareCookingLogsDescending)
    .slice(0, take);
}

export function GetCookingLogsByDate(date) {
  return GetItems(cookingLogsStorageKey)
    .filter((cookingLog) => cookingLog.date === date)
    .sort(CompareCookingLogsDescending);
}

export function GetCookingLogsByMonth(year, month) {
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
  return GetItems(cookingLogsStorageKey)
    .filter((cookingLog) => cookingLog.date.startsWith(monthPrefix))
    .sort(CompareCookingLogsDescending);
}

function CompareCookingLogsDescending(firstCookingLog, secondCookingLog) {
  const firstKey = `${firstCookingLog.date}-${firstCookingLog.createdAtUtc}`;
  const secondKey = `${secondCookingLog.date}-${secondCookingLog.createdAtUtc}`;
  return secondKey.localeCompare(firstKey);
}

function CreateId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}
