export function GetItems(storageKey) {
  const rawItems = localStorage.getItem(storageKey);

  if (!rawItems) {
    return [];
  }

  try {
    const parsedItems = JSON.parse(rawItems);
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch {
    return [];
  }
}

export function SetItems(storageKey, items) {
  localStorage.setItem(storageKey, JSON.stringify(items));
}
