import { Habit } from "../models/Habit.js";
import { HabitCategory } from "../models/HabitCategory.js";

export const DEFAULT_CATEGORIES = [
  {
    key: "body",
    nameGu: "શારીરિક (Body)",
    nameEn: "Physical (Body)",
    color: "emerald",
    order: 1,
    subCategories: [
      { nameGu: "કસરત અને યોગ", nameEn: "Exercise & Yoga" },
      { nameGu: "આહાર અને ઊંઘ", nameEn: "Diet & Sleep" }
    ]
  },
  {
    key: "mind",
    nameGu: "માનસિક (Mind)",
    nameEn: "Mental (Mind)",
    color: "sky",
    order: 2,
    subCategories: [
      { nameGu: "વાંચન અને શીખવું", nameEn: "Reading & Learning" },
      { nameGu: "આયોજન અને લખાણ", nameEn: "Planning & Writing" }
    ]
  },
  {
    key: "heart",
    nameGu: "ભાવનાત્મક (Heart)",
    nameEn: "Emotional (Heart)",
    color: "rose",
    order: 3,
    subCategories: [
      { nameGu: "પરિવાર અને સંબંધો", nameEn: "Family & Relationships" },
      { nameGu: "સેવા અને કૃતજ્ઞતા", nameEn: "Service & Kindness" }
    ]
  },
  {
    key: "soul",
    nameGu: "આધ્યાત્મિક (Soul)",
    nameEn: "Spiritual (Soul)",
    color: "purple",
    order: 4,
    subCategories: [
      { nameGu: "ધ્યાન અને પ્રાર્થના", nameEn: "Meditation & Prayer" },
      { nameGu: "આત્મનિરીક્ષણ અને જર્નલ", nameEn: "Reflection & Journal" }
    ]
  }
];

/**
 * Default 15 habits from the "7th Habit (Sharpen the Saw) - Monthly Habit Tracker" PDF.
 */
export const DEFAULT_HABITS = [
  // Body (4)
  {
    dimension: "body",
    titleGu: "૩૦ મિનિટ કસરત / ઝડપી ચાલવું",
    titleEn: "30 mins exercise / brisk walking",
    targetDays: 25,
    order: 1
  },
  {
    dimension: "body",
    titleGu: "૭ થી ૮ કલાક ગાઢ અને પૂરતી ઊંઘ",
    titleEn: "7 to 8 hours of deep quality sleep",
    targetDays: 28,
    order: 2
  },
  {
    dimension: "body",
    titleGu: "પૌષ્ટિક ઘરનો આહાર અને ૩+ લિટર પાણી",
    titleEn: "Nutritious home-cooked food & 3+ liters water",
    targetDays: 28,
    order: 3
  },
  {
    dimension: "body",
    titleGu: "૧૦ મિનિટ પ્રાણાયામ અને શાંત આરામ",
    titleEn: "10 mins pranayama & calm rest",
    targetDays: 25,
    order: 4
  },

  // Mind (4)
  {
    dimension: "mind",
    titleGu: "૧૦ થી ૧૫ પાનાં સારું પુસ્તક વાંચવું",
    titleEn: "Read 10 to 15 pages of a good book",
    targetDays: 25,
    order: 5
  },
  {
    dimension: "mind",
    titleGu: "જ્ઞાનવર્ધક વીડિયો / પોડકાસ્ટ સાંભળવો",
    titleEn: "Watch/listen to educational video or podcast",
    targetDays: 20,
    order: 6
  },
  {
    dimension: "mind",
    titleGu: "દિવસના ટોપ ૩ કામ અને વિચારો લખવા",
    titleEn: "Write top 3 priorities & thoughts of the day",
    targetDays: 26,
    order: 7
  },
  {
    dimension: "mind",
    titleGu: "નવી સ્કિલ શીખવા ૧૫-૨૦ મિનિટ આપવી",
    titleEn: "Spend 15-20 mins learning a new skill",
    targetDays: 20,
    order: 8
  },

  // Heart (3)
  {
    dimension: "heart",
    titleGu: "પરિવાર સાથે મોબાઈલ વગર ભોજન-સંવાદ",
    titleEn: "Phone-free meal & conversation with family",
    targetDays: 28,
    order: 9
  },
  {
    dimension: "heart",
    titleGu: "હસવું, પ્રેમભાવ અને કોઈની પ્રશંસા કરવી",
    titleEn: "Smile, show warmth & appreciate someone",
    targetDays: 30,
    order: 10
  },
  {
    dimension: "heart",
    titleGu: "કોઈને નિઃસ્વાર્થ મદદ / શ્રેષ્ઠ સેવા આપવી",
    titleEn: "Selfless help or great service to someone",
    targetDays: 25,
    order: 11
  },

  // Soul (4)
  {
    dimension: "soul",
    titleGu: "૧૦ થી ૧૫ મિનિટ શાંત ધ્યાન કરવું",
    titleEn: "10 to 15 mins silent meditation",
    targetDays: 28,
    order: 12
  },
  {
    dimension: "soul",
    titleGu: "રાત્રે આભાર ડાયરી / જર્નલ લખવી",
    titleEn: "Write gratitude diary / journal at night",
    targetDays: 28,
    order: 13
  },
  {
    dimension: "soul",
    titleGu: "સવારે પ્રાર્થના / મંત્ર જાપ કરવો",
    titleEn: "Morning prayer / mantra chanting",
    targetDays: 30,
    order: 14
  },
  {
    dimension: "soul",
    titleGu: "સકારાત્મક કન્ટેન્ટ જ જોવું-સાંભળવું",
    titleEn: "Consume only positive content",
    targetDays: 28,
    order: 15
  }
];

