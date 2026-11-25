import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  LayoutGrid,
  ListChecks,
  LogOut,
  Printer,
  Settings2
} from "lucide-react";
import api from "../api/client";
import { MONTHS, toGuNumber } from "../constants/dimensions";
import AnalyticsBar from "../components/AnalyticsBar";
import TodayFocusView from "../components/TodayFocusView";
import MonthlyMatrixGrid from "../components/MonthlyMatrixGrid";
import ReviewChecklist from "../components/ReviewChecklist";
import SelfReflection from "../components/SelfReflection";
import HabitManagerModal from "../components/HabitManagerModal";

export default function Dashboard({ user, onUserUpdate, onLogout }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [viewMode, setViewMode] = useState("matrix"); // "matrix" | "today"
  const [lang, setLang] = useState(user.preferredLang || "gu");

  const [trackerPayload, setTrackerPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [habitModalOpen, setHabitModalOpen] = useState(false);

  const isGu = lang === "gu";
  const fmt = (n) => (isGu ? toGuNumber(n) : n);

  useEffect(() => {
    document.title = isGu
      ? "Sharpen The Saw | ૭મી આદત – માસિક હેબિટ ટ્રેકર"
      : "Sharpen The Saw | Monthly Habit Tracker";
  }, [isGu]);

  const fetchTracker = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/tracker", { params: { year, month } });
      setTrackerPayload(data);
      setSelectedDay((prev) => Math.min(prev, data.daysInMonth));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tracker.");
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchTracker();
  }, [fetchTracker]);

  // Map habitId -> Set/Array of completed days
  const completedMap = useMemo(() => {
    const map = {};
    if (!trackerPayload?.tracker?.habitLogs) return map;
    for (const log of trackerPayload.tracker.habitLogs) {
      map[log.habitId] = log.completedDays || [];
    }
    return map;
  }, [trackerPayload]);

  async function handleLanguageToggle(nextLang) {
    setLang(nextLang);
    try {
      const { data } = await api.patch("/auth/profile", { preferredLang: nextLang });
      onUserUpdate(data.user);
    } catch {
      // Non-blocking preference update
    }
  }

  async function handleToggleDay(habitId, day) {
    if (!trackerPayload) return;

    // Optimistic update
    const prevTracker = trackerPayload;
    const nextLogs = prevTracker.tracker.habitLogs.map((log) => {
      if (log.habitId !== habitId) return log;
      const exists = log.completedDays.includes(day);
      return {
        ...log,
        completedDays: exists
          ? log.completedDays.filter((d) => d !== day)
          : [...log.completedDays, day]
      };
    });

    setTrackerPayload({
      ...prevTracker,
      tracker: { ...prevTracker.tracker, habitLogs: nextLogs }
    });

    try {
      await api.patch("/tracker/toggle-day", { year, month, habitId, day });
    } catch {
      setTrackerPayload(prevTracker);
    }
  }

  async function handleTargetScoreChange(value) {
    const clamped = Math.min(100, Math.max(1, value || 80));
    setTrackerPayload((prev) =>
      prev
        ? { ...prev, tracker: { ...prev.tracker, targetScorePercent: clamped } }
        : prev
    );
    try {
      await api.patch("/tracker/target-score", {
        year,
        month,
        targetScorePercent: clamped
      });
    } catch {
      fetchTracker();
    }
  }

  async function handleUpdateChecklist(payload) {
    try {
      const { data } = await api.patch("/tracker/checklist", {
        year,
        month,
        ...payload
      });
      setTrackerPayload((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tracker: {
            ...prev.tracker,
            ...(data.weeklyChecklist ? { weeklyChecklist: data.weeklyChecklist } : {}),
            ...(data.monthlyChecklist ? { monthlyChecklist: data.monthlyChecklist } : {})
          },
          ...(data.quarterlyReview ? { quarterlyReview: data.quarterlyReview } : {})
        };
      });
    } catch {
      fetchTracker();
    }
  }

  async function handleSaveReflections(reflections) {
    const { data } = await api.patch("/tracker/reflection", {
      year,
      month,
      reflections
    });
    setTrackerPayload((prev) =>
      prev ? { ...prev, tracker: { ...prev.tracker, reflections: data.reflections } } : prev
    );
  }

  async function handleCreateHabit(payload, markDoneDay = null) {
    const { data } = await api.post("/habits", payload);
    if (markDoneDay && data?.habit?._id) {
      await api.patch("/tracker/toggle-day", {
        year,
        month,
        habitId: data.habit._id,
        day: markDoneDay
      });
    }
    await fetchTracker();
  }

  async function handleUpdateHabit(id, payload) {
    await api.put(`/habits/${id}`, payload);
    await fetchTracker();
  }

  async function handleDeleteHabit(id) {
    await api.delete(`/habits/${id}`);
    await fetchTracker();
  }

  async function handleResetDefaults() {
    await api.post("/habits/reset-defaults");
    await fetchTracker();
  }

  async function handleCreateCategory(payload) {
    await api.post("/categories", payload);
    await fetchTracker();
  }

  async function handleDeleteCategory(categoryId) {
    await api.delete(`/categories/${categoryId}`);
    await fetchTracker();
  }

  async function handleAddSubCategory(categoryId, payload) {
    await api.post(`/categories/${categoryId}/subcategories`, payload);
    await fetchTracker();
  }

  async function handleDeleteSubCategory(categoryId, subId) {
    await api.delete(`/categories/${categoryId}/subcategories/${subId}`);
    await fetchTracker();
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  const currentMonthObj = MONTHS.find((m) => m.value === month);

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 no-print">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-xs shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight leading-tight">
                {isGu
                  ? "Sharpen The Saw • ૭મી આદત"
                  : "Sharpen The Saw — Monthly Habit Tracker"}
              </h1>
              <p className="text-xs text-slate-400">
                {isGu
                  ? `માસિક હેબિટ ટ્રેકર • નામ: ${user.name}`
                  : `7th Habit Tracker • Member: ${user.name}`}{" "}
                • {isGu ? currentMonthObj?.gu : currentMonthObj?.en} {fmt(year)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Month / Year Picker */}
            <div className="flex items-center gap-1.5 bg-slate-800 rounded-lg px-2.5 py-1.5 border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value} className="text-slate-900">
                    {isGu ? m.gu : m.en}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer"
              >
                {[2024, 2025, 2026, 2027, 2028].map((y) => (
                  <option key={y} value={y} className="text-slate-900">
                    {fmt(y)}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode("matrix")}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                  viewMode === "matrix" ? "bg-emerald-600 text-white" : "text-slate-300"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                {isGu ? "માસિક ગ્રીડ" : "Matrix"}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("today")}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                  viewMode === "today" ? "bg-emerald-600 text-white" : "text-slate-300"
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                {isGu ? "દૈનિક કાર્ડ" : "Daily Focus"}
              </button>
            </div>

            {/* Language Toggle */}
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => handleLanguageToggle("gu")}
                className={`px-2 py-1 rounded-md text-xs font-medium cursor-pointer ${
                  lang === "gu" ? "bg-white text-slate-900" : "text-slate-300"
                }`}
              >
                ગુજ
              </button>
              <button
                type="button"
                onClick={() => handleLanguageToggle("en")}
                className={`px-2 py-1 rounded-md text-xs font-medium cursor-pointer ${
                  lang === "en" ? "bg-white text-slate-900" : "text-slate-300"
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={() => setHabitModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5" />
              {isGu ? "આદતો" : "Habits"}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium cursor-pointer"
              title="Print / Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-200 text-xs font-medium cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-5 space-y-5">
        {loading && (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
            {isGu ? "ટ્રેકર લોડ થઈ રહ્યો છે..." : "Loading your monthly tracker..."}
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {!loading && trackerPayload && (
          <>
            <AnalyticsBar
              habits={trackerPayload.habits}
              categories={trackerPayload.categories || []}
              completedMap={completedMap}
              targetScorePercent={trackerPayload.tracker.targetScorePercent}
              onTargetScoreChange={handleTargetScoreChange}
              lang={lang}
            />

            {viewMode === "matrix" ? (
              <MonthlyMatrixGrid
                habits={trackerPayload.habits}
                categories={trackerPayload.categories || []}
                completedMap={completedMap}
                daysInMonth={trackerPayload.daysInMonth}
                currentDayHighlight={isCurrentMonth ? now.getDate() : null}
                onToggleDay={handleToggleDay}
                onOpenHabitManager={() => setHabitModalOpen(true)}
                lang={lang}
              />
            ) : (
              <TodayFocusView
                habits={trackerPayload.habits}
                categories={trackerPayload.categories || []}
                completedMap={completedMap}
                selectedDay={selectedDay}
                daysInMonth={trackerPayload.daysInMonth}
                onSelectDay={setSelectedDay}
                onToggleDay={handleToggleDay}
                onCreateHabit={handleCreateHabit}
                lang={lang}
              />
            )}

            <ReviewChecklist
              weeklyChecklist={trackerPayload.tracker.weeklyChecklist}
              monthlyChecklist={trackerPayload.tracker.monthlyChecklist}
              quarterlyReview={trackerPayload.quarterlyReview}
              quarter={trackerPayload.quarter}
              onUpdateChecklist={handleUpdateChecklist}
              lang={lang}
            />

            <SelfReflection
              reflections={trackerPayload.tracker.reflections}
              onSave={handleSaveReflections}
              lang={lang}
            />
          </>
        )}
      </main>

      <HabitManagerModal
        isOpen={habitModalOpen}
        habits={trackerPayload?.habits || []}
        categories={trackerPayload?.categories || []}
        onClose={() => setHabitModalOpen(false)}
        onCreateHabit={handleCreateHabit}
        onUpdateHabit={handleUpdateHabit}
        onDeleteHabit={handleDeleteHabit}
        onResetDefaults={handleResetDefaults}
        onCreateCategory={handleCreateCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddSubCategory={handleAddSubCategory}
        onDeleteSubCategory={handleDeleteSubCategory}
        lang={lang}
      />
    </div>
  );
}
