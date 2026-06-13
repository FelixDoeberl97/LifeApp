import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createUserBudget,
  deleteUserBudget,
  getBudgets,
  updateUserBudget
} from "../services/budgetService.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (request, response, next) => {
  try {
    const budgets = await getBudgets(request.app.locals.database, request.user.id);
    response.json(budgets);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const budget = await createUserBudget(request.app.locals.database, request.user.id, request.body);
    response.status(201).json(budget);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (request, response, next) => {
  try {
    const budget = await updateUserBudget(
      request.app.locals.database,
      request.user.id,
      request.params.id,
      request.body
    );
    response.json(budget);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (request, response, next) => {
  try {
    const result = await deleteUserBudget(request.app.locals.database, request.user.id, request.params.id);
    response.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
