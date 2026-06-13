import { GetItems, SetItems } from "./storageService.js";
import { CleanIngredients, ValidateDish } from "../utils/validationUtils.js";

const dishesStorageKey = "dishes";

export function GetDishes() {
  return GetItems(dishesStorageKey);
}

export function CreateDish(dishData) {
  const cleanedDishData = CleanDishData(dishData);
  const validation = ValidateDish(cleanedDishData);

  if (!validation.isValid) {
    throw new Error(validation.errors.join(" "));
  }

  const dishes = GetDishes();
  const dish = {
    id: CreateId(),
    ...cleanedDishData
  };

  SetItems(dishesStorageKey, [...dishes, dish]);
  return dish;
}

export function UpdateDish(dishId, dishData) {
  const cleanedDishData = CleanDishData(dishData);
  const validation = ValidateDish(cleanedDishData);

  if (!validation.isValid) {
    throw new Error(validation.errors.join(" "));
  }

  const dishes = GetDishes();
  const updatedDishes = dishes.map((dish) => (
    dish.id === dishId ? { ...dish, ...cleanedDishData } : dish
  ));

  SetItems(dishesStorageKey, updatedDishes);
  return updatedDishes.find((dish) => dish.id === dishId);
}

export function DeleteDish(dishId) {
  const dishes = GetDishes().filter((dish) => dish.id !== dishId);
  SetItems(dishesStorageKey, dishes);
}

export function GetDishById(dishId) {
  return GetDishes().find((dish) => dish.id === dishId) ?? null;
}

export function GetRandomDish(dishes) {
  if (dishes.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * dishes.length);
  return dishes[randomIndex];
}

function CleanDishData(dishData) {
  return {
    name: String(dishData.name ?? "").trim(),
    durationMinutes: Number(dishData.durationMinutes),
    difficulty: dishData.difficulty,
    category: dishData.category,
    baseIngredients: CleanIngredients(dishData.baseIngredients ?? [])
  };
}

function CreateId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}
