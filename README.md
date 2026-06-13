# LifeApp

LifeApp contains two JavaScript web applications in one Vite frontend:

- A household budget application with authentication, budgets, categories, transactions and dashboard.
- A local cooking assistant for dishes, random selection, weekly meal planning, cooking history, calendar view and browser notifications.

## Prerequisites

- Node.js 20 or newer
- npm
- k6 for load tests

## Installation

```bash
npm install
npm run install:all
```

## Database

Run migrations:

```bash
npm run migrate
```

Insert demo data:

```bash
npm run seed
```

Demo login:

```text
email: demo@example.com
password: password123
```

## Start

Start backend and frontend together:

```bash
npm run dev
```

Backend:

```bash
npm run dev --prefix backend
```

Frontend:

```bash
npm run dev --prefix frontend
```

Default URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

The start page at `http://localhost:5173` lets you choose between the household budget app and the cooking assistant.


## API Overview

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`

Budgets:

- `GET /api/budgets`
- `POST /api/budgets`
- `PUT /api/budgets/:id`
- `DELETE /api/budgets/:id`

Categories:

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

Transactions:

- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

Dashboard:

- `GET /api/dashboard?month=1&year=2026`

Protected endpoints require an `Authorization: Bearer <token>` header.
