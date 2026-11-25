import mongoose from "mongoose";

export const DIMENSIONS = ["body", "mind", "heart", "soul"];

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    dimension: {
      type: String,
      required: true,
      trim: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HabitCategory",
      default: null
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    titleGu: {
      type: String,
      required: true,
      trim: true
    },
    titleEn: {
      type: String,
      default: "",
      trim: true
    },
    targetDays: {
      type: Number,
      required: true,
      min: 1,
      max: 31
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

habitSchema.index({ userId: 1, isActive: 1, order: 1 });

export const Habit = mongoose.model("Habit", habitSchema);
