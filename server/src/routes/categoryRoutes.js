import { Router } from "express";
import {
  addSubCategory,
  createCategory,
  deleteCategory,
  deleteSubCategory,
  getCategories,
  updateCategory
} from "../controllers/categoryController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", getCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.post("/:id/subcategories", addSubCategory);
router.delete("/:id/subcategories/:subId", deleteSubCategory);

export default router;
