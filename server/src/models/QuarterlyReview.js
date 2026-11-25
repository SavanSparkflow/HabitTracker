import mongoose from "mongoose";

const quarterlyReviewSchema = new mongoose.Schema(
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
    quarter: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4]
    },
    actionGu: {
      type: String,
      default: "ફુલ બોડી હેલ્થ ચેકઅપ, ૧-૨ દિવસ નેચર ટ્રિપ અને બિઝનેસ/લાઈફ રિવ્યૂ"
    },
    actionEn: {
      type: String,
      default: "Full body health checkup, 1-2 day nature trip, and business/life review"
    },
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending"
    },
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

quarterlyReviewSchema.index({ userId: 1, year: 1, quarter: 1 }, { unique: true });

export const QuarterlyReview = mongoose.model("QuarterlyReview", quarterlyReviewSchema);
