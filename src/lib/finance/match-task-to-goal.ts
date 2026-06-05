import type { FinancialGoal } from "@/types/goals";

const DEBT_KEYWORDS = [
  "долг",
  "кредит",
  "займ",
  "ипотек",
  "карт",
  "платеж",
  "погас",
  "процент",
];
const CUSHION_KEYWORDS = [
  "подушк",
  "резерв",
  "накоп",
  "сбереж",
  "отлож",
  "копил",
];
const EXPENSE_KEYWORDS = [
  "расход",
  "подписк",
  "сократ",
  "эконом",
  "отказ",
  "лишн",
];

export interface TaskGoalMatch {
  goalId: string | null;
  progressAmount: number | null;
}

function taskText(title: string, description: string | null): string {
  return `${title} ${description ?? ""}`.toLowerCase();
}

function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

function titleOverlap(taskTitle: string, goalTitle: string): boolean {
  const words = goalTitle
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const task = taskTitle.toLowerCase();
  return words.some((w) => task.includes(w));
}

function extractRubAmount(text: string): number | null {
  const match = text.match(/(\d[\d\s]{0,8})\s*(₽|руб\.?|rub)/i);
  if (!match) return null;
  const value = Number(match[1].replace(/\s/g, ""));
  return Number.isFinite(value) && value > 0 ? value : null;
}

function estimateProgressAmount(
  goal: FinancialGoal,
  text: string
): number | null {
  if (goal.type === "debt_payoff") return null;

  const remaining = Math.max(0, goal.target_amount - goal.current_amount);
  if (remaining <= 0) return null;

  const extracted = extractRubAmount(text);
  if (extracted) return Math.min(remaining, extracted);

  return Math.min(remaining, Math.max(1000, Math.round(remaining * 0.05)));
}

function scoreGoal(
  goal: FinancialGoal,
  text: string,
  debtTitles: string[]
): number {
  let score = 0;

  if (goal.type === "debt_payoff") {
    if (containsAny(text, DEBT_KEYWORDS)) score += 40;
    if (goal.debt_id && debtTitles.some((t) => text.includes(t.toLowerCase()))) {
      score += 50;
    }
    if (titleOverlap(text, goal.title)) score += 20;
  }

  if (goal.type === "safety_cushion") {
    if (containsAny(text, CUSHION_KEYWORDS)) score += 45;
    if (containsAny(text, EXPENSE_KEYWORDS)) score += 15;
    if (titleOverlap(text, goal.title)) score += 25;
  }

  if (goal.type === "custom") {
    if (titleOverlap(text, goal.title)) score += 50;
    if (containsAny(text, EXPENSE_KEYWORDS)) score += 10;
  }

  const remaining = goal.target_amount - goal.current_amount;
  if (remaining > 0) score += 5;

  return score;
}

export function matchTaskToGoal(
  title: string,
  description: string | null,
  goals: FinancialGoal[],
  debtTitles: string[] = []
): TaskGoalMatch {
  const text = taskText(title, description);
  const activeGoals = goals.filter(
    (g) => g.current_amount < g.target_amount
  );

  if (activeGoals.length === 0) {
    return { goalId: null, progressAmount: null };
  }

  const ranked = activeGoals
    .map((goal) => ({ goal, score: scoreGoal(goal, text, debtTitles) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return { goalId: null, progressAmount: null };
  }

  const best = ranked[0].goal;
  return {
    goalId: best.id,
    progressAmount: estimateProgressAmount(best, text),
  };
}

export function pickPrimaryGoal(goals: FinancialGoal[]): FinancialGoal | null {
  const incomplete = goals.filter((g) => g.current_amount < g.target_amount);
  if (incomplete.length === 0) return null;

  return [...incomplete].sort((a, b) => {
    const progressA = a.current_amount / a.target_amount;
    const progressB = b.current_amount / b.target_amount;
    if (progressA !== progressB) return progressA - progressB;

    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    return 0;
  })[0];
}
