import { ExpensesPageClient } from "./expenses-client";
import { getExpenses } from "@/lib/actions/finance";

export default async function ExpensesPage() {
  const expenses = await getExpenses();
  return <ExpensesPageClient expenses={expenses} />;
}
