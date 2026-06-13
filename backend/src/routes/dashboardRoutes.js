import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getDashboardSummary } from "../services/dashboardService.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (request, response, next) => {
  try {
    const currentDate = new Date();
    const month = request.query.month ?? currentDate.getMonth() + 1;
    const year = request.query.year ?? currentDate.getFullYear();
    const summary = await getDashboardSummary(request.app.locals.database, request.user.id, month, year);
    response.json(summary);
  } catch (error) {
    next(error);
  }
});

export default router;
