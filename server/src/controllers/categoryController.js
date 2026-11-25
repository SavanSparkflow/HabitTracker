import { CATEGORY_COLORS, HabitCategory } from "../models/HabitCategory.js";
import { Habit } from "../models/Habit.js";
import { seedDefaultCategoriesForUser } from "../utils/seedDefaults.js";

function buildCategoryKey(nameEn, nameGu) {
  const base = (nameEn || nameGu || "cat")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const suffix = Date.now().toString(36).slice(-4);
  return `${base || "cat"}_${suffix}`;
}

export async function getCategories(req, res) {
  try {
    const categories = await seedDefaultCategoriesForUser(req.user._id);
    return res.json({ categories });
  } catch (err) {
    console.error("getCategories error:", err);
    return res.status(500).json({ message: "Failed to fetch categories." });
  }
}

export async function createCategory(req, res) {
  try {
    const { nameGu, nameEn, color } = req.body;
    if (!nameGu?.trim() && !nameEn?.trim()) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const cleanGu = (nameGu || nameEn).trim();
    const cleanEn = (nameEn || nameGu).trim();
    const chosenColor = CATEGORY_COLORS.includes(color) ? color : "indigo";
    const count = await HabitCategory.countDocuments({ userId: req.user._id, isActive: true });

    const category = await HabitCategory.create({
      userId: req.user._id,
      key: buildCategoryKey(cleanEn, cleanGu),
      nameGu: cleanGu,
      nameEn: cleanEn,
      color: chosenColor,
      order: count + 1,
      subCategories: []
    });

    return res.status(201).json({ category });
  } catch (err) {
    console.error("createCategory error:", err);
    return res.status(500).json({ message: "Failed to create category." });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { nameGu, nameEn, color } = req.body;
    const updates = {};

    if (typeof nameGu === "string" && nameGu.trim()) updates.nameGu = nameGu.trim();
    if (typeof nameEn === "string" && nameEn.trim()) updates.nameEn = nameEn.trim();
    if (color && CATEGORY_COLORS.includes(color)) updates.color = color;

    const category = await HabitCategory.findOneAndUpdate(
      { _id: id, userId: req.user._id, isActive: true },
      updates,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    return res.json({ category });
  } catch (err) {
    console.error("updateCategory error:", err);
    return res.status(500).json({ message: "Failed to update category." });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const activeCount = await HabitCategory.countDocuments({ userId: req.user._id, isActive: true });
    if (activeCount <= 1) {
      return res.status(400).json({ message: "At least one category must remain active." });
    }

    const category = await HabitCategory.findOne({ _id: id, userId: req.user._id, isActive: true });
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const linkedHabits = await Habit.countDocuments({
      userId: req.user._id,
      isActive: true,
      $or: [{ categoryId: category._id }, { dimension: category.key }]
    });

    if (linkedHabits > 0) {
      return res.status(400).json({
        message: "Cannot delete a category that still has active habits. Remove or reassign its habits first."
      });
    }

    category.isActive = false;
    await category.save();
    return res.json({ message: "Category deleted.", categoryId: id });
  } catch (err) {
    console.error("deleteCategory error:", err);
    return res.status(500).json({ message: "Failed to delete category." });
  }
}

export async function addSubCategory(req, res) {
  try {
    const { id } = req.params;
    const { nameGu, nameEn } = req.body;
    if (!nameGu?.trim() && !nameEn?.trim()) {
      return res.status(400).json({ message: "Sub-category name is required." });
    }

    const cleanGu = (nameGu || nameEn).trim();
    const cleanEn = (nameEn || nameGu).trim();

    const category = await HabitCategory.findOneAndUpdate(
      { _id: id, userId: req.user._id, isActive: true },
      { $push: { subCategories: { nameGu: cleanGu, nameEn: cleanEn } } },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    return res.status(201).json({ category });
  } catch (err) {
    console.error("addSubCategory error:", err);
    return res.status(500).json({ message: "Failed to add sub-category." });
  }
}

export async function deleteSubCategory(req, res) {
  try {
    const { id, subId } = req.params;
    const category = await HabitCategory.findOneAndUpdate(
      { _id: id, userId: req.user._id, isActive: true },
      { $pull: { subCategories: { _id: subId } } },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    await Habit.updateMany(
      { userId: req.user._id, subCategoryId: subId },
      { $set: { subCategoryId: null } }
    );

    return res.json({ category });
  } catch (err) {
    console.error("deleteSubCategory error:", err);
    return res.status(500).json({ message: "Failed to delete sub-category." });
  }
}
