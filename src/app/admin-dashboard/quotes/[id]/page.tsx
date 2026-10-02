import {
  CalendarClock,
  Mail,
  MessageCircle,
  NotebookPen,
  Phone,
  PhoneCall,
  RefreshCw,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader, LoadError, MissingItem } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/admin/AdminWidget";
import {
  QUOTE_PRIORITIES,
  formatDateTime,
  formatDay,
  formatMoney,
  isFollowUpDue,
  stageMeta,
  telHref,
  whatsappHref,
} from "@/lib/quotes";
import type { QuoteActivity, QuoteActivityKind, QuoteRequest } from "@/lib/types";
import { QuoteDetailsForm } from "./QuoteDetailsForm";
import { ActivityForm } from "./ActivityForm";
import { DeleteQuoteButton } from "./DeleteQuoteButton";

const ACTIVITY_ICONS: Record<QuoteActivityKind, React.ReactNode> = {
  note: <NotebookPen size={14} />,
  call: <PhoneCall size={14} />,
  email: <Mail size={14} />,
  meeting: <Users size={14} />,
  status: <RefreshCw size={14} />,
};

const contactButton =
  "inline-flex items-center gap-2 rounded-lg border border-card-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary";

export default async function QuoteDetailPage(props: PageProps<"/admin-dashboard/quotes/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [quoteRes, activityRes] = await Promise.all([
    supabase.from("quote_requests").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("quote_activities")
      .select("*")
      .eq("quote_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (quoteRes.error) {
    return <LoadError what="this quote request" message={quoteRes.error.message} />;
  }
  if (!quoteRes.data) {
    return (
      <MissingItem
        what="quote request"
        backHref="/admin-dashboard/quotes/list"
        backLabel="Back to quote requests"
      />
    );
  }

  const quote = quoteRes.data as QuoteRequest;
  const activities = (activityRes.data ?? []) as QuoteActivity[];
  const stage = stageMeta(quote.status);
  const priority = QUOTE_PRIORITIES.find((p) => p.value === quote.priority);
  const due = isFollowUpDue(quote);
  const value = formatMoney(quote.quoted_amount, quote.currency);

  const mailto = `mailto:${quote.email}?subject=${encodeURIComponent(
    `Your ${quote.service} quote request - Aviat Investment Limited`
  )}`;

  return (
    <div>
      <AdminPageHeader
        crumbs={[
          { label: "Overview", href: "/admin-dashboard" },
          { label: "Quote Requests", href: "/admin-dashboard/quotes" },
          { label: stage.label, href: `/admin-dashboard/quotes/list?stage=${quote.status}` },
          { label: quote.full_name },
        ]}
        title={quote.full_name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {quote.company && <span>{quote.company}</span>}
            <Badge className={stage.badge}>{stage.label}</Badge>
            {priority && <Badge className={priority.badge}>{priority.label} priority</Badge>}
            {value && <span className="font-medium text-foreground">{value}</span>}
          </span>
        }
        actions={<DeleteQuoteButton id={quote.id} name={quote.full_name} />}
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {quote.phone && (
          <>
            <a href={telHref(quote.phone)} className={contactButton}>
              <Phone size={16} aria-hidden="true" /> Call {quote.phone}
            </a>
            <a
              href={whatsappHref(quote.phone, quote.full_name, quote.service)}
              target="_blank"
              rel="noopener noreferrer"
              className={contactButton}
            >
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </a>
          </>
        )}
        <a href={mailto} className={contactButton}>
          <Mail size={16} aria-hidden="true" /> Email {quote.email}
        </a>
      </div>

      {due && quote.follow_up_on && (
        <p className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
          <CalendarClock size={16} aria-hidden="true" />
          Follow-up due {formatDay(quote.follow_up_on)}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <section className="rounded-xl border border-card-border bg-card p-6">
            <h2 className="font-semibold">Request</h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted">Service</dt>
                <dd className="mt-0.5 font-medium">{quote.service}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Received</dt>
                <dd className="mt-0.5">{formatDateTime(quote.created_at)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted">Message / aircraft details</dt>
                <dd className="mt-0.5 whitespace-pre-wrap">{quote.message || "No message provided."}</dd>
              </div>
            </dl>
          </section>

          <QuoteDetailsForm quote={quote} />
        </div>

        <section className="rounded-xl border border-card-border bg-card p-6 lg:col-span-2">
          <h2 className="font-semibold">Activity</h2>
          <p className="mt-1 text-xs text-muted">Log calls, emails, meetings, and notes.</p>

          <div className="mt-4">
            <ActivityForm quoteId={quote.id} />
          </div>

          {activityRes.error && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">
              Couldn&apos;t load activity: {activityRes.error.message}
            </p>
          )}

          <ol className="mt-6 space-y-4 border-l border-card-border pl-5">
            {activities.map((activity) => (
              <li key={activity.id} className="relative">
                <span className="absolute -left-[29px] flex size-6 items-center justify-center rounded-full border border-card-border bg-background text-muted">
                  {ACTIVITY_ICONS[activity.kind]}
                </span>
                <p className="text-xs text-muted">
                  <span className="font-medium capitalize text-foreground">
                    {activity.kind === "status" ? "Stage change" : activity.kind}
                  </span>
                  {" · "}
                  {formatDateTime(activity.created_at)}
                  {activity.author_email && ` · ${activity.author_email}`}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm">{activity.body}</p>
              </li>
            ))}
            <li className="relative">
              <span className="absolute -left-[29px] flex size-6 items-center justify-center rounded-full border border-card-border bg-background text-muted">
                <MessageCircle size={14} />
              </span>
              <p className="text-xs text-muted">
                <span className="font-medium text-foreground">Request received</span>
                {" · "}
                {formatDateTime(quote.created_at)}
              </p>
              <p className="mt-1 text-sm">Submitted via the website quote form.</p>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
