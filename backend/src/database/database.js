import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

let database;

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const defaultDatabasePath = path.join(currentDirectory, "../../data/budget-flow.db");

export async function initializeDatabase(databasePath = process.env.DB_FILE || defaultDatabasePath) {
  if (database) {
    return database;
  }

  if (databasePath !== ":memory:") {
    await import("fs").then((fs) => fs.mkdirSync(path.dirname(databasePath), { recursive: true }));
  }

  database = await open({
    filename: databasePath,
    driver: sqlite3.Database
  });

  await database.exec("PRAGMA foreign_keys = ON");
  return database;
}

export async function closeDatabase() {
  if (!database) {
    return;
  }

  await database.close();
  database = undefined;
}
