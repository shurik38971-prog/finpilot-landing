import { getAdminAnalytics } from "@/lib/actions/admin-analytics";
import { AdminDashboardClient } from "./admin-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminAnalytics(30);
  return <AdminDashboardClient initialData={data} />;
}
