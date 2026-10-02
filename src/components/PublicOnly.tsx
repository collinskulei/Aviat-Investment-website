"use client";

import { usePathname } from "next/navigation";
import { isAdminPath } from "@/lib/admin-paths";

/** Renders its children only on the public site, never on admin pages. */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return isAdminPath(pathname) ? null : <>{children}</>;
}
