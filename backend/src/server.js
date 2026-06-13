import dotenv from "dotenv";
import { createApp } from "./app.js";

dotenv.config();

const port = Number(process.env.PORT ?? 3001);
const app = await createApp();

app.listen(port, () => {
  console.log(`BudgetFlow API is running on port ${port}.`);
});
