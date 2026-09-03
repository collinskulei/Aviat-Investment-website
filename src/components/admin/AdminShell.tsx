"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { FileText, LayoutDashboard, Menu, Wrench, X } from "lucide-react";
import { logout } from "@/app/aviat-admin/actions";

const NAV_ITEMS = [
  { href: "/admin-dashboard", label: "Quote Requests", icon: LayoutDashboard },
  { href: "/admin-dashboard/services", label: "Services", icon: Wrench },
  { href: "/admin-dashboard/content", label: "Site Content", icon: FileText },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (onNavigate?: () => void) => (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={
              active
                ? "flex items-center gap-2.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                : "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-foreground"
            }
          >
            <Icon size={17} aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="md:flex md:min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-card-border bg-card md:flex md:flex-col">
        <div className="px-5 py-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">Aviat Admin</p>
        </div>
        <div className="flex-1 px-3">{nav()}</div>
        <div className="border-t border-card-border p-3">
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-lg border border-card-border px-3 py-2 text-left text-sm font-medium text-muted hover:border-primary hover:text-foreground"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="border-b border-card-border bg-card md:hidden">
        <div className="flex items-center justify-between px-4 py-3.5">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">Aviat Admin</p>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="text-foreground"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="space-y-3 border-t border-card-border px-4 py-4">
            {nav(() => setOpen(false))}
            <form action={logout}>
              <button
                type="submit"
                className="w-full rounded-lg border border-card-border px-3 py-2 text-left text-sm font-medium text-muted hover:border-primary hover:text-foreground"
              >
                Sign Out
              </button>
            </form>
          </div>
        )}
      </div>

      <main className="flex-1 px-4 py-8 sm:px-8 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
