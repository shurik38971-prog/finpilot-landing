import { getAnalysesHistory } from "@/lib/actions/analyses";
import { HistoryPageClient } from "./history-client";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const analyses = await getAnalysesHistory();

  return <HistoryPageClient analyses={analyses} />;
}
