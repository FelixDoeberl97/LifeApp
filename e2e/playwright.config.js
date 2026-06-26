import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:5174",
    trace: "on-first-retry"
  },
  webServer: [
    {
      command: "npm run migrate --prefix ../backend && npm run dev --prefix ../backend",
      url: "http://127.0.0.1:3001/api/health",
      reuseExistingServer: false,
      timeout: 30000
    },
    {
      command: "npm run dev:e2e --prefix ../frontend",
      url: "http://127.0.0.1:5174",
      reuseExistingServer: false,
      timeout: 30000
    }
  ]
});
