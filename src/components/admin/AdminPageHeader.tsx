import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

/** Breadcrumb trail + title, so every drill-down page has a way back up. */
export function AdminPageHeader({
  crumbs = [],
  title,
  description,
  actions,
}: {
  crumbs?: Crumb[];
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8">
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
            {crumbs.map((crumb, i) => (
              <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-foreground">
                    {crumb.label}
                  </span>
                )}
                {i < crumbs.length - 1 && <ChevronRight size={14} aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function LoadError({ what, message }: { what: string; message: string }) {
  return (
    <p className="mb-6 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400">
      Couldn&apos;t load {what}: {message}
    </p>
  );
}

/** Shown when a drill-down item no longer exists (e.g. it was just deleted). */
export function MissingItem({ what, backHref, backLabel }: { what: string; backHref: string; backLabel: string }) {
  return (
    <div className="rounded-xl border border-dashed border-card-border px-6 py-16 text-center">
      <p className="text-sm text-muted">This {what} no longer exists. It may have been deleted.</p>
      <Link href={backHref} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
        &larr; {backLabel}
      </Link>
    </div>
  );
}
