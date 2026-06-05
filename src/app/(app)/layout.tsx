import { AppShell } from "@/components/layout/app-shell";
import { isAdminEmail } from "@/lib/admin/is-admin";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AppShell isAdmin={isAdminEmail(user?.email)}>{children}</AppShell>
  );
}
