import { useEffect, useState } from "react";
import { FolderPlus, Layers, Plus, RotateCcw, Tag, Trash2, X } from "lucide-react";
import {
  COLOR_PALETTES,
  resolveHabitCategory,
  resolveSubCategory
} from "../constants/dimensions";

export default function HabitManagerModal({
  isOpen,
  habits,
  categories,
  onClose,
  onCreateHabit,
  onUpdateHabit,
  onDeleteHabit,
  onResetDefaults,
  onCreateCategory,
  onDeleteCategory,
  onAddSubCategory,
  onDeleteSubCategory,
  lang
}) {
  const isGu = lang === "gu";
  const [activeTab, setActiveTab] = useState("habits"); // "habits" | "categories"
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Habit creation form (single title field)
  const [newHabit, setNewHabit] = useState({
    categoryId: "",
    subCategoryId: "",
    title: "",
    targetDays: 25
  });

  // Category creation form (single name field)
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "indigo"
  });

  // Per-category inline subcategory single input state: { [categoryId]: string }
  const [subInputs, setSubInputs] = useState({});

  useEffect(() => {
    if (categories.length > 0 && !categories.some((c) => c._id === newHabit.categoryId)) {
      setNewHabit((prev) => ({
        ...prev,
        categoryId: categories[0]._id,
        subCategoryId: ""
      }));
    }
  }, [categories, newHabit.categoryId]);

  if (!isOpen) return null;

  const selectedCategory = categories.find((c) => c._id === newHabit.categoryId) || categories[0];
  const availableSubCategories = selectedCategory?.subCategories || [];

  async function handleAddHabit(e) {
    e.preventDefault();
    const cleanTitle = newHabit.title.trim();
    if (!cleanTitle) return;
    setError("");
    setBusy(true);
    try {
      await onCreateHabit({
        categoryId: selectedCategory?._id,
        dimension: selectedCategory?.key,
        subCategoryId: newHabit.subCategoryId || null,
        titleGu: cleanTitle,
        titleEn: cleanTitle,
        targetDays: newHabit.targetDays
      });
      setNewHabit((prev) => ({ ...prev, title: "", subCategoryId: "" }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add habit.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    const cleanName = newCategory.name.trim();
    if (!cleanName) return;
    setError("");
    setBusy(true);
    try {
      await onCreateCategory({
        nameGu: cleanName,
        nameEn: cleanName,
        color: newCategory.color
      });
      setNewCategory({ name: "", color: "indigo" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAddSubCategory(e, categoryId) {
    e.preventDefault();
    const cleanSub = (subInputs[categoryId] || "").trim();
    if (!cleanSub) return;
    setError("");
    setBusy(true);
    try {
      await onAddSubCategory(categoryId, { nameGu: cleanSub, nameEn: cleanSub });
      setSubInputs((prev) => ({ ...prev, [categoryId]: "" }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add sub-category.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteCategoryClick(categoryId) {
    setError("");
    try {
      await onDeleteCategory(categoryId);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete category.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isGu ? "આદતો, કેટેગરી અને સબ-કેટેગરી મેનેજ કરો" : "Manage Habits, Categories & Sub-Categories"}
            </h3>
            <p className="text-xs text-slate-500">
              {isGu
                ? "નવી કેટેગરી અને સબ-કેટેગરી ઉમેરો અથવા આદતોના ટાર્ગેટ બદલો"
                : "Create custom categories & sub-categories or customize your habits"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("habits");
              setError("");
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === "habits"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            {isGu ? `આદતો (${habits.length})` : `Habits (${habits.length})`}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("categories");
              setError("");
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === "categories"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {isGu
              ? `કેટેગરી & સબ-કેટેગરી (${categories.length})`
              : `Categories & Sub-Categories (${categories.length})`}
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-700">
              {error}
            </div>
          )}

          {activeTab === "habits" ? (
            <>
              {/* Add Habit Form */}
              <form onSubmit={handleAddHabit} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-800">
                    {isGu ? "નવી આદત ઉમેરો" : "Add New Habit"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab("categories")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    {isGu ? "+ નવી કેટેગરી ઉમેરો" : "+ Add Category"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <select
                    value={selectedCategory?._id || ""}
                    onChange={(e) =>
                      setNewHabit({
                        ...newHabit,
                        categoryId: e.target.value,
                        subCategoryId: ""
                      })
                    }
                    className="sm:col-span-6 rounded-lg border border-slate-300 px-2.5 py-2 text-xs bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {isGu ? cat.nameGu : cat.nameEn || cat.nameGu}
                      </option>
                    ))}
                  </select>

                  <select
                    value={newHabit.subCategoryId}
                    onChange={(e) => setNewHabit({ ...newHabit, subCategoryId: e.target.value })}
                    className="sm:col-span-6 rounded-lg border border-slate-300 px-2.5 py-2 text-xs bg-white"
                  >
                    <option value="">
                      {isGu ? "સબ-કેટેગરી (વૈકલ્પિક)" : "Sub-category (Optional)"}
                    </option>
                    {availableSubCategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {isGu ? sub.nameGu : sub.nameEn || sub.nameGu}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    required
                    value={newHabit.title}
                    onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                    placeholder={isGu ? "આદતનું નામ લખો..." : "Enter habit title..."}
                    className="sm:col-span-10 rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white"
                  />

                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={newHabit.targetDays}
                    onChange={(e) => setNewHabit({ ...newHabit, targetDays: Number(e.target.value) })}
                    className="sm:col-span-2 rounded-lg border border-slate-300 px-2.5 py-2 text-xs bg-white text-center"
                    title={isGu ? "ટાર્ગેટ દિવસ" : "Target days"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  {isGu ? "આદત ઉમેરો" : "Add Habit"}
                </button>
              </form>

              {/* Existing Habits */}
              <div className="space-y-2">
                {habits.map((h) => {
                  const cat = resolveHabitCategory(h, categories);
                  const sub = resolveSubCategory(h, cat);

                  return (
                    <div
                      key={h._id}
                      className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border border-slate-200 rounded-lg p-3"
                    >
                      <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border shrink-0 ${cat.badgeClass}`}>
                          {isGu ? cat.labelGu : cat.labelEn}
                        </span>
                        {sub && (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                            {isGu ? sub.nameGu : sub.nameEn || sub.nameGu}
                          </span>
                        )}
                        <span className="text-sm text-slate-800 truncate">
                          {isGu ? h.titleGu : h.titleEn || h.titleGu}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <label className="text-xs text-slate-500">
                          {isGu ? "ટાર્ગેટ:" : "Target:"}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={31}
                          defaultValue={h.targetDays}
                          onBlur={(e) => {
                            const val = Math.min(31, Math.max(1, Number(e.target.value) || 25));
                            if (val !== h.targetDays) {
                              onUpdateHabit(h._id, { targetDays: val });
                            }
                          }}
                          className="w-14 text-center text-xs font-semibold border border-slate-300 rounded-md py-1"
                        />
                        <button
                          type="button"
                          onClick={() => onDeleteHabit(h._id)}
                          className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Delete habit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Create Category Form (single input field) */}
              <form onSubmit={handleAddCategory} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-slate-800">
                  {isGu ? "નવી હેબિટ કેટેગરી ઉમેરો" : "Create New Habit Category"}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <input
                    type="text"
                    required
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder={isGu ? "કેટેગરીનું નામ લખો (દા.ત. નાણાં / Finance)" : "Enter category name..."}
                    className="sm:col-span-7 rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white"
                  />

                  <div className="sm:col-span-5 flex items-center gap-1.5 flex-wrap">
                    {Object.values(COLOR_PALETTES).map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setNewCategory({ ...newCategory, color: p.key })}
                        className={`w-6 h-6 rounded-full ${p.swatchClass} cursor-pointer transition ${
                          newCategory.color === p.key ? "ring-2 ring-offset-2 ring-slate-900 scale-110" : "opacity-75 hover:opacity-100"
                        }`}
                        title={p.label}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4" />
                  {isGu ? "કેટેગરી ઉમેરો" : "Add Category"}
                </button>
              </form>

              {/* Category Cards + Sub-Category Management */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const palette = COLOR_PALETTES[cat.color] || COLOR_PALETTES.emerald;
                  const subName = subInputs[cat._id] || "";

                  return (
                    <div key={cat._id} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${palette.badgeClass}`}>
                          {isGu ? cat.nameGu : cat.nameEn || cat.nameGu}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategoryClick(cat._id)}
                          className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title={isGu ? "કેટેગરી ડિલીટ કરો" : "Delete category"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Sub-category list */}
                      <div>
                        <p className="text-[11px] font-medium text-slate-500 mb-1.5">
                          {isGu ? "સબ-કેટેગરી:" : "Sub-categories:"}
                        </p>
                        {cat.subCategories?.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {cat.subCategories.map((sub) => (
                              <span
                                key={sub._id}
                                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {isGu ? sub.nameGu : sub.nameEn || sub.nameGu}
                                <button
                                  type="button"
                                  onClick={() => onDeleteSubCategory(cat._id, sub._id)}
                                  className="text-slate-400 hover:text-rose-600 cursor-pointer"
                                  title="Remove sub-category"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">
                            {isGu ? "કોઈ સબ-કેટેગરી નથી" : "No sub-categories yet"}
                          </p>
                        )}
                      </div>

                      {/* Add Sub-Category single input form */}
                      <form
                        onSubmit={(e) => handleAddSubCategory(e, cat._id)}
                        className="pt-2 border-t border-slate-100 flex gap-1.5"
                      >
                        <input
                          type="text"
                          value={subName}
                          onChange={(e) =>
                            setSubInputs((prev) => ({
                              ...prev,
                              [cat._id]: e.target.value
                            }))
                          }
                          placeholder={isGu ? "સબ-કેટેગરી ઉમેરો..." : "Add sub-category..."}
                          className="flex-1 min-w-0 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                        />
                        <button
                          type="submit"
                          disabled={busy}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 cursor-pointer"
                        >
                          + {isGu ? "ઉમેરો" : "Add"}
                        </button>
                      </form>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetDefaults}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isGu ? "PDF ની ૧૫ મૂળ આદતો રીસ્ટોર કરો" : "Restore 15 PDF Default Habits"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer"
          >
            {isGu ? "બંધ કરો" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
