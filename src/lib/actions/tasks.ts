"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { FinancialTask } from "@/types/tasks";

const TASK_PATHS = ["/actions", "/dashboard", "/analyze"] as const;

function revalidateTaskPages() {
  for (const path of TASK_PATHS) {
    revalidatePath(path);
  }
}

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { supabase, userId: user.id };
}

export async function getFinancialTasks(): Promise<FinancialTask[]> {
  const { supabase, userId } = await getUserId();
  const { data, error } = await supabase
    .from("financial_tasks")
    .select("*")
    .eq("user_id", userId)
    .order("impact_score", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as FinancialTask[];
}

export async function getTopPendingTask(): Promise<FinancialTask | null> {
  const { supabase, userId } = await getUserId();
  const { data, error } = await supabase
    .from("financial_tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("impact_score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data as FinancialTask) ?? null;
}

export async function completeTask(id: string) {
  const { supabase, userId } = await getUserId();
  const { error } = await supabase
    .from("financial_tasks")
    .update({
      status: "done",
      completed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
  revalidateTaskPages();
}

export async function postponeTask(id: string) {
  const { supabase, userId } = await getUserId();
  const { error } = await supabase
    .from("financial_tasks")
    .update({ status: "postponed" })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
  revalidateTaskPages();
}

export async function deleteTask(id: string) {
  const { supabase, userId } = await getUserId();
  const { error } = await supabase
    .from("financial_tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
  revalidateTaskPages();
}
