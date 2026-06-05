"use server";

import { createClient } from "@/lib/supabase/server";
import type { AnalysisRecord } from "@/types/analysis";

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { supabase, userId: user.id };
}

export async function getAnalysesHistory(): Promise<AnalysisRecord[]> {
  const { supabase, userId } = await getUserId();

  const { data, error } = await supabase
    .from("analyses")
    .select(
      "id, user_id, financial_index, main_problem, recommendations, model_used, index_delta, comparison_comment, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as AnalysisRecord[];
}
