import { Habit } from "../models/Habit.js";
import { MonthlyTracker } from "../models/MonthlyTracker.js";
import { QuarterlyReview } from "../models/QuarterlyReview.js";
import {
  DEFAULT_MONTHLY_CHECKLIST,
  DEFAULT_WEEKLY_CHECKLIST,
  seedDefaultCategoriesForUser,
  seedDefaultHabitsForUser
} from "../utils/seedDefaults.js";

function parseYearMonth(query) {
  const now = new Date();
  const year = Math.min(2100, Math.max(2020, Number(query.year) || now.getFullYear()));
  const month = Math.min(12, Math.max(1, Number(query.month) || now.getMonth() + 1));
  return { year, month };
}

function getQuarter(month) {
  return Math.ceil(month / 3);
}

/**
 * Ensures a MonthlyTracker exists for (userId, year, month) and includes logs for all active habits.
 */
async function getOrCreateTracker(user, year, month) {
  const categories = await seedDefaultCategoriesForUser(user._id);
  const totalEverCreated = await Habit.countDocuments({ userId: user._id });
  let habits = await Habit.find({ userId: user._id, isActive: true }).sort({ order: 1, createdAt: 1 });
  if (totalEverCreated === 0) {
    habits = await seedDefaultHabitsForUser(user._id);
  }

  let tracker = await MonthlyTracker.findOne({ userId: user._id, year, month });

  if (!tracker) {
    tracker = await MonthlyTracker.create({
      userId: user._id,
      year,
      month,
      targetScorePercent: user.defaultTargetScorePercent || 80,
      habitLogs: habits.map((h) => ({ habitId: h._id, completedDays: [] })),
      weeklyChecklist: DEFAULT_WEEKLY_CHECKLIST,
      monthlyChecklist: DEFAULT_MONTHLY_CHECKLIST
    });
  } else {
    const existingIds = new Set(tracker.habitLogs.map((l) => String(l.habitId)));
    const missingLogs = habits
      .filter((h) => !existingIds.has(String(h._id)))
      .map((h) => ({ habitId: h._id, completedDays: [] }));

    if (missingLogs.length > 0) {
      tracker.habitLogs.push(...missingLogs);
      await tracker.save();
    }
  }

  const quarter = getQuarter(month);
  let quarterlyReview = await QuarterlyReview.findOne({ userId: user._id, year, quarter });
  if (!quarterlyReview) {
    quarterlyReview = await QuarterlyReview.create({
      userId: user._id,
      year,
      quarter
    });
  }

  return { tracker, habits, categories, quarterlyReview };
}

export async function getMonthlyTracker(req, res) {
  try {
    const { year, month } = parseYearMonth(req.query);
    const daysInMonth = new Date(year, month, 0).getDate();
    const { tracker, habits, categories, quarterlyReview } = await getOrCreateTracker(req.user, year, month);

    return res.json({
      year,
      month,
      quarter: getQuarter(month),
      daysInMonth,
      categories,
      habits,
      tracker,
      quarterlyReview
    });
  } catch (err) {
    console.error("getMonthlyTracker error:", err);
    return res.status(500).json({ message: "Failed to load monthly tracker." });
  }
}

export async function toggleHabitDay(req, res) {
  try {
    const { year, month, habitId, day } = req.body;
    const parsedYear = Number(year);
    const parsedMonth = Number(month);
    const parsedDay = Number(day);
    const maxDays = new Date(parsedYear, parsedMonth, 0).getDate();

    if (!parsedYear || !parsedMonth || !habitId || parsedDay < 1 || parsedDay > maxDays) {
      return res.status(400).json({ message: "Invalid year, month, habitId, or day." });
    }

    await getOrCreateTracker(req.user, parsedYear, parsedMonth);

    const alreadyDone = await MonthlyTracker.findOne({
      userId: req.user._id,
      year: parsedYear,
      month: parsedMonth,
      habitLogs: { $elemMatch: { habitId, completedDays: parsedDay } }
    });

    const updateOp = alreadyDone
      ? { $pull: { "habitLogs.$.completedDays": parsedDay } }
      : { $addToSet: { "habitLogs.$.completedDays": parsedDay } };

    const updated = await MonthlyTracker.findOneAndUpdate(
      {
        userId: req.user._id,
        year: parsedYear,
        month: parsedMonth,
        "habitLogs.habitId": habitId
      },
      updateOp,
      { new: true }
    );

    const logEntry = updated.habitLogs.find((l) => String(l.habitId) === String(habitId));
    return res.json({
      habitId,
      day: parsedDay,
      completed: !alreadyDone,
      completedDays: logEntry ? logEntry.completedDays : []
    });
  } catch (err) {
    console.error("toggleHabitDay error:", err);
    return res.status(500).json({ message: "Failed to toggle habit day." });
  }
}

