import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import {
  COLOR_PALETTES,
  resolveSubCategory,
  toGuNumber
} from "../constants/dimensions";

export default function TodayFocusView({
  habits,
  categories,
  completedMap,
  selectedDay,
  daysInMonth,
  onSelectDay,
  onToggleDay,
  onCreateHabit,
  lang
}) {
  const isGu = lang === "gu";
  const fmt = (n) => (isGu ? toGuNumber(n) : n);

  const [showGlobalForm, setShowGlobalForm] = useState(false);
  const [activeCategoryForm, setActiveCategoryForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const [globalForm, setGlobalForm] = useState({
    categoryId: categories[0]?._id || "",
    subCategoryId: "",
    title: "",
    targetDays: 25,
    markDoneToday: true
  });

  const [cardForm, setCardForm] = useState({
    subCategoryId: "",
    title: "",
    targetDays: 25,
    markDoneToday: true
  });

  const dayDoneCount = habits.filter((h) => (completedMap[h._id] || []).includes(selectedDay)).length;

  const grouped = categories.map((cat) => {
    const palette = COLOR_PALETTES[cat.color] || COLOR_PALETTES.emerald;
    const items = habits.filter(
      (h) => h.categoryId === cat._id || (!h.categoryId && h.dimension === cat.key)
    );
    return {
      cat: {
        ...cat,
        labelGu: cat.nameGu,
        labelEn: cat.nameEn || cat.nameGu,
        ...palette
      },
      items
    };
  });

  const selectedGlobalCat =
    categories.find((c) => c._id === globalForm.categoryId) || categories[0] || null;

  async function handleGlobalSubmit(e) {
    e.preventDefault();
    const cleanTitle = globalForm.title.trim();
    if (!cleanTitle) return;
    setSaving(true);
    try {
      await onCreateHabit(
        {
          categoryId: selectedGlobalCat?._id,
          dimension: selectedGlobalCat?.key,
          subCategoryId: globalForm.subCategoryId || null,
          titleGu: cleanTitle,
          titleEn: cleanTitle,
          targetDays: globalForm.targetDays
        },
        globalForm.markDoneToday ? selectedDay : null
      );
      setGlobalForm((prev) => ({
        ...prev,
        title: "",
        subCategoryId: ""
      }));
      setShowGlobalForm(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleCardSubmit(e, cat) {
    e.preventDefault();
    const cleanTitle = cardForm.title.trim();
    if (!cleanTitle) return;
    setSaving(true);
    try {
      await onCreateHabit(
        {
          categoryId: cat._id,
          dimension: cat.key,
          subCategoryId: cardForm.subCategoryId || null,
          titleGu: cleanTitle,
          titleEn: cleanTitle,
          targetDays: cardForm.targetDays
        },
        cardForm.markDoneToday ? selectedDay : null
      );
      setCardForm({
        subCategoryId: "",
        title: "",
        targetDays: 25,
        markDoneToday: true
      });
      setActiveCategoryForm(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Day Switcher + Quick Add Habit Button */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={selectedDay <= 1}
              onClick={() => onSelectDay(selectedDay - 1)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-2">
              <p className="text-xs text-slate-500">{isGu ? "પસંદ કરેલ તારીખ" : "Selected Day"}</p>
              <p className="text-lg font-bold text-slate-900">
                {isGu ? `દિવસ ${fmt(selectedDay)}` : `Day ${selectedDay}`}
              </p>
            </div>
            <button
              type="button"
              disabled={selectedDay >= daysInMonth}
              onClick={() => onSelectDay(selectedDay + 1)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setShowGlobalForm((prev) => !prev);
                if (!globalForm.categoryId && categories[0]) {
                  setGlobalForm((prev) => ({ ...prev, categoryId: categories[0]._id }));
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer"
            >
              {showGlobalForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {isGu ? "દૈનિક આદત ઉમેરો" : "Add Daily Habit"}
            </button>

            <select
              value={selectedDay}
              onChange={(e) => onSelectDay(Number(e.target.value))}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50"
            >
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {isGu ? `તારીખ ${fmt(d)}` : `Day ${d}`}
                </option>
              ))}
            </select>

            <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-semibold">
              {fmt(dayDoneCount)} / {fmt(habits.length)}
            </div>
          </div>
        </div>

        {/* Manual Daily Habit Insert Form (single title field) */}
        {showGlobalForm && (
          <form
            onSubmit={handleGlobalSubmit}
            className="pt-3 border-t border-slate-200 bg-slate-50/70 rounded-xl p-3.5 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <select
                value={selectedGlobalCat?._id || ""}
                onChange={(e) =>
                  setGlobalForm({
                    ...globalForm,
                    categoryId: e.target.value,
                    subCategoryId: ""
                  })
                }
                className="sm:col-span-3 rounded-lg border border-slate-300 px-2.5 py-2 text-xs bg-white"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {isGu ? c.nameGu : c.nameEn || c.nameGu}
                  </option>
                ))}
              </select>

              <select
                value={globalForm.subCategoryId}
                onChange={(e) => setGlobalForm({ ...globalForm, subCategoryId: e.target.value })}
                className="sm:col-span-3 rounded-lg border border-slate-300 px-2.5 py-2 text-xs bg-white"
              >
                <option value="">{isGu ? "સબ-કેટેગરી (વૈકલ્પિક)" : "Sub-category (Optional)"}</option>
                {(selectedGlobalCat?.subCategories || []).map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {isGu ? sub.nameGu : sub.nameEn || sub.nameGu}
                  </option>
                ))}
              </select>

              <input
                type="text"
                required
                value={globalForm.title}
                onChange={(e) => setGlobalForm({ ...globalForm, title: e.target.value })}
                placeholder={isGu ? "નવી દૈનિક આદત લખો..." : "Enter habit title..."}
                className="sm:col-span-5 rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white"
              />

              <input
                type="number"
                min={1}
                max={31}
                value={globalForm.targetDays}
                onChange={(e) => setGlobalForm({ ...globalForm, targetDays: Number(e.target.value) })}
                className="sm:col-span-1 rounded-lg border border-slate-300 px-2 py-2 text-xs bg-white text-center"
                title={isGu ? "માસિક ટાર્ગેટ દિવસ" : "Monthly target days"}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={globalForm.markDoneToday}
                  onChange={(e) => setGlobalForm({ ...globalForm, markDoneToday: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                {isGu
                  ? `દિવસ ${fmt(selectedDay)} માટે પૂર્ણ (✓) માર્ક કરો`
                  : `Mark completed for Day ${selectedDay}`}
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGlobalForm(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-600 hover:bg-white cursor-pointer"
                >
                  {isGu ? "રદ કરો" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {saving ? (isGu ? "સેવ થાય છે..." : "Saving...") : isGu ? "આદત સેવ કરો" : "Save Habit"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {grouped.map(({ cat, items }) => {
          const isAddingHere = activeCategoryForm === cat._id;

          return (
            <div key={cat._id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${cat.badgeClass}`}>
                  {isGu ? cat.labelGu : cat.labelEn}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isAddingHere) {
                        setActiveCategoryForm(null);
                      } else {
                        setCardForm({
                          subCategoryId: "",
                          title: "",
                          targetDays: 25,
                          markDoneToday: true
                        });
                        setActiveCategoryForm(cat._id);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                  >
                    {isAddingHere ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    {isGu ? "ઉમેરો" : "Add"}
                  </button>

                  <span className="text-xs text-slate-500">
                    {fmt(items.filter((h) => (completedMap[h._id] || []).includes(selectedDay)).length)} /{" "}
                    {fmt(items.length)}
                  </span>
                </div>
              </div>

              {/* Inline Add inside this specific Category Card (single title field) */}
              {isAddingHere && (
                <form
                  onSubmit={(e) => handleCardSubmit(e, cat)}
                  className="mb-3 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    {cat.subCategories?.length > 0 && (
                      <select
                        value={cardForm.subCategoryId}
                        onChange={(e) => setCardForm({ ...cardForm, subCategoryId: e.target.value })}
                        className="sm:col-span-12 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs bg-white"
                      >
                        <option value="">
                          {isGu ? "સબ-કેટેગરી પસંદ કરો (વૈકલ્પિક)" : "Select sub-category (optional)"}
                        </option>
                        {cat.subCategories.map((sub) => (
                          <option key={sub._id} value={sub._id}>
                            {isGu ? sub.nameGu : sub.nameEn || sub.nameGu}
                          </option>
                        ))}
                      </select>
                    )}

                    <input
                      type="text"
                      required
                      value={cardForm.title}
                      onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                      placeholder={isGu ? "આદતનું નામ લખો..." : "Enter habit title..."}
                      className="sm:col-span-10 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs bg-white"
                    />
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={cardForm.targetDays}
                      onChange={(e) => setCardForm({ ...cardForm, targetDays: Number(e.target.value) })}
                      className="sm:col-span-2 rounded-md border border-slate-300 px-2 py-1.5 text-xs bg-white text-center"
                      title={isGu ? "ટાર્ગેટ દિવસ" : "Target days"}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cardForm.markDoneToday}
                        onChange={(e) => setCardForm({ ...cardForm, markDoneToday: e.target.checked })}
                        className="rounded border-slate-300 text-emerald-600"
                      />
                      {isGu ? `દિવસ ${fmt(selectedDay)} પૂર્ણ માર્ક કરો` : `Check Day ${selectedDay}`}
                    </label>

                    <button
                      type="submit"
                      disabled={saving}
                      className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      {isGu ? "સેવ" : "Save"}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {items.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    {isGu
                      ? "આ કેટેગરીમાં હજી કોઈ આદત નથી — ઉપર '+ ઉમેરો' પર ક્લિક કરીને ઉમેરો."
                      : "No habits in this category yet — click '+ Add' above."}
                  </p>
                ) : (
                  items.map((habit) => {
                    const days = completedMap[habit._id] || [];
                    const isDone = days.includes(selectedDay);
                    const sub = resolveSubCategory(habit, cat);

                    return (
                      <button
                        key={habit._id}
                        type="button"
                        onClick={() => onToggleDay(habit._id, selectedDay)}
                        className={`w-full text-left flex items-center justify-between gap-3 p-3 rounded-lg border transition cursor-pointer ${
                          isDone
                            ? "bg-slate-50 border-slate-300"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition ${
                              isDone ? cat.activeCheckClass : "border-slate-300 bg-white"
                            }`}
                          >
                            {isDone && <Check className="w-4 h-4 stroke-[2.5]" />}
                          </span>
                          <div className="min-w-0">
                            <span className={`block text-sm ${isDone ? "text-slate-900 font-medium" : "text-slate-700"}`}>
                              {isGu ? habit.titleGu : habit.titleEn || habit.titleGu}
                            </span>
                            {sub && (
                              <span className="inline-block mt-0.5 text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                                {isGu ? sub.nameGu : sub.nameEn || sub.nameGu}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-medium text-slate-500 shrink-0">
                          {fmt(days.length)}/{fmt(habit.targetDays)}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
