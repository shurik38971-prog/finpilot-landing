export interface OnboardingProgress {
  id: string;
  user_id: string;
  income_done: boolean;
  expenses_done: boolean;
  debts_done: boolean;
  goal_done: boolean;
  analysis_done: boolean;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export type OnboardingStep =
  | "income"
  | "expenses"
  | "debts"
  | "goal"
  | "analysis";
