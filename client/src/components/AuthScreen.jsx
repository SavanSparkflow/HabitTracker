import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import api from "../api/client";

export default function AuthScreen({ onAuthSuccess }) {
  const [mode, setMode] = useState("register");
  const [lang, setLang] = useState("gu");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isGu = lang === "gu";

  useEffect(() => {
    document.title = isGu
      ? "Sharpen The Saw | ૭મી આદત – માસિક હેબિટ ટ્રેકર"
      : "Sharpen The Saw | Monthly Habit Tracker";
  }, [isGu]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "register" ? "/auth/register" : "/auth/login";
      const payload =
        mode === "register"
          ? { ...form, preferredLang: lang }
          : { email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem("sts_token", data.token);
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Info Panel */}
        <div className="bg-slate-900 text-white p-8 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Sharpen the Saw — 7th Habit
            </div>
            <h1 className="text-2xl font-bold leading-snug mb-3">
              {isGu
                ? "૭મી આદત – માસિક હેબિટ ટ્રેકર"
                : "7th Habit – Monthly Habit Tracker"}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {isGu
                ? "શારીરિક (Body), માનસિક (Mind), ભાવનાત્મક (Heart) અને આધ્યાત્મિક (Soul) — સંપૂર્ણ વિકાસ માટેનું ડિજિટલ દૈનિક રજિસ્ટર."
                : "Your digital daily register for holistic growth across Body, Mind, Heart, and Soul."}
            </p>

            <ul className="space-y-3 text-sm text-slate-200">
              {[
                isGu ? "PDF ની તમામ ૧૫ દૈનિક આદતો auto-loaded" : "All 15 PDF habits pre-loaded automatically",
                isGu ? "સાપ્તાહિક, માસિક અને ત્રિમાસિક રિવ્યૂ ચેકલિસ્ટ" : "Weekly, Monthly & Quarterly review checklists",
                isGu ? "ઓટોમેટિક સ્કોર ગણતરી અને આત્મનિરીક્ષણ નોંધ" : "Auto-calculated scores & end-of-month reflection"
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Language / ભાષા</span>
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5">
              <button
                type="button"
                onClick={() => setLang("gu")}
                className={`px-2.5 py-1 rounded-md transition ${
                  lang === "gu" ? "bg-emerald-500 text-white" : "text-slate-300"
                }`}
              >
                ગુજરાતી
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-md transition ${
                  lang === "en" ? "bg-emerald-500 text-white" : "text-slate-300"
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 flex flex-col justify-center">
          <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
                mode === "register" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
            >
              {isGu ? "નવું એકાઉન્ટ" : "Create Account"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
                mode === "login" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
            >
              {isGu ? "લોગિન કરો" : "Sign In"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {isGu ? "તમારું નામ" : "Your Name"}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={isGu ? "દા.ત. સાવન પટેલ" : "e.g. Savan Patel"}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {isGu ? "ઈમેલ" : "Email"}
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {isGu ? "પાસવર્ડ (ઓછામાં ઓછા ૬ અક્ષર)" : "Password (min 6 chars)"}
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-sm transition cursor-pointer"
            >
              {loading
                ? isGu
                  ? "રાહ જુઓ..."
                  : "Please wait..."
                : mode === "register"
                  ? isGu
                    ? "ટ્રેકર શરૂ કરો"
                    : "Start Tracking"
                  : isGu
                    ? "લોગિન કરો"
                    : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
