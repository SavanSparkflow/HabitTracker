import { Check, Plus } from "lucide-react";
import {
  resolveHabitCategory,
  resolveSubCategory,
  toGuNumber
} from "../constants/dimensions";

export default function MonthlyMatrixGrid({
  habits,
  categories,
  completedMap,
  daysInMonth,
  currentDayHighlight,
  onToggleDay,
  onOpenHabitManager,
  lang
}) {
  const isGu = lang === "gu";
  const fmt = (n) => (isGu ? toGuNumber(n) : n);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const dailyTotals = days.map((day) =>
    habits.reduce((acc, h) => ((completedMap[h._id] || []).includes(day) ? acc + 1 : acc), 0)
  );
  const grandTotal = dailyTotals.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2 no-print">
        <span className="text-xs font-semibold text-slate-700">
          {isGu ? `કુલ આદતો: ${fmt(habits.length)}` : `Total Habits: ${habits.length}`}
        </span>
        {onOpenHabitManager && (
          <button
            type="button"
            onClick={onOpenHabitManager}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {isGu ? "નવી આદત ઉમેરો" : "Add Habit"}
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="sticky left-0 z-20 bg-slate-900 text-left px-3 py-2.5 font-semibold min-w-[130px] border-r border-slate-700">
                {isGu ? "કેટેગરી" : "Category"}
              </th>
              <th className="sticky left-[130px] z-20 bg-slate-900 text-left px-3 py-2.5 font-semibold min-w-[240px] border-r border-slate-700">
                {isGu ? "રોજિંદી એક્ટિવિટી (આદત)" : "Daily Activity (Habit)"}
              </th>

              {days.map((day) => (
                <th
                  key={day}
                  className={`px-1 py-2 text-center font-semibold min-w-[30px] ${
                    day === currentDayHighlight ? "bg-amber-500 text-slate-950" : ""
                  }`}
                >
                  {fmt(day)}
                </th>
              ))}

              <th className="sticky right-0 z-20 bg-slate-900 text-center px-3 py-2.5 font-semibold min-w-[82px] border-l border-slate-700">
                {isGu ? "કુલ / ટાર્ગેટ" : "Total / Target"}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {habits.map((habit) => {
              const cat = resolveHabitCategory(habit, categories);
              const sub = resolveSubCategory(habit, cat);
              const completedDays = completedMap[habit._id] || [];
              const targetMet = completedDays.length >= habit.targetDays;

              return (
                <tr key={habit._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="sticky left-0 z-10 bg-white px-2.5 py-2 border-r border-slate-200">
                    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded border ${cat.badgeClass}`}>
                      {isGu ? cat.labelGu : cat.labelEn}
                    </span>
                  </td>

                  <td className="sticky left-[130px] z-10 bg-white px-3 py-2 font-medium text-slate-800 border-r border-slate-200">
                    <div>{isGu ? habit.titleGu : habit.titleEn || habit.titleGu}</div>
                    {sub && (
                      <span className="inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                        {isGu ? sub.nameGu : sub.nameEn || sub.nameGu}
                      </span>
                    )}
                  </td>

                  {days.map((day) => {
                    const isDone = completedDays.includes(day);
                    return (
                      <td
                        key={day}
                        className={`p-0.5 text-center border-r border-slate-100 ${
                          day === currentDayHighlight ? "bg-amber-50/60" : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onToggleDay(habit._id, day)}
                          title={`${isGu ? habit.titleGu : habit.titleEn} — ${day}`}
                          className={`w-6 h-6 rounded inline-flex items-center justify-center border transition cursor-pointer ${
                            isDone
                              ? cat.activeCheckClass
                              : "border-slate-200 bg-white hover:border-slate-400"
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[2.75]" />}
                        </button>
                      </td>
                    );
                  })}

                  <td className="sticky right-0 z-10 bg-slate-50 px-2.5 py-2 text-center font-bold border-l border-slate-200">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] ${
                        targetMet
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200/80 text-slate-700"
                      }`}
                    >
                      {fmt(completedDays.length)} / {fmt(habit.targetDays)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
              <td
                colSpan={2}
                className="sticky left-0 z-10 bg-slate-100 px-3 py-2.5 border-r border-slate-300"
              >
                {isGu
                  ? `દૈનિક કુલ સ્કોર (${fmt(habits.length)} માંથી)`
                  : `Daily Total Score (out of ${habits.length})`}
              </td>

              {dailyTotals.map((total, idx) => (
                <td key={idx + 1} className="px-1 py-2 text-center border-r border-slate-200">
                  {fmt(total)}
                </td>
              ))}

              <td className="sticky right-0 z-10 bg-slate-200 px-3 py-2 text-center border-l border-slate-300">
                {fmt(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
