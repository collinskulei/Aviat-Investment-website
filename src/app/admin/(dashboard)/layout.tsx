import Link from "next/link";
import { logout } from "@/app/admin/login/actions";

// Admin pages depend on the signed-in user's session; never prerender them.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <AdminNav />
      <div className="mt-8">{children}</div>
    </div>
  );
}

function AdminNav() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-card-border pb-6">
      <div className="flex items-center gap-6">
        <Link href="/admin" className="text-lg font-bold">
          Admin Dashboard
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/admin" className="text-muted hover:text-foreground">
            Quote Requests
          </Link>
          <Link href="/admin/services" className="text-muted hover:text-foreground">
            Services
          </Link>
        </nav>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="rounded-lg border border-card-border px-4 py-2 text-sm font-medium text-muted hover:border-primary hover:text-foreground"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
