import { getDebts } from "@/lib/actions/finance";
import { getGoals } from "@/lib/actions/goals";
import { getFinancialTasks } from "@/lib/actions/tasks";
import { GoalsPageClient } from "./goals-client";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const [goals, debts, tasks] = await Promise.all([
    getGoals(),
    getDebts(),
    getFinancialTasks(),
  ]);

  return <GoalsPageClient goals={goals} debts={debts} tasks={tasks} />;
}
