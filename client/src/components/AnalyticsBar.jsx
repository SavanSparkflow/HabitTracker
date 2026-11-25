import { COLOR_PALETTES, toGuNumber } from "../constants/dimensions";

export default function AnalyticsBar({
  habits,
  categories,
  completedMap,
  targetScorePercent,
  onTargetScoreChange,
  lang
}) {
  const isGu = lang === "gu";
  const fmt = (n) => (isGu ? toGuNumber(n) : n);

  const categoryTotals = {};
  for (const cat of categories) {
    categoryTotals[cat.key] = { done: 0, target: 0 };
  }

  let grandDone = 0;
  let grandTarget = 0;

  for (const habit of habits) {
    const done = (completedMap[habit._id] || []).length;
    grandDone += done;
    grandTarget += habit.targetDays;

    const matchedCat = categories.find(
      (c) => c._id === habit.categoryId || c.key === habit.dimension
    );
    const key = matchedCat ? matchedCat.key : habit.dimension;
    if (!categoryTotals[key]) {
      categoryTotals[key] = { done: 0, target: 0 };
    }
    categoryTotals[key].done += done;
    categoryTotals[key].target += habit.targetDays;
  }

  const overallPercent = grandTarget > 0 ? Math.min(100, Math.round((grandDone / grandTarget) * 100)) : 0;
  const isOnTrack = overallPercent >= targetScorePercent;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {/* Overall Monthly Score Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {isGu ? "માસિક સ્કોર" : "Monthly Score"}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{fmt(overallPercent)}%</span>
              <span className="text-xs text-slate-500">
                ({fmt(grandDone)} / {fmt(grandTarget)})
              </span>
            </div>
          </div>

          <div className="text-right">
            <label className="block text-[11px] text-slate-500">
              {isGu ? "લક્ષ્ય %" : "Target %"}
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={targetScorePercent}
              onChange={(e) => onTargetScoreChange(Number(e.target.value))}
              className="w-14 mt-0.5 text-right text-xs font-semibold border border-slate-200 rounded-md px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isOnTrack ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <p className={`text-[11px] mt-1.5 font-medium ${isOnTrack ? "text-emerald-700" : "text-amber-700"}`}>
            {isOnTrack
              ? isGu
                ? "લક્ષ્ય મુજબ ઉત્તમ પ્રગતિ!"
                : "On track with monthly goal!"
              : isGu
                ? `લક્ષ્ય (${fmt(targetScorePercent)}%) સુધી પહોંચવા પ્રયત્ન ચાલુ રાખો`
                : `Keep going toward your ${targetScorePercent}% target`}
          </p>
        </div>
      </div>

      {/* Dynamic Category Cards */}
      {categories.map((cat) => {
        const palette = COLOR_PALETTES[cat.color] || COLOR_PALETTES.emerald;
        const stats = categoryTotals[cat.key] || { done: 0, target: 0 };
        const pct = stats.target > 0 ? Math.min(100, Math.round((stats.done / stats.target) * 100)) : 0;

        return (
          <div
            key={cat._id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border truncate ${palette.badgeClass}`}>
                {isGu ? cat.nameGu : cat.nameEn || cat.nameGu}
              </span>
              <span className="text-sm font-bold text-slate-800 shrink-0">{fmt(pct)}%</span>
            </div>

            <div className="mt-3">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${palette.barClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {fmt(stats.done)} / {fmt(stats.target)} {isGu ? "પૂર્ણ" : "completed"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