export async function updateTargetScore(req, res) {
  try {
    const { year, month, targetScorePercent } = req.body;
    const score = Math.min(100, Math.max(1, Number(targetScorePercent) || 80));

    const tracker = await MonthlyTracker.findOneAndUpdate(
      { userId: req.user._id, year: Number(year), month: Number(month) },
      { targetScorePercent: score },
      { new: true }
    );

    if (!tracker) {
      return res.status(404).json({ message: "Monthly tracker not found." });
    }
    return res.json({ targetScorePercent: tracker.targetScorePercent });
  } catch (err) {
    console.error("updateTargetScore error:", err);
    return res.status(500).json({ message: "Failed to update target score." });
  }
}

export async function updateChecklist(req, res) {
  try {
    const { year, month, type, key, weekKey, value, status, notes } = req.body;
    const parsedYear = Number(year);
    const parsedMonth = Number(month);

    if (type === "weekly") {
      if (!["w1", "w2", "w3", "w4"].includes(weekKey)) {
        return res.status(400).json({ message: "Invalid weekKey." });
      }
      const tracker = await MonthlyTracker.findOneAndUpdate(
        { userId: req.user._id, year: parsedYear, month: parsedMonth, "weeklyChecklist.key": key },
        { $set: { [`weeklyChecklist.$.weeks.${weekKey}`]: Boolean(value) } },
        { new: true }
      );
      if (!tracker) return res.status(404).json({ message: "Checklist item not found." });
      return res.json({ weeklyChecklist: tracker.weeklyChecklist });
    }

    if (type === "monthly") {
      if (!["pending", "done"].includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
      }
      const tracker = await MonthlyTracker.findOneAndUpdate(
        { userId: req.user._id, year: parsedYear, month: parsedMonth, "monthlyChecklist.key": key },
        { $set: { "monthlyChecklist.$.status": status } },
        { new: true }
      );
      if (!tracker) return res.status(404).json({ message: "Checklist item not found." });
      return res.json({ monthlyChecklist: tracker.monthlyChecklist });
    }

    if (type === "quarterly") {
      const quarter = getQuarter(parsedMonth);
      const updates = {};
      if (status === "pending" || status === "done") updates.status = status;
      if (typeof notes === "string") updates.notes = notes;

      const quarterlyReview = await QuarterlyReview.findOneAndUpdate(
        { userId: req.user._id, year: parsedYear, quarter },
        updates,
        { new: true, upsert: true }
      );
      return res.json({ quarterlyReview });
    }

    return res.status(400).json({ message: "Invalid checklist type." });
  } catch (err) {
    console.error("updateChecklist error:", err);
    return res.status(500).json({ message: "Failed to update checklist." });
  }
}

export async function updateReflection(req, res) {
  try {
    const { year, month, reflections } = req.body;
    const tracker = await MonthlyTracker.findOneAndUpdate(
      { userId: req.user._id, year: Number(year), month: Number(month) },
      {
        reflections: {
          biggestWin: reflections?.biggestWin ?? "",
          dimensionNeedingFocus: reflections?.dimensionNeedingFocus ?? "",
          nextMonthResolution: reflections?.nextMonthResolution ?? ""
        }
      },
      { new: true }
    );

    if (!tracker) {
      return res.status(404).json({ message: "Monthly tracker not found." });
    }
    return res.json({ reflections: tracker.reflections });
  } catch (err) {
    console.error("updateReflection error:", err);
    return res.status(500).json({ message: "Failed to save reflections." });
  }
}
