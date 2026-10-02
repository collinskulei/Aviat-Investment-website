import type { createClient } from "@/lib/supabase/server";
import { OPEN_STAGES, isFollowUpDue } from "@/lib/quotes";
import type { QuoteCurrency, QuoteRequest, QuoteRequestStatus } from "@/lib/types";

type Supabase = Awaited<ReturnType<typeof createClient>>;

type Row = Pick<
  QuoteRequest,
  "status" | "priority" | "follow_up_on" | "quoted_amount" | "currency"
>;

export type QuoteSummary = {
  total: number;
  open: number;
  byStage: Record<QuoteRequestStatus, number>;
  /** Sum of quoted amounts per currency, per stage. */
  valueByStage: Record<QuoteRequestStatus, Partial<Record<QuoteCurrency, number>>>;
  followUpsDue: number;
  highPriorityOpen: number;
};

/** Counts for the dashboard widgets, computed from one lightweight query. */
export async function getQuoteSummary(
  supabase: Supabase
): Promise<{ summary: QuoteSummary; error: string | null }> {
  const { data, error } = await supabase
    .from("quote_requests")
    .select("status, priority, follow_up_on, quoted_amount, currency");

  const rows = (data ?? []) as Row[];
  const empty = () => ({ new: 0, contacted: 0, quoted: 0, won: 0, lost: 0 });

  const summary: QuoteSummary = {
    total: rows.length,
    open: 0,
    byStage: empty(),
    valueByStage: { new: {}, contacted: {}, quoted: {}, won: {}, lost: {} },
    followUpsDue: 0,
    highPriorityOpen: 0,
  };

  for (const row of rows) {
    summary.byStage[row.status] = (summary.byStage[row.status] ?? 0) + 1;
    const open = OPEN_STAGES.includes(row.status);
    if (open) summary.open++;
    if (open && row.priority === "high") summary.highPriorityOpen++;
    if (isFollowUpDue(row)) summary.followUpsDue++;
    if (row.quoted_amount !== null) {
      const bucket = summary.valueByStage[row.status];
      bucket[row.currency] = (bucket[row.currency] ?? 0) + Number(row.quoted_amount);
    }
  }

  return { summary, error: error?.message ?? null };
}
