import { IncomePageClient } from "./income-client";
import { getIncomes } from "@/lib/actions/finance";

export default async function IncomePage() {
  const incomes = await getIncomes();
  return <IncomePageClient incomes={incomes} />;
}
