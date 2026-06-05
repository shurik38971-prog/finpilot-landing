import { ScenariosPageClient } from "./scenarios-client";
import { getFinancialData } from "@/lib/actions/finance";

export default async function ScenariosPage() {
  const data = await getFinancialData();
  return <ScenariosPageClient {...data} />;
}
