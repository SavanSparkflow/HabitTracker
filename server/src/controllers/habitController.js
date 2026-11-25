import { Habit } from "../models/Habit.js";
import { HabitCategory } from "../models/HabitCategory.js";
import { seedDefaultCategoriesForUser, seedDefaultHabitsForUser } from "../utils/seedDefaults.js";

export async function getHabits(req, res) {
  try {
    const habits = await Habit.find({ userId: req.user._id, isActive: true }).sort({ order: 1, createdAt: 1 });
    return res.json({ habits });
  } catch (err) {
    console.error("getHabits error:", err);
    return res.status(500).json({ message: "Failed to fetch habits." });
  }
}

export async function createHabit(req, res) {
  try {
    const { dimension, categoryId, subCategoryId, titleGu, titleEn, targetDays } = req.body;

    if (!titleGu?.trim() && !titleEn?.trim()) {
      return res.status(400).json({ message: "Habit title is required." });
    }

    await seedDefaultCategoriesForUser(req.user._id);

    const category = categoryId
      ? await HabitCategory.findOne({ _id: categoryId, userId: req.user._id, isActive: true })
      : await HabitCategory.findOne({ key: dimension, userId: req.user._id, isActive: true });

    if (!category) {
      return res.status(400).json({ message: "Valid habit category is required." });
    }

    let validSubCategoryId = null;
    if (subCategoryId) {
      const subExists = category.subCategories.some((s) => String(s._id) === String(subCategoryId));
      if (!subExists) {
        return res.status(400).json({ message: "Selected sub-category does not belong to this category." });
      }
      validSubCategoryId = subCategoryId;
    }

    const count = await Habit.countDocuments({ userId: req.user._id, isActive: true });
    const parsedTarget = Math.min(31, Math.max(1, Number(targetDays) || 25));

    const habit = await Habit.create({
      userId: req.user._id,
      dimension: category.key,
      categoryId: category._id,
      subCategoryId: validSubCategoryId,
      titleGu: (titleGu || titleEn).trim(),
      titleEn: (titleEn || titleGu).trim(),
      targetDays: parsedTarget,
      order: count + 1
    });

    return res.status(201).json({ habit });
  } catch (err) {
    console.error("createHabit error:", err);
    return res.status(500).json({ message: "Failed to create habit." });
  }
}

export async function updateHabit(req, res) {
  try {
    const { id } = req.params;
    const { dimension, categoryId, subCategoryId, titleGu, titleEn, targetDays, order } = req.body;

    const existingHabit = await Habit.findOne({ _id: id, userId: req.user._id, isActive: true });
    if (!existingHabit) {
      return res.status(404).json({ message: "Habit not found." });
    }

    const updates = {};

    if (categoryId || dimension) {
      const category = categoryId
        ? await HabitCategory.findOne({ _id: categoryId, userId: req.user._id, isActive: true })
        : await HabitCategory.findOne({ key: dimension, userId: req.user._id, isActive: true });
      if (!category) {
        return res.status(400).json({ message: "Invalid habit category." });
      }
      updates.dimension = category.key;
      updates.categoryId = category._id;

      if (subCategoryId !== undefined) {
        if (!subCategoryId) {
          updates.subCategoryId = null;
        } else {
          const subExists = category.subCategories.some((s) => String(s._id) === String(subCategoryId));
          updates.subCategoryId = subExists ? subCategoryId : null;
        }
      }
    } else if (subCategoryId !== undefined) {
      if (!subCategoryId) {
        updates.subCategoryId = null;
      } else {
        const category = await HabitCategory.findOne({
          userId: req.user._id,
          isActive: true,
          $or: [{ _id: existingHabit.categoryId }, { key: existingHabit.dimension }]
        });
        const subExists = category?.subCategories.some((s) => String(s._id) === String(subCategoryId));
        if (!subExists) {
          return res.status(400).json({ message: "Invalid sub-category for this habit's category." });
        }
        updates.subCategoryId = subCategoryId;
      }
    }

    if (typeof titleGu === "string" && titleGu.trim()) updates.titleGu = titleGu.trim();
    if (typeof titleEn === "string") updates.titleEn = titleEn.trim();
    if (targetDays !== undefined) {
      updates.targetDays = Math.min(31, Math.max(1, Number(targetDays) || 25));
    }
    if (typeof order === "number") updates.order = order;

    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId: req.user._id, isActive: true },
      updates,
      { new: true }
    );

    return res.json({ habit });
  } catch (err) {
    console.error("updateHabit error:", err);
    return res.status(500).json({ message: "Failed to update habit." });
  }
}

export async function deleteHabit(req, res) {
  try {
    const { id } = req.params;
    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { isActive: false },
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ message: "Habit not found." });
    }
    return res.json({ message: "Habit archived.", habitId: id });
  } catch (err) {
    console.error("deleteHabit error:", err);
    return res.status(500).json({ message: "Failed to delete habit." });
  }
}

export async function resetDefaultHabits(req, res) {
  try {
    await Habit.deleteMany({ userId: req.user._id });
    const habits = await seedDefaultHabitsForUser(req.user._id);
    return res.json({ habits });
  } catch (err) {
    console.error("resetDefaultHabits error:", err);
    return res.status(500).json({ message: "Failed to restore default habits." });
  }
}
