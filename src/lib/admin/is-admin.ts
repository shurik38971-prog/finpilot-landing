import type { SupabaseClient } from "@supabase/supabase-js";

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}

/** Env list or row in admin_users (Supabase). */
export async function isAdminUser(
  supabase: SupabaseClient,
  email: string | null | undefined
): Promise<boolean> {
  if (!email) return false;
  if (isAdminEmail(email)) return true;

  const normalized = email.trim().toLowerCase();

  const { data: rpcAdmin, error: rpcError } = await supabase.rpc(
    "is_finpilot_admin"
  );
  if (!rpcError && rpcAdmin === true) return true;

  const { data: row } = await supabase
    .from("admin_users")
    .select("email")
    .ilike("email", normalized)
    .maybeSingle();

  return row != null;
}
