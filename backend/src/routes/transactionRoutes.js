import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createUserTransaction,
  deleteUserTransaction,
  getTransactions,
  updateUserTransaction
} from "../services/transactionService.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (request, response, next) => {
  try {
    const transactions = await getTransactions(request.app.locals.database, request.user.id);
    response.json(transactions);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const transaction = await createUserTransaction(request.app.locals.database, request.user.id, request.body);
    response.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (request, response, next) => {
  try {
    const transaction = await updateUserTransaction(
      request.app.locals.database,
      request.user.id,
      request.params.id,
      request.body
    );
    response.json(transaction);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (request, response, next) => {
  try {
    const result = await deleteUserTransaction(request.app.locals.database, request.user.id, request.params.id);
    response.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
