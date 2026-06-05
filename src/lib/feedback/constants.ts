export const USEFUL_FEATURES = [
  { id: "financial_health", label: "Финансовое здоровье" },
  { id: "main_problem", label: "Главная проблема" },
  { id: "main_action", label: "Главное действие" },
  { id: "goals", label: "Цели" },
  { id: "forecast", label: "Прогноз" },
  { id: "simulator", label: "Финансовый симулятор" },
  { id: "other", label: "Другое" },
] as const;

export type UsefulFeatureId = (typeof USEFUL_FEATURES)[number]["id"];

export const DISAPPEARANCE_OPTIONS = [
  { id: "not_notice", label: "Не замечу" },
  { id: "little", label: "Немного расстроюсь" },
  { id: "unpleasant", label: "Будет неприятно" },
  { id: "very_inconvenient", label: "Будет очень неудобно" },
] as const;

export type DisappearanceId = (typeof DISAPPEARANCE_OPTIONS)[number]["id"];

export const FEEDBACK_MESSAGE_TYPES = [
  { id: "idea" as const, label: "Есть идея", emoji: "💡" },
  { id: "bug" as const, label: "Нашёл проблему", emoji: "🐞" },
  { id: "confusion" as const, label: "Непонятно", emoji: "🤔" },
];

export function featureLabel(id: string): string {
  return USEFUL_FEATURES.find((f) => f.id === id)?.label ?? id;
}

export function disappearanceLabel(id: string): string {
  return DISAPPEARANCE_OPTIONS.find((d) => d.id === id)?.label ?? id;
}
