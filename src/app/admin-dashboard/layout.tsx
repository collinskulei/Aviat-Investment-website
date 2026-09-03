import { AdminShell } from "@/components/admin/AdminShell";

// Admin pages depend on the signed-in user's session; never prerender them.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
