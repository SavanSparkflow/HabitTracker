import { useEffect, useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";

export default function SelfReflection({ reflections, onSave, lang }) {
  const isGu = lang === "gu";
  const [form, setForm] = useState({
    biggestWin: "",
    dimensionNeedingFocus: "",
    nextMonthResolution: ""
  });
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setForm({
      biggestWin: reflections?.biggestWin || "",
      dimensionNeedingFocus: reflections?.dimensionNeedingFocus || "",
      nextMonthResolution: reflections?.nextMonthResolution || ""
    });
  }, [reflections]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSavedNotice(false);
    try {
      await onSave(form);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  const prompts = [
    {
      field: "biggestWin",
      labelGu: "૧. આ મહિનાની સૌથી મોટી સફળતા / સુધારો:",
      labelEn: "1. Biggest win / improvement this month:",
      placeholderGu: "આ મહિને તમે કઈ આદતમાં સૌથી સારો સુધારો જોયો?",
      placeholderEn: "Which habit gave you the biggest breakthrough this month?"
    },
    {
      field: "dimensionNeedingFocus",
      labelGu: "૨. કયા ડાયમેન્શનમાં વધુ ધ્યાન આપવાની જરૂર છે?",
      labelEn: "2. Which dimension needs more focus?",
      placeholderGu: "શારીરિક, માનસિક, ભાવનાત્મક કે આધ્યાત્મિક — ક્યાં સુધારો જરૂરી છે?",
      placeholderEn: "Body, Mind, Heart, or Soul — where do you want to improve?"
    },
    {
      field: "nextMonthResolution",
      labelGu: "૩. આવતા મહિનાનો મુખ્ય સંકલ્પ:",
      labelEn: "3. Main resolution for next month:",
      placeholderGu: "આવતા મહિના માટે ૧ સ્પષ્ટ સંકલ્પ લખો...",
      placeholderEn: "Write 1 clear commitment for next month..."
    }
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
    >
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-slate-900">
          {isGu
            ? "મહિનાના અંતે આત્મનિરીક્ષણ (Self-Reflection નોંધ)"
            : "End-of-Month Self-Reflection Notes"}
        </h2>

        <div className="flex items-center gap-3 no-print">
          {savedNotice && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isGu ? "નોંધ સેવ થઈ ગઈ" : "Saved"}
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-semibold transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? (isGu ? "સેવ થાય છે..." : "Saving...") : isGu ? "નોંધ સેવ કરો" : "Save Notes"}
          </button>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {prompts.map((item) => (
          <div key={item.field} className="flex flex-col">
            <label className="text-sm font-semibold text-slate-800 mb-2">
              {isGu ? item.labelGu : item.labelEn}
            </label>
            <textarea
              rows={4}
              value={form[item.field]}
              onChange={(e) => setForm({ ...form, [item.field]: e.target.value })}
              placeholder={isGu ? item.placeholderGu : item.placeholderEn}
              className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y bg-slate-50/40"
            />
          </div>
        ))}
      </div>
    </form>
  );
}
