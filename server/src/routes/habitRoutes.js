import { Router } from "express";
import {
  createHabit,
  deleteHabit,
  getHabits,
  resetDefaultHabits,
  updateHabit
} from "../controllers/habitController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", getHabits);
router.post("/", createHabit);
router.post("/reset-defaults", resetDefaultHabits);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);

export default router;
