import type { SupabaseClient } from "@supabase/supabase-js";
import { matchTaskToGoal } from "@/lib/finance/match-task-to-goal";
import type {
  AiAction30Day,
  AiAnalysisResult,
  NextBestAction,
} from "@/types/analysis";
import type { FinancialGoal } from "@/types/goals";
import { addDays, format } from "date-fns";

const MAX_TASKS_PER_ANALYSIS = 5;

const PRIORITY_SCORE: Record<string, number> = {
  high: 75,
  medium: 50,
  low: 25,
};

const PRIORITY_LABEL: Record<string, string> = {
  high: "высокий эффект",
  medium: "средний эффект",
  low: "низкий эффект",
};

interface TaskInsert {
  user_id: string;
  analysis_id: string;
  goal_id: string | null;
  goal_progress_amount: number | null;
  title: string;
  description: string | null;
  impact_score: number;
  impact_label: string | null;
  due_date: string | null;
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, " ").trim();
}

function isSimilarTitle(a: string, b: string): boolean {
  const left = normalizeTitle(a);
  const right = normalizeTitle(b);
  if (!left || !right) return false;
  if (left === right) return true;
  if (left.length >= 10 && right.length >= 10) {
    return left.includes(right) || right.includes(left);
  }
  return false;
}

function dueDateFromDays(days?: number): string | null {
  if (!days || days < 1) return null;
  return format(addDays(new Date(), days), "yyyy-MM-dd");
}

function attachGoal(
  title: string,
  description: string | null,
  goals: FinancialGoal[],
  debtTitles: string[]
): Pick<TaskInsert, "goal_id" | "goal_progress_amount"> {
  const match = matchTaskToGoal(title, description, goals, debtTitles);
  return {
    goal_id: match.goalId,
    goal_progress_amount: match.progressAmount,
  };
}

function mapNextBestAction(
  action: NextBestAction,
  userId: string,
  analysisId: string,
  goals: FinancialGoal[],
  debtTitles: string[]
): TaskInsert {
  const title = action.title.trim();
  const description = action.description?.trim() ?? null;
  const goalLink = attachGoal(title, description, goals, debtTitles);

  return {
    user_id: userId,
    analysis_id: analysisId,
    ...goalLink,
    title,
    description,
    impact_score: Math.min(100, Math.max(1, action.impact_score ?? 80)),
    impact_label: action.impact_label ?? "высокий эффект",
    due_date: dueDateFromDays(action.due_days ?? 7),
  };
}

function mapAction30Day(
  action: AiAction30Day,
  userId: string,
  analysisId: string,
  goals: FinancialGoal[],
  debtTitles: string[]
): TaskInsert {
  const priority = action.priority ?? "medium";
  const title = action.action.trim();
  const description = action.effect?.trim() ?? null;
  const goalLink = attachGoal(title, description, goals, debtTitles);

  return {
    user_id: userId,
    analysis_id: analysisId,
    ...goalLink,
    title,
    description,
    impact_score: PRIORITY_SCORE[priority] ?? 50,
    impact_label: PRIORITY_LABEL[priority] ?? "средний эффект",
    due_date: dueDateFromDays(30),
  };
}

export async function createTasksFromAnalysis(
  supabase: SupabaseClient,
  userId: string,
  analysisId: string,
  parsed: AiAnalysisResult
): Promise<number> {
  const [{ data: pendingTasks }, { data: goals }, { data: debts }] =
    await Promise.all([
      supabase
        .from("financial_tasks")
        .select("title")
        .eq("user_id", userId)
        .eq("status", "pending"),
      supabase.from("financial_goals").select("*").eq("user_id", userId),
      supabase.from("debts").select("id, title").eq("user_id", userId),
    ]);

  const userGoals = (goals ?? []) as FinancialGoal[];
  const debtTitles = (debts ?? []).map((d) => d.title);
  const pendingTitles = pendingTasks?.map((t) => t.title) ?? [];
  const toInsert: TaskInsert[] = [];

  function isDuplicate(title: string): boolean {
    return (
      pendingTitles.some((t) => isSimilarTitle(t, title)) ||
      toInsert.some((t) => isSimilarTitle(t.title, title))
    );
  }

  if (parsed.next_best_action?.title) {
    const task = mapNextBestAction(
      parsed.next_best_action,
      userId,
      analysisId,
      userGoals,
      debtTitles
    );
    if (!isDuplicate(task.title)) {
      toInsert.push(task);
    }
  }

  for (const action of parsed.actions_30_days ?? []) {
    if (toInsert.length >= MAX_TASKS_PER_ANALYSIS) break;
    if (!action.action?.trim()) continue;

    const task = mapAction30Day(
      action,
      userId,
      analysisId,
      userGoals,
      debtTitles
    );
    if (isDuplicate(task.title)) continue;
    toInsert.push(task);
  }

  if (toInsert.length === 0) return 0;

  const { error } = await supabase.from("financial_tasks").insert(toInsert);
  if (error) {
    console.error("Failed to create financial tasks:", error);
    return 0;
  }

  return toInsert.length;
}
