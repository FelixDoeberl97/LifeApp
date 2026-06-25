# Test_Doku

## Budget-App

1. `validateBudget_ShouldAcceptValidBudget` prueft, ob ein Budget mit gueltigem Monat, Jahr und Betrag akzeptiert wird.
2. `validateBudget_ShouldRejectNonNumericAmount` prueft, ob ein nicht numerischer Betrag abgelehnt wird.
3. `validateCategory_ShouldTrimNameAndAcceptValidExpense` prueft, ob Kategorienamen mit Leerzeichen korrekt akzeptiert werden.
4. `validateTransaction_ShouldAcceptValidIncomeTransaction` prueft, ob eine gueltige Einnahmen-Transaktion akzeptiert wird.
5. `validateTransaction_ShouldRejectMissingDate` prueft, ob eine Transaktion ohne Datum abgelehnt wird.
6. `calculateRemainingBudget_ShouldHandleNumericStrings` prueft, ob Budget, Einnahmen und Ausgaben auch als numerische Strings korrekt berechnet werden.
7. `groupTransactionsByCategory_ShouldIgnoreOtherTransactionTypes` prueft, ob nur Transaktionen des angeforderten Typs pro Kategorie summiert werden.

## Gerichte-App

1. `CleanIngredients_ShouldTrimIngredientsAndRemoveEmptyValues` prueft, ob Zutaten bereinigt und leere Werte entfernt werden.
2. `ValidateDish_ShouldAcceptValidDish` prueft, ob ein gueltiges Gericht akzeptiert wird.
3. `ValidateDish_ShouldRejectInvalidDurationDifficultyAndCategory` prueft, ob ungueltige Dauer, Schwierigkeit und Kategorie abgelehnt werden.
4. `CreateDish_ShouldCleanDishDataAndStoreDish` prueft, ob ein Gericht bereinigt, erstellt und gespeichert wird.
5. `UpdateDish_ShouldUpdateExistingDishAndKeepId` prueft, ob ein vorhandenes Gericht aktualisiert wird und seine ID behaelt.
6. `GetRandomDish_ShouldReturnNullForEmptyDishList` prueft, ob bei leerer Gerichteliste kein zufaelliges Gericht zurueckgegeben wird.
7. `CreateEmptyMealPlan_ShouldCreateSevenEntriesFromWeekStartDate` prueft, ob ein leerer Wochenplan mit sieben Tagen ab Startdatum erstellt wird.

## Integrationtests

### Budget-App

1. `getBudgets_ShouldRejectMissingAuthorization` prueft, ob geschuetzte Budget-Endpunkte ohne Token abgelehnt werden.
2. `updateBudget_ShouldPersistChangedBudget` prueft, ob ein Budget ueber die API aktualisiert und danach korrekt gelistet wird.
3. `deleteBudget_ShouldRemoveBudgetFromList` prueft, ob ein Budget ueber die API geloescht und nicht mehr zurueckgegeben wird.
4. `createTransaction_ShouldRejectTypeMismatchWithCategory` prueft, ob eine Transaktion abgelehnt wird, wenn ihr Typ nicht zur Kategorie passt.
5. `getDashboard_ShouldOnlyIncludeTransactionsFromRequestedMonth` prueft, ob die Dashboard-Auswertung nur Transaktionen des angefragten Monats beruecksichtigt.

### Gerichte-App

1. `CreateDishAndGetDishById_ShouldReturnStoredDish` prueft, ob ein erstelltes Gericht gespeichert und per ID wieder geladen werden kann.
2. `UpdateDish_ShouldPersistChangesInDishList` prueft, ob Aenderungen an einem Gericht dauerhaft in der Gerichteliste gespeichert werden.
3. `DeleteDish_ShouldRemoveDishWithoutRemovingOtherDishes` prueft, ob ein geloeschtes Gericht entfernt wird, ohne andere Gerichte zu beeinflussen.
4. `SaveMealPlanAndGetMealPlanByWeekStartDate_ShouldReturnSavedEntries` prueft, ob ein Wochenplan gespeichert und ueber sein Startdatum wieder geladen wird.
5. `CreateCookingLog_ShouldBeAvailableInRecentDateAndMonthQueries` prueft, ob ein Kochprotokoll in den Abfragen fuer zuletzt gekocht, Datum und Monat enthalten ist.

## Moegliche E2E-Tests

### Budget-App

1. `BudgetUser_ShouldRegisterCreateBudgetAndSeeDashboardSummary` wuerde pruefen, ob ein Benutzer sich registrieren, ein Budget anlegen, Kategorien und Transaktionen erfassen und danach die korrekten Werte im Dashboard sehen kann.
2. `BudgetUser_ShouldEditAndDeleteBudgetFromBudgetPage` wuerde pruefen, ob ein Benutzer ein Budget in der Oberflaeche bearbeiten, speichern, loeschen und danach nicht mehr in der Budgetliste sehen kann.

### Gerichte-App

1. `DishesUser_ShouldRegisterCreateDishAndCookToday` wuerde pruefen, ob ein Benutzer sich registrieren, ein Gericht anlegen, es als heute gekocht markieren und den Eintrag in der Koch-Historie sehen kann.
2. `DishesUser_ShouldCreateWeeklyMealPlanAndSeeCalendarEntries` wuerde pruefen, ob ein Benutzer Gerichte einem Wochenplan zuordnet und diese Planung danach in der Kalender- oder Wochenansicht sichtbar ist.

## Load-Tests

### Budget-App

1. `BudgetAppLoadTest` fuehrt mit k6 wiederholt authentifizierte API-Aufrufe gegen Dashboard, Budgetliste und Transaktionserstellung aus. Damit wird geprueft, ob die Budget-API unter paralleler Last stabile Antwortzeiten und erfolgreiche Statuscodes liefert.

### Gerichte-App

1. `DishesAppLoadTest` fuehrt mit k6 wiederholt HTTP-Aufrufe gegen die Startseite und die Gerichte-Route des Frontends aus. Damit wird geprueft, ob die clientseitige Gerichte-App als Vite-Seite unter paralleler Last stabil ausgeliefert wird.
