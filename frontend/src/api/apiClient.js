const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

export function getToken() {
  return localStorage.getItem("budgetFlowToken");
}

export function setToken(token) {
  localStorage.setItem("budgetFlowToken", token);
}

export function clearToken() {
  localStorage.removeItem("budgetFlowToken");
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers ?? {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers
  });

  const responseBody = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(responseBody.message ?? "Request failed.");
  }

  return responseBody;
}