export const DEFAULT_WEEKLY_CHECKLIST = [
  {
    key: "weekly_body",
    dimension: "body",
    titleGu: "૧ દિવસ ડિજિટલ ડિટોક્સ (સોશિયલ મીડિયા/ટીવી બંધ) અને સંપૂર્ણ આરામ",
    titleEn: "1 day digital detox (no social media/TV) & complete rest",
    weeks: { w1: false, w2: false, w3: false, w4: false }
  },
  {
    key: "weekly_mind",
    dimension: "mind",
    titleGu: "અઠવાડિયાના પ્લાનનો રિવ્યૂ કરવો અને ૧ નવો એજ્યુકેશનલ વીડિયો/પોડકાસ્ટ જોવો",
    titleEn: "Review weekly plan & watch 1 new educational video/podcast",
    weeks: { w1: false, w2: false, w3: false, w4: false }
  },
  {
    key: "weekly_heart",
    dimension: "heart",
    titleGu: "૧ જૂના મિત્ર કે સંબંધીને ફોન કરવો; પરિવાર સાથે બહાર ફરવા જવું",
    titleEn: "Call 1 old friend or relative; go out with family",
    weeks: { w1: false, w2: false, w3: false, w4: false }
  },
  {
    key: "weekly_soul",
    dimension: "soul",
    titleGu: "આખા અઠવાડિયાની ડાયરી વાંચવી અને પોતાના લક્ષ્યો તપાસવા",
    titleEn: "Read the whole week's journal & review personal goals",
    weeks: { w1: false, w2: false, w3: false, w4: false }
  }
];

export const DEFAULT_MONTHLY_CHECKLIST = [
  {
    key: "monthly_body_mind",
    labelGu: "શારીરિક & માનસિક",
    labelEn: "Body & Mind",
    actionGu: "વજન-ડાયટ રૂટિન ચેકઅપ; ૧ આખું પુસ્તક પૂરું કરવું અને ૧ નવી સ્કિલ શીખવી",
    actionEn: "Weight-diet routine checkup; finish 1 full book & learn 1 new skill",
    status: "pending"
  },
  {
    key: "monthly_heart_soul",
    labelGu: "ભાવનાત્મક & આધ્યાત્મિક",
    labelEn: "Heart & Soul",
    actionGu: "ટીમ/સ્ટાફ સાથે અનૌપચારિક મીટિંગ, સેવા કાર્ય અને ૧-૨ કલાક એકાંત ચિંતન",
    actionEn: "Informal team/staff catch-up, service act & 1-2 hours of solitude reflection",
    status: "pending"
  }
];

/**
 * Seeds default 4 categories (Body, Mind, Heart, Soul) with starter subcategories if none exist.
 */
export async function seedDefaultCategoriesForUser(userId) {
  const existingCount = await HabitCategory.countDocuments({ userId });
  if (existingCount > 0) {
    return HabitCategory.find({ userId, isActive: true }).sort({ order: 1, createdAt: 1 });
  }

  const docs = DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    userId,
    isActive: true
  }));

  return HabitCategory.insertMany(docs);
}

/**
 * Seeds the 15 default PDF habits for a newly created user if they have none.
 */
export async function seedDefaultHabitsForUser(userId) {
  const categories = await seedDefaultCategoriesForUser(userId);
  const existingCount = await Habit.countDocuments({ userId });
  if (existingCount > 0) {
    return Habit.find({ userId, isActive: true }).sort({ order: 1 });
  }

  const catByKey = Object.fromEntries(categories.map((c) => [c.key, c]));

  const docs = DEFAULT_HABITS.map((habit) => ({
    ...habit,
    userId,
    categoryId: catByKey[habit.dimension]?._id || null,
    isActive: true
  }));

  return Habit.insertMany(docs);
}
