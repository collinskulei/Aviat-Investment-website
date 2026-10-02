import Link from "next/link";
import { AlarmClock, ClipboardList, FileText, Inbox, Wrench } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader, LoadError } from "@/components/admin/AdminPageHeader";
import { AdminWidget, Badge, WidgetGrid } from "@/components/admin/AdminWidget";
import { formatDate, stageMeta } from "@/lib/quotes";
import type { QuoteRequest } from "@/lib/types";
import { getQuoteSummary } from "./quotes/summary";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ summary, error: quotesError }, servicesRes, latestRes] = await Promise.all([
    getQuoteSummary(supabase),
    supabase.from("services").select("is_active"),
    supabase
      .from("quote_requests")
      .select("id, full_name, company, service, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const services = (servicesRes.data ?? []) as { is_active: boolean }[];
  const latest = (latestRes.data ?? []) as Pick<
    QuoteRequest,
    "id" | "full_name" | "company" | "service" | "status" | "created_at"
  >[];

  return (
    <div>
      <AdminPageHeader title="Overview" description="Everything you manage, at a glance." />

      {quotesError && <LoadError what="quote requests" message={quotesError} />}

      <WidgetGrid>
        <AdminWidget
          href="/admin-dashboard/quotes"
          title="Quote Requests"
          description="Your sales pipeline from the website quote form"
          icon={<ClipboardList size={20} />}
          stat={summary.open}
          statLabel="open"
          badge={
            summary.byStage.new > 0 ? (
              <Badge className={stageMeta("new").badge}>{summary.byStage.new} new</Badge>
            ) : undefined
          }
        />
        <AdminWidget
          href="/admin-dashboard/quotes/list?stage=new"
          title="New requests"
          description="Waiting for a first response"
          icon={<Inbox size={20} />}
          stat={summary.byStage.new}
          statLabel="new"
        />
        <AdminWidget
          href="/admin-dashboard/quotes/list?view=follow-ups"
          title="Follow-ups due"
          description="Open requests to chase today"
          icon={<AlarmClock size={20} />}
          stat={summary.followUpsDue}
          statLabel="due"
          tone={summary.followUpsDue > 0 ? "alert" : "default"}
        />
        <AdminWidget
          href="/admin-dashboard/services"
          title="Services"
          description="Services shown on the Home and Services pages"
          icon={<Wrench size={20} />}
          stat={services.filter((s) => s.is_active).length}
          statLabel={`of ${services.length} live`}
        />
        <AdminWidget
          href="/admin-dashboard/content"
          title="Site Content"
          description="Logo, hero, About page, contact details, and highlight cards"
          icon={<FileText size={20} />}
        />
      </WidgetGrid>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Latest requests</h2>
          <Link href="/admin-dashboard/quotes/list" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="rounded-xl border border-dashed border-card-border px-6 py-10 text-center text-sm text-muted">
            No quote requests yet.
          </p>
        ) : (
          <ul className="divide-y divide-card-border overflow-hidden rounded-xl border border-card-border bg-card">
            {latest.map((quote) => {
              const stage = stageMeta(quote.status);
              return (
                <li key={quote.id}>
                  <Link
                    href={`/admin-dashboard/quotes/${quote.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 hover:bg-background"
                  >
                    <div>
                      <p className="font-medium text-foreground">{quote.full_name}</p>
                      <p className="text-xs text-muted">
                        {quote.company ? `${quote.company} · ` : ""}
                        {quote.service}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted">{formatDate(quote.created_at)}</span>
                      <Badge className={stage.badge}>{stage.label}</Badge>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
