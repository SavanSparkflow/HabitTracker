import mongoose from "mongoose";
import { DIMENSIONS } from "./Habit.js";

const habitLogSchema = new mongoose.Schema(
  {
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true
    },
    completedDays: {
      type: [Number],
      default: []
    }
  },
  { _id: false }
);

const weeklyItemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    dimension: { type: String, enum: DIMENSIONS, required: true },
    titleGu: { type: String, required: true },
    titleEn: { type: String, default: "" },
    weeks: {
      w1: { type: Boolean, default: false },
      w2: { type: Boolean, default: false },
      w3: { type: Boolean, default: false },
      w4: { type: Boolean, default: false }
    }
  },
  { _id: false }
);

const monthlyItemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    labelGu: { type: String, required: true },
    labelEn: { type: String, default: "" },
    actionGu: { type: String, required: true },
    actionEn: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending"
    }
  },
  { _id: false }
);

const monthlyTrackerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    year: {
      type: Number,
      required: true,
      min: 2020,
      max: 2100
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    targetScorePercent: {
      type: Number,
      default: 80,
      min: 1,
      max: 100
    },
    habitLogs: {
      type: [habitLogSchema],
      default: []
    },
    weeklyChecklist: {
      type: [weeklyItemSchema],
      default: []
    },
    monthlyChecklist: {
      type: [monthlyItemSchema],
      default: []
    },
    reflections: {
      biggestWin: { type: String, default: "" },
      dimensionNeedingFocus: { type: String, default: "" },
      nextMonthResolution: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

monthlyTrackerSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

export const MonthlyTracker = mongoose.model("MonthlyTracker", monthlyTrackerSchema);
