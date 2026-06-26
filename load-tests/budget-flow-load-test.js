import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 20,
  duration: "1m",
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.05"]
  }
};

const baseUrl = __ENV.BASE_URL || "http://localhost:3001/api";

export default function () {
  const email = `load-${__VU}-${Date.now()}@example.com`;
  const password = "password123";

  const registerResponse = http.post(
    `${baseUrl}/auth/register`,
    JSON.stringify({ email, password }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(registerResponse, {
    "register status is 201 or 409": (response) => [201, 409].includes(response.status)
  });

  const loginResponse = http.post(
    `${baseUrl}/auth/login`,
    JSON.stringify({ email, password }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(loginResponse, {
    "login status is 200": (response) => response.status === 200,
    "login returns token": (response) => Boolean(response.json("token"))
  });

  const token = loginResponse.json("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const categoryResponse = http.post(
    `${baseUrl}/categories`,
    JSON.stringify({ name: `Load expense ${__VU}`, type: "expense" }),
    { headers }
  );

  check(categoryResponse, {
    "category status is 201": (response) => response.status === 201
  });

  const categoryId = categoryResponse.json("id");
  const dashboardResponse = http.get(`${baseUrl}/dashboard?month=1&year=2026`, { headers });

  check(dashboardResponse, {
    "dashboard status is 200": (response) => response.status === 200
  });

  const transactionResponse = http.post(
    `${baseUrl}/transactions`,
    JSON.stringify({
      categoryId,
      type: "expense",
      amount: 25,
      description: "Load test transaction",
      transactionDate: "2026-01-10"
    }),
    { headers }
  );

  check(transactionResponse, {
    "transaction status is 201": (response) => response.status === 201
  });

  const transactionListResponse = http.get(`${baseUrl}/transactions`, { headers });

  check(transactionListResponse, {
    "transaction list status is 200": (response) => response.status === 200
  });

  sleep(1);
}
