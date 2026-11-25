import mongoose from "mongoose";

export const CATEGORY_COLORS = [
  "emerald",
  "sky",
  "rose",
  "purple",
  "amber",
  "indigo",
  "teal",
  "orange"
];

const subCategorySchema = new mongoose.Schema(
  {
    nameGu: {
      type: String,
      required: true,
      trim: true
    },
    nameEn: {
      type: String,
      default: "",
      trim: true
    }
  },
  { _id: true }
);

const habitCategorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    key: {
      type: String,
      required: true,
      trim: true
    },
    nameGu: {
      type: String,
      required: true,
      trim: true
    },
    nameEn: {
      type: String,
      default: "",
      trim: true
    },
    color: {
      type: String,
      enum: CATEGORY_COLORS,
      default: "emerald"
    },
    subCategories: {
      type: [subCategorySchema],
      default: []
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

habitCategorySchema.index({ userId: 1, key: 1 }, { unique: true });

export const HabitCategory = mongoose.model("HabitCategory", habitCategorySchema);
