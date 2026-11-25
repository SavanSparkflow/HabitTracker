import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    preferredLang: {
      type: String,
      enum: ["gu", "en"],
      default: "gu"
    },
    defaultTargetScorePercent: {
      type: Number,
      default: 80,
      min: 1,
      max: 100
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
