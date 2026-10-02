import {
  AlarmClock,
  CheckCircle2,
  CircleDashed,
  FileText,
  Flame,
  Inbox,
  ListChecks,
  PhoneCall,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader, LoadError } from "@/components/admin/AdminPageHeader";
import { AdminWidget, Badge, WidgetGrid } from "@/components/admin/AdminWidget";
import { QUOTE_STAGES, formatMoney } from "@/lib/quotes";
import type { QuoteCurrency, QuoteRequestStatus } from "@/lib/types";
import { getQuoteSummary } from "./summary";

const STAGE_ICONS: Record<QuoteRequestStatus, React.ReactNode> = {
  new: <Inbox size={20} />,
  contacted: <PhoneCall size={20} />,
  quoted: <FileText size={20} />,
  won: <CheckCircle2 size={20} />,
  lost: <XCircle size={20} />,
};

function valueLabel(values: Partial<Record<QuoteCurrency, number>>) {
  const parts = (Object.entries(values) as [QuoteCurrency, number][])
    .filter(([, v]) => v > 0)
    .map(([currency, v]) => formatMoney(v, currency));
  return parts.length ? parts.join(" · ") : undefined;
}

export default async function QuotesHomePage() {
  const supabase = await createClient();
  const { summary, error } = await getQuoteSummary(supabase);

  return (
    <div>
      <AdminPageHeader
        crumbs={[{ label: "Overview", href: "/admin-dashboard" }, { label: "Quote Requests" }]}
        title="Quote Requests"
        description="Your sales pipeline. Pick a stage to work through its requests."
      />

      {error && <LoadError what="quote requests" message={error} />}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Needs attention</h2>
      <WidgetGrid>
        <AdminWidget
          href="/admin-dashboard/quotes/list?view=follow-ups"
          title="Follow-ups due"
          description="Open requests with a follow-up date of today or earlier"
          icon={<AlarmClock size={20} />}
          stat={summary.followUpsDue}
          statLabel="due"
          tone={summary.followUpsDue > 0 ? "alert" : "default"}
        />
        <AdminWidget
          href="/admin-dashboard/quotes/list?view=high-priority"
          title="High priority"
          description="Open requests marked high priority"
          icon={<Flame size={20} />}
          stat={summary.highPriorityOpen}
          statLabel="open"
        />
        <AdminWidget
          href="/admin-dashboard/quotes/list?view=open"
          title="All open requests"
          description="Everything still in New, Contacted, or Quoted"
          icon={<CircleDashed size={20} />}
          stat={summary.open}
          statLabel="open"
        />
      </WidgetGrid>

      <h2 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-wide text-muted">
        Pipeline stages
      </h2>
      <WidgetGrid>
        {QUOTE_STAGES.map((stage) => {
          const value = valueLabel(summary.valueByStage[stage.value]);
          return (
            <AdminWidget
              key={stage.value}
              href={`/admin-dashboard/quotes/list?stage=${stage.value}`}
              title={stage.label}
              description={value ? `${stage.description}. Value: ${value}` : stage.description}
              icon={STAGE_ICONS[stage.value]}
              badge={<Badge className={stage.badge}>{stage.label}</Badge>}
              stat={summary.byStage[stage.value]}
              statLabel={summary.byStage[stage.value] === 1 ? "request" : "requests"}
            />
          );
        })}
        <AdminWidget
          href="/admin-dashboard/quotes/list"
          title="All quote requests"
          description="Search and browse every request ever received"
          icon={<ListChecks size={20} />}
          stat={summary.total}
          statLabel="total"
        />
      </WidgetGrid>
    </div>
  );
}
