import Link from "next/link";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader, LoadError } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/admin/AdminWidget";
import {
  OPEN_STAGES,
  QUOTE_PRIORITIES,
  QUOTE_STAGES,
  formatDate,
  formatDay,
  formatMoney,
  isFollowUpDue,
  isQuoteStatus,
  todayInNairobi,
} from "@/lib/quotes";
import type { QuoteRequest } from "@/lib/types";
import { QuoteStatusSelect } from "../QuoteStatusSelect";

const VIEWS = {
  open: "All open requests",
  "follow-ups": "Follow-ups due",
  "high-priority": "High priority",
} as const;

type View = keyof typeof VIEWS;

function isView(value: unknown): value is View {
  return typeof value === "string" && value in VIEWS;
}

/** Strips characters that would break PostgREST's or() filter syntax. */
function sanitizeSearch(q: string) {
  return q.replace(/[,()%*\\]/g, " ").trim().slice(0, 80);
}

export default async function QuoteListPage(props: PageProps<"/admin-dashboard/quotes/list">) {
  const params = await props.searchParams;
  const stage = isQuoteStatus(params.stage) ? params.stage : null;
  const view = isView(params.view) ? params.view : null;
  const q = typeof params.q === "string" ? sanitizeSearch(params.q) : "";

  const supabase = await createClient();
  let query = supabase.from("quote_requests").select("*");

  if (stage) query = query.eq("status", stage);
  if (view === "open") query = query.in("status", OPEN_STAGES);
  if (view === "high-priority") query = query.in("status", OPEN_STAGES).eq("priority", "high");
  if (view === "follow-ups") {
    query = query.in("status", OPEN_STAGES).lte("follow_up_on", todayInNairobi());
  }
  if (q) {
    query = query.or(
      ["full_name", "email", "phone", "company", "service", "message"]
        .map((col) => `${col}.ilike.%${q}%`)
        .join(",")
    );
  }

  query =
    view === "follow-ups"
      ? query.order("follow_up_on", { ascending: true })
      : query.order("created_at", { ascending: false });

  const { data, error } = await query;
  const quotes = (data ?? []) as QuoteRequest[];

  const title = stage
    ? QUOTE_STAGES.find((s) => s.value === stage)!.label
    : view
      ? VIEWS[view]
      : "All quote requests";

  const filterHref = (next: { stage?: string; view?: string }) => {
    const sp = new URLSearchParams();
    if (next.stage) sp.set("stage", next.stage);
    if (next.view) sp.set("view", next.view);
    if (q) sp.set("q", q);
    const s = sp.toString();
    return `/admin-dashboard/quotes/list${s ? `?${s}` : ""}`;
  };

  const chip = (active: boolean) =>
    active
      ? "rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
      : "rounded-full border border-card-border px-3 py-1 text-xs font-medium text-muted hover:border-primary/60 hover:text-foreground";

  return (
    <div>
      <AdminPageHeader
        crumbs={[
          { label: "Overview", href: "/admin-dashboard" },
          { label: "Quote Requests", href: "/admin-dashboard/quotes" },
          { label: title },
        ]}
        title={title}
        description={`${quotes.length} ${quotes.length === 1 ? "request" : "requests"}${q ? ` matching "${q}"` : ""}`}
      />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link href={filterHref({})} className={chip(!stage && !view)}>
            All
          </Link>
          {QUOTE_STAGES.map((s) => (
            <Link key={s.value} href={filterHref({ stage: s.value })} className={chip(stage === s.value)}>
              {s.label}
            </Link>
          ))}
          {(Object.keys(VIEWS) as View[]).map((v) => (
            <Link key={v} href={filterHref({ view: v })} className={chip(view === v)}>
              {VIEWS[v]}
            </Link>
          ))}
        </div>

        <form action="/admin-dashboard/quotes/list" className="relative w-full lg:w-72">
          {stage && <input type="hidden" name="stage" value={stage} />}
          {view && <input type="hidden" name="view" value={view} />}
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search name, phone, email, company..."
            aria-label="Search quote requests"
            className="w-full rounded-lg border border-card-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </form>
      </div>

      {error && <LoadError what="quote requests" message={error.message} />}

      {!error && quotes.length === 0 && (
        <p className="rounded-xl border border-dashed border-card-border px-6 py-12 text-center text-sm text-muted">
          No quote requests here yet.
        </p>
      )}

      {quotes.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-card text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Follow-up</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Stage</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => {
                const priority = QUOTE_PRIORITIES.find((p) => p.value === quote.priority);
                const due = isFollowUpDue(quote);
                return (
                  <tr key={quote.id} className="border-t border-card-border align-top hover:bg-card/60">
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(quote.created_at)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin-dashboard/quotes/${quote.id}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {quote.full_name}
                      </Link>
                      <p className="text-xs text-muted">{quote.company || quote.email}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{quote.phone || "-"}</td>
                    <td className="px-4 py-3">{quote.service}</td>
                    <td className="px-4 py-3">
                      {priority && <Badge className={priority.badge}>{priority.label}</Badge>}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 ${
                        due ? "font-medium text-red-600 dark:text-red-400" : "text-muted"
                      }`}
                    >
                      {quote.follow_up_on ? formatDay(quote.follow_up_on) : "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {formatMoney(quote.quoted_amount, quote.currency) ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <QuoteStatusSelect id={quote.id} status={quote.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
