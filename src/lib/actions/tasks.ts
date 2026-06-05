"use server";

import { createClient } from "@/lib/supabase/server";
import { applyGoalProgressOnTaskComplete } from "@/lib/finance/goal-progress";
import { pickPrimaryGoal } from "@/lib/finance/match-task-to-goal";
import { revalidatePath } from "next/cache";
import type { FinancialGoal } from "@/types/goals";
import type { TaskImpact } from "@/types/task-impact";
import type {
  FinancialTask,
  FinancialTaskWithGoal,
  PrimaryGoalFocus,
} from "@/types/tasks";

const TASK_PATHS = ["/actions", "/dashboard", "/analyze", "/goals", "/simulator"] as const;

const TASK_SELECT = `
  *,
  goal:financial_goals(id, title, type, target_amount, current_amount),
  impact:task_impacts(*)
`;

function revalidateTaskPages() {
  for (const path of TASK_PATHS) {
    revalidatePath(path);
  }
}

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { supabase, userId: user.id };
}

function normalizeImpact(
  raw: TaskImpact | TaskImpact[] | null | undefined
): TaskImpact | null {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    return raw[0] ?? null;
  }
  return raw;
}

function mapTask(row: Record<string, unknown>): FinancialTaskWithGoal {
  const goal = row.goal as FinancialTaskWithGoal["goal"];
  const impact = normalizeImpact(
    row.impact as TaskImpact | TaskImpact[] | null | undefined
  );
  const { goal: _goal, impact: _impact, ...rest } = row;
  void _goal;
  void _impact;
  const task = rest as unknown as FinancialTask;
  return { ...task, goal: goal ?? null, impact };
}

export async function getFinancialTasks(): Promise<FinancialTaskWithGoal[]> {
  const { supabase, userId } = await getUserId();
  const { data, error } = await supabase
    .from("financial_tasks")
    .select(TASK_SELECT)
    .eq("user_id", userId)
    .order("impact_score", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapTask(row as Record<string, unknown>));
}

export async function getTopPendingTask(): Promise<FinancialTaskWithGoal | null> {
  const { supabase, userId } = await getUserId();
  const { data, error } = await supabase
    .from("financial_tasks")
    .select(TASK_SELECT)
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("impact_score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? mapTask(data as Record<string, unknown>) : null;
}

export async function getTasksByGoalId(
  goalId: string
): Promise<FinancialTaskWithGoal[]> {
  const tasks = await getFinancialTasks();
  return tasks.filter((t) => t.goal_id === goalId);
}

export async function getPrimaryGoalFocus(): Promise<PrimaryGoalFocus | null> {
  const { supabase, userId } = await getUserId();

  const { data: goals, error } = await supabase
    .from("financial_goals")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  const primary = pickPrimaryGoal((goals ?? []) as FinancialGoal[]);
  if (!primary) return null;

  const remaining = Math.max(0, primary.target_amount - primary.current_amount);
  const progressPercent =
    primary.target_amount > 0
      ? Math.round((primary.current_amount / primary.target_amount) * 100)
      : 0;

  const { data: taskRow } = await supabase
    .from("financial_tasks")
    .select(TASK_SELECT)
    .eq("user_id", userId)
    .eq("status", "pending")
    .eq("goal_id", primary.id)
    .order("impact_score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let task = taskRow ? mapTask(taskRow as Record<string, unknown>) : null;

  if (!task) {
    const { data: fallbackTask } = await supabase
      .from("financial_tasks")
      .select(TASK_SELECT)
      .eq("user_id", userId)
      .eq("status", "pending")
      .order("impact_score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    task = fallbackTask
      ? mapTask(fallbackTask as Record<string, unknown>)
      : null;
  }

  return {
    goal: {
      id: primary.id,
      title: primary.title,
      type: primary.type,
      target_amount: primary.target_amount,
      current_amount: primary.current_amount,
    },
    task,
    remaining,
    progressPercent,
    taskImpact: task?.impact ?? null,
  };
}

export async function completeTask(id: string) {
  const { supabase, userId } = await getUserId();

  const { data: taskRow, error: fetchError } = await supabase
    .from("financial_tasks")
    .select(TASK_SELECT)
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (fetchError) throw fetchError;

  const task = mapTask(taskRow as Record<string, unknown>);

  const { error } = await supabase
    .from("financial_tasks")
    .update({
      status: "done",
      completed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;

  if (task.goal_id) {
    const { data: fullGoal } = await supabase
      .from("financial_goals")
      .select("*")
      .eq("id", task.goal_id)
      .eq("user_id", userId)
      .single();

    if (fullGoal) {
      await applyGoalProgressOnTaskComplete(
        supabase,
        task,
        fullGoal as FinancialGoal
      );
    }
  }

  revalidateTaskPages();
}

export async function postponeTask(id: string) {
  const { supabase, userId } = await getUserId();
  const { error } = await supabase
    .from("financial_tasks")
    .update({ status: "postponed" })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
  revalidateTaskPages();
}

export async function deleteTask(id: string) {
  const { supabase, userId } = await getUserId();
  const { error } = await supabase
    .from("financial_tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
  revalidateTaskPages();
}
