import { Router } from "express";
import {
  getMonthlyTracker,
  toggleHabitDay,
  updateChecklist,
  updateReflection,
  updateTargetScore
} from "../controllers/trackerController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", getMonthlyTracker);
router.patch("/toggle-day", toggleHabitDay);
router.patch("/target-score", updateTargetScore);
router.patch("/checklist", updateChecklist);
router.patch("/reflection", updateReflection);

export default router;
