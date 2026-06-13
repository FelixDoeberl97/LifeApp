# Lokale Startanleitung

Diese Anleitung startet die komplette App lokal auf deinem Rechner.

## 1. Voraussetzungen

Installiert sein muss:

```text
Node.js
npm
```

Optional fuer Load Tests:

```text
k6
```

## 2. In den Projektordner wechseln

```powershell
cd C:\Users\felix\Documents\FH_Hagenberg\4_Semester\WAT\HaushaltsBudgetApp\budget-flow
```

## 3. Abhaengigkeiten installieren

Beim ersten Start:

```powershell
npm install
npm run install:all
```

## 4. Datenbank vorbereiten

Migration ausfuehren:

```powershell
npm run migrate
```

Demo-Daten einfuegen:

```powershell
npm run seed
```

Demo-Login:

```text
E-Mail: demo@example.com
Passwort: password123
```

## 5. App starten

Backend und Frontend gemeinsam starten:

```powershell
npm run dev
```

Danach im Browser oeffnen:

```text
http://localhost:5173
```

Die Startseite zeigt zwei Auswahlmoeglichkeiten:

```text
Haushaltsbudget
Koch-Assistenz
```

## 6. Lokale URLs

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:3001/api
```

API Health Check:

```text
http://localhost:3001/api/health
```
