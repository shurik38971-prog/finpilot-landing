import { DebtsPageClient } from "./debts-client";
import { getDebts } from "@/lib/actions/finance";

export default async function DebtsPage() {
  const debts = await getDebts();
  return <DebtsPageClient debts={debts} />;
}
