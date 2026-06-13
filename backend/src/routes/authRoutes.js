import express from "express";
import { loginUser, registerUser } from "../services/authService.js";

const router = express.Router();

router.post("/register", async (request, response, next) => {
  try {
    const result = await registerUser(request.app.locals.database, request.body);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (request, response, next) => {
  try {
    const result = await loginUser(request.app.locals.database, request.body);
    response.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
