import { getFinancialTasks } from "@/lib/actions/tasks";
import { ActionsPageClient } from "./actions-client";

export const dynamic = "force-dynamic";

export default async function ActionsPage() {
  const tasks = await getFinancialTasks();
  return <ActionsPageClient tasks={tasks} />;
}
