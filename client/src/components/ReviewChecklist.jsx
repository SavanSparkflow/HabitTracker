import { Check } from "lucide-react";
import { DIMENSION_META, toGuNumber } from "../constants/dimensions";

export default function ReviewChecklist({
  weeklyChecklist,
  monthlyChecklist,
  quarterlyReview,
  quarter,
  onUpdateChecklist,
  lang
}) {
  const isGu = lang === "gu";
  const fmt = (n) => (isGu ? toGuNumber(n) : n);
  const weekKeys = ["w1", "w2", "w3", "w4"];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">
          {isGu
            ? "સાપ્તાહિક, માસિક અને ત્રિમાસિક રિવ્યૂ ચેકલિસ્ટ"
            : "Weekly, Monthly & Quarterly Review Checklist"}
        </h2>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200 text-slate-700">
          Q{fmt(quarter)}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-900 text-white text-xs">
              <th className="text-left px-4 py-2.5 font-semibold w-44">
                {isGu ? "સમયગાળો" : "Timeframe"}
              </th>
              <th className="text-left px-4 py-2.5 font-semibold w-44">
                {isGu ? "ડાયમેન્શન" : "Dimension"}
              </th>
              <th className="text-left px-4 py-2.5 font-semibold">
                {isGu ? "કરવાની મહત્ત્વની એક્ટિવિટીઝ (Action Items)" : "Key Action Items"}
              </th>
              <th className="text-center px-3 py-2.5 font-semibold w-24">
                {isGu ? "અઠવાડિયું ૧" : "Week 1"}
              </th>
              <th className="text-center px-3 py-2.5 font-semibold w-24">
                {isGu ? "અઠવાડિયું ૨" : "Week 2"}
              </th>
              <th className="text-center px-3 py-2.5 font-semibold w-24">
                {isGu ? "અઠવાડિયું ૩" : "Week 3"}
              </th>
              <th className="text-center px-3 py-2.5 font-semibold w-24">
                {isGu ? "અઠવાડિયું ૪" : "Week 4"}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
            {/* Weekly Rows */}
            {weeklyChecklist.map((item) => {
              const meta = DIMENSION_META[item.dimension] || DIMENSION_META.body;
              return (
                <tr key={item.key} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {isGu ? "વીકલી (દર અઠવાડિયે)" : "Weekly (Every Week)"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border ${meta.badgeClass}`}>
                      {isGu ? meta.labelGu : meta.labelEn}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-800">
                    {isGu ? item.titleGu : item.titleEn || item.titleGu}
                  </td>

                  {weekKeys.map((wk) => {
                    const checked = Boolean(item.weeks?.[wk]);
                    return (
                      <td key={wk} className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateChecklist({
                              type: "weekly",
                              key: item.key,
                              weekKey: wk,
                              value: !checked
                            })
                          }
                          className={`w-7 h-7 rounded-md border inline-flex items-center justify-center transition cursor-pointer ${
                            checked
                              ? meta.activeCheckClass
                              : "border-slate-300 bg-white hover:border-slate-400"
                          }`}
                        >
                          {checked && <Check className="w-4 h-4 stroke-[2.5]" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Monthly Rows */}
            {monthlyChecklist.map((item) => (
              <tr key={item.key} className="bg-slate-50/50 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-700">
                  {isGu ? "મંથલી (દર મહિને)" : "Monthly (Every Month)"}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {isGu ? item.labelGu : item.labelEn || item.labelGu}
                </td>
                <td className="px-4 py-3 text-slate-800">
                  {isGu ? item.actionGu : item.actionEn || item.actionGu}
                </td>
                <td colSpan={4} className="px-4 py-3">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-xs text-slate-500 mr-1">
                      {isGu ? "માસિક લક્ષ્ય પૂર્ણ:" : "Monthly Goal:"}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateChecklist({ type: "monthly", key: item.key, status: "done" })
                      }
                      className={`px-3 py-1 rounded-md text-xs font-semibold border transition cursor-pointer ${
                        item.status === "done"
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {isGu ? "હા" : "Done"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateChecklist({ type: "monthly", key: item.key, status: "pending" })
                      }
                      className={`px-3 py-1 rounded-md text-xs font-semibold border transition cursor-pointer ${
                        item.status === "pending"
                          ? "bg-amber-500 text-white border-amber-500"
                          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {isGu ? "બાકી" : "Pending"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Quarterly Row */}
            {quarterlyReview && (
              <tr className="bg-indigo-50/30 hover:bg-indigo-50/50">
                <td className="px-4 py-3 font-medium text-slate-700">
                  {isGu ? "ક્વાર્ટરલી (દર ૩ મહિને)" : "Quarterly (Every 3 Months)"}
                </td>
                <td className="px-4 py-3 font-semibold text-indigo-900">
                  {isGu ? "ચારેય ડાયમેન્શન" : "All 4 Dimensions"}
                </td>
                <td className="px-4 py-3 text-slate-800">
                  {isGu
                    ? quarterlyReview.actionGu
                    : quarterlyReview.actionEn || quarterlyReview.actionGu}
                </td>
                <td colSpan={4} className="px-4 py-3">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-xs text-slate-500 mr-1">
                      {isGu ? "ત્રિમાસિક લક્ષ્ય પૂર્ણ:" : "Quarterly Goal:"}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateChecklist({ type: "quarterly", status: "done" })
                      }
                      className={`px-3 py-1 rounded-md text-xs font-semibold border transition cursor-pointer ${
                        quarterlyReview.status === "done"
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {isGu ? "હા" : "Done"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateChecklist({ type: "quarterly", status: "pending" })
                      }
                      className={`px-3 py-1 rounded-md text-xs font-semibold border transition cursor-pointer ${
                        quarterlyReview.status === "pending"
                          ? "bg-amber-500 text-white border-amber-500"
                          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {isGu ? "બાકી" : "Pending"}
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
