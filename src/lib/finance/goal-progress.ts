import type { SupabaseClient } from "@supabase/supabase-js";
import type { FinancialGoal } from "@/types/goals";
import type { FinancialTask } from "@/types/tasks";

export async function applyGoalProgressOnTaskComplete(
  supabase: SupabaseClient,
  task: Pick<FinancialTask, "goal_id" | "goal_progress_amount">,
  goal: FinancialGoal
): Promise<void> {
  if (!task.goal_id) return;

  if (goal.type === "debt_payoff" && goal.debt_id) {
    const { data: debt } = await supabase
      .from("debts")
      .select("total_amount, remaining_amount")
      .eq("id", goal.debt_id)
      .single();

    if (debt) {
      const paid = Math.max(0, debt.total_amount - debt.remaining_amount);
      await supabase
        .from("financial_goals")
        .update({ current_amount: Math.min(goal.target_amount, paid) })
        .eq("id", goal.id);
    }
    return;
  }

  if (!task.goal_progress_amount || task.goal_progress_amount <= 0) return;

  const newAmount = Math.min(
    goal.target_amount,
    goal.current_amount + task.goal_progress_amount
  );

  await supabase
    .from("financial_goals")
    .update({ current_amount: newAmount })
    .eq("id", goal.id);
}
