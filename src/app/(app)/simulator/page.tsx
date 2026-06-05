import { getFinancialData } from "@/lib/actions/finance";
import { getGoals } from "@/lib/actions/goals";
import { SimulatorPageClient } from "./simulator-client";

export const dynamic = "force-dynamic";

export default async function SimulatorPage() {
  const [{ incomes, expenses, debts }, goals] = await Promise.all([
    getFinancialData(),
    getGoals(),
  ]);

  return (
    <SimulatorPageClient
      incomes={incomes}
      expenses={expenses}
      debts={debts}
      goals={goals}
    />
  );
}
