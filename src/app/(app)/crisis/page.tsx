import { CrisisPageClient } from "./crisis-client";
import { getDebts } from "@/lib/actions/finance";

export default async function CrisisPage() {
  const debts = await getDebts();
  return <CrisisPageClient debts={debts} />;
}
