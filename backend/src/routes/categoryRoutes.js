import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createUserCategory,
  deleteUserCategory,
  getCategories,
  updateUserCategory
} from "../services/categoryService.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (request, response, next) => {
  try {
    const categories = await getCategories(request.app.locals.database, request.user.id);
    response.json(categories);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const category = await createUserCategory(request.app.locals.database, request.user.id, request.body);
    response.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (request, response, next) => {
  try {
    const category = await updateUserCategory(
      request.app.locals.database,
      request.user.id,
      request.params.id,
      request.body
    );
    response.json(category);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (request, response, next) => {
  try {
    const result = await deleteUserCategory(request.app.locals.database, request.user.id, request.params.id);
    response.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
