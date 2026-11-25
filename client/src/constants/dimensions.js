export const COLOR_PALETTES = {
  emerald: {
    key: "emerald",
    label: "Green",
    swatchClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    activeCheckClass: "bg-emerald-600 text-white border-emerald-600 shadow-xs",
    barClass: "bg-emerald-500"
  },
  sky: {
    key: "sky",
    label: "Blue",
    swatchClass: "bg-sky-500",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
    activeCheckClass: "bg-sky-600 text-white border-sky-600 shadow-xs",
    barClass: "bg-sky-500"
  },
  rose: {
    key: "rose",
    label: "Red",
    swatchClass: "bg-rose-500",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
    activeCheckClass: "bg-rose-600 text-white border-rose-600 shadow-xs",
    barClass: "bg-rose-500"
  },
  purple: {
    key: "purple",
    label: "Purple",
    swatchClass: "bg-purple-500",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
    activeCheckClass: "bg-purple-600 text-white border-purple-600 shadow-xs",
    barClass: "bg-purple-500"
  },
  amber: {
    key: "amber",
    label: "Amber",
    swatchClass: "bg-amber-500",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    activeCheckClass: "bg-amber-600 text-white border-amber-600 shadow-xs",
    barClass: "bg-amber-500"
  },
  indigo: {
    key: "indigo",
    label: "Indigo",
    swatchClass: "bg-indigo-500",
    badgeClass: "bg-indigo-50 text-indigo-800 border-indigo-200",
    activeCheckClass: "bg-indigo-600 text-white border-indigo-600 shadow-xs",
    barClass: "bg-indigo-500"
  },
  teal: {
    key: "teal",
    label: "Teal",
    swatchClass: "bg-teal-500",
    badgeClass: "bg-teal-50 text-teal-800 border-teal-200",
    activeCheckClass: "bg-teal-600 text-white border-teal-600 shadow-xs",
    barClass: "bg-teal-500"
  },
  orange: {
    key: "orange",
    label: "Orange",
    swatchClass: "bg-orange-500",
    badgeClass: "bg-orange-50 text-orange-800 border-orange-200",
    activeCheckClass: "bg-orange-600 text-white border-orange-600 shadow-xs",
    barClass: "bg-orange-500"
  }
};

export const DIMENSION_META = {
  body: { key: "body", labelGu: "શારીરિક (Body)", labelEn: "Physical (Body)", ...COLOR_PALETTES.emerald },
  mind: { key: "mind", labelGu: "માનસિક (Mind)", labelEn: "Mental (Mind)", ...COLOR_PALETTES.sky },
  heart: { key: "heart", labelGu: "ભાવનાત્મક (Heart)", labelEn: "Emotional (Heart)", ...COLOR_PALETTES.rose },
  soul: { key: "soul", labelGu: "આધ્યાત્મિક (Soul)", labelEn: "Spiritual (Soul)", ...COLOR_PALETTES.purple }
};

/**
 * Resolves display metadata and Tailwind color classes for a category or habit.
 */
export function resolveHabitCategory(habit, categories = []) {
  const matched =
    categories.find((c) => c._id === habit.categoryId || c.key === habit.dimension) || null;

  if (matched) {
    const palette = COLOR_PALETTES[matched.color] || COLOR_PALETTES.emerald;
    return {
      ...matched,
      labelGu: matched.nameGu,
      labelEn: matched.nameEn || matched.nameGu,
      ...palette
    };
  }

  return DIMENSION_META[habit.dimension] || {
    key: habit.dimension || "other",
    labelGu: habit.dimension || "અન્ય",
    labelEn: habit.dimension || "Other",
    ...COLOR_PALETTES.indigo
  };
}

export function resolveSubCategory(habit, category) {
  if (!habit.subCategoryId || !category?.subCategories?.length) return null;
  return category.subCategories.find((s) => s._id === habit.subCategoryId) || null;
}

export const GUJARATI_DIGITS = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];

export function toGuNumber(num) {
  return String(num)
    .split("")
    .map((ch) => (ch >= "0" && ch <= "9" ? GUJARATI_DIGITS[Number(ch)] : ch))
    .join("");
}

export const MONTHS = [
  { value: 1, gu: "જાન્યુઆરી", en: "January" },
  { value: 2, gu: "ફેબ્રુઆરી", en: "February" },
  { value: 3, gu: "માર્ચ", en: "March" },
  { value: 4, gu: "એપ્રિલ", en: "April" },
  { value: 5, gu: "મે", en: "May" },
  { value: 6, gu: "જૂન", en: "June" },
  { value: 7, gu: "જુલાઈ", en: "July" },
  { value: 8, gu: "ઓગસ્ટ", en: "August" },
  { value: 9, gu: "સપ્ટેમ્બર", en: "September" },
  { value: 10, gu: "ઓક્ટોબર", en: "October" },
  { value: 11, gu: "નવેમ્બર", en: "November" },
  { value: 12, gu: "ડિસેમ્બર", en: "December" }
];
