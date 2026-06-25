import http from "k6/http";
import { check, sleep } from "k6";

const apiBaseUrl = __ENV.API_BASE_URL ?? "http://localhost:3001/api";
const frontendBaseUrl = __ENV.FRONTEND_BASE_URL ?? "http://localhost:5173";

export const options = {
  scenarios: {
    budgetAppLoad: {
      executor: "constant-vus",
      exec: "BudgetAppLoadTest",
      vus: 5,
      duration: "30s"
    },
    dishesAppLoad: {
      executor: "constant-vus",
      exec: "DishesAppLoadTest",
      vus: 5,
      duration: "30s"
    }
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<750"]
  }
};

export function setup() {
  const email = `load-${Date.now()}@example.com`;
  const registerResponse = http.post(
    `${apiBaseUrl}/auth/register`,
    JSON.stringify({ email, password: "password123" }),
    { headers: { "Content-Type": "application/json" } }
  );
  const token = registerResponse.json("token");
  const authHeaders = CreateAuthHeaders(token);

  http.post(
    `${apiBaseUrl}/budgets`,
    JSON.stringify({ month: 6, year: 2026, amount: 1500 }),
    { headers: authHeaders }
  );
  const categoryResponse = http.post(
    `${apiBaseUrl}/categories`,
    JSON.stringify({ name: "Load Test Food", type: "expense" }),
    { headers: authHeaders }
  );

  return {
    token,
    categoryId: categoryResponse.json("id")
  };
}

export function BudgetAppLoadTest(data) {
  const authHeaders = CreateAuthHeaders(data.token);

  const dashboardResponse = http.get(`${apiBaseUrl}/dashboard?month=6&year=2026`, {
    headers: authHeaders
  });
  const budgetsResponse = http.get(`${apiBaseUrl}/budgets`, {
    headers: authHeaders
  });
  const transactionResponse = http.post(
    `${apiBaseUrl}/transactions`,
    JSON.stringify({
      categoryId: data.categoryId,
      type: "expense",
      amount: 5,
      description: "Load test transaction",
      transactionDate: "2026-06-24"
    }),
    { headers: authHeaders }
  );

  check(dashboardResponse, {
    "budget dashboard status is 200": (response) => response.status === 200
  });
  check(budgetsResponse, {
    "budget list status is 200": (response) => response.status === 200
  });
  check(transactionResponse, {
    "budget transaction status is 201": (response) => response.status === 201
  });
  sleep(1);
}

export function DishesAppLoadTest() {
  const homeResponse = http.get(frontendBaseUrl);
  const dishesResponse = http.get(`${frontendBaseUrl}/dishes`);

  check(homeResponse, {
    "frontend home status is 200": (response) => response.status === 200,
    "frontend home contains app shell": (response) => response.body.includes("root")
  });
  check(dishesResponse, {
    "dishes route status is 200": (response) => response.status === 200,
    "dishes route contains app shell": (response) => response.body.includes("root")
  });
  sleep(1);
}

function CreateAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}
