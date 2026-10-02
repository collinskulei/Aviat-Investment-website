import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

/**
 * Clickable dashboard tile. Every admin tab opens on a grid of these, each
 * leading one level deeper (tab -> section -> item editor).
 */
export function AdminWidget({
  href,
  title,
  description,
  icon,
  image,
  media,
  stat,
  statLabel,
  badge,
  tone = "default",
}: {
  href: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Optional photo shown across the top of the tile. */
  image?: string | null;
  /** Custom preview in place of `image` (e.g. the theme-aware logo). */
  media?: ReactNode;
  stat?: ReactNode;
  statLabel?: string;
  badge?: ReactNode;
  /** "add" renders a dashed "create new" tile. */
  tone?: "default" | "add" | "alert";
}) {
  const border =
    tone === "add"
      ? "border-dashed border-card-border hover:border-primary"
      : tone === "alert"
        ? "border-red-500/40 hover:border-red-500"
        : "border-card-border hover:border-primary/60";

  return (
    <Link
      href={href}
      className={`group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors ${border}`}
    >
      {(image || media) && (
        <div className="flex h-32 items-center justify-center border-b border-card-border bg-background p-3">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            media
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          {icon && (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </span>
          )}
          {badge && <span className="ml-auto">{badge}</span>}
        </div>

        <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          {stat !== undefined ? (
            <p>
              <span className="text-2xl font-bold text-foreground">{stat}</span>
              {statLabel && <span className="ml-1.5 text-xs text-muted">{statLabel}</span>}
            </p>
          ) : (
            <span />
          )}
          <ChevronRight
            size={18}
            className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}

export function WidgetGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export function Badge({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}
