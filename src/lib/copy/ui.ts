/** Пользовательские подписи без финансового жаргона */

export const COPY = {
  moneyScore: "Оценка денег",
  moneyScoreHint: "Насколько спокойно с деньгами — от 0 до 100",
  leftPerMonth: "Остаётся в месяц",
  debtIncomeShare: "Доля дохода на долги",
  whatChanges: "Что изменится",
  howLikely: "Насколько это реально",
  afterDone: "Если сделать это:",
  goalFaster: "Цель",
  monthlySavings: "Экономия",
} as const;

export function importanceLabel(score: number): string {
  if (score >= 80) return "Очень важно";
  if (score >= 60) return "Важно";
  if (score >= 40) return "Стоит сделать";
  return "Можно позже";
}

export function benefitLabel(score: number, textLabel?: string | null): string {
  const normalized = normalizeBenefitLabel(textLabel);
  if (normalized !== textLabel && textLabel) return normalized;

  if (score >= 70) return "Сильно поможет";
  if (score >= 45) return "Заметно поможет";
  return "Немного поможет";
}

export function normalizeBenefitLabel(label: string | null | undefined): string {
  if (!label) return "Заметно поможет";
  const t = label.toLowerCase();
  if (t.includes("высок") || t.includes("сильно")) return "Сильно поможет";
  if (t.includes("средн") || t.includes("заметно")) return "Заметно поможет";
  if (t.includes("низк") || t.includes("немного")) return "Немного поможет";
  if (t.includes("эффект")) return benefitLabel(50, null);
  return label;
}

export const BENEFIT_LABELS = {
  high: "Сильно поможет",
  medium: "Заметно поможет",
  low: "Немного поможет",
} as const;
