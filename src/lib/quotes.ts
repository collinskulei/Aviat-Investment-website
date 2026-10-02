import type {
  QuoteActivityKind,
  QuoteCurrency,
  QuotePriority,
  QuoteRequest,
  QuoteRequestStatus,
} from "@/lib/types";

export const QUOTE_STAGES: {
  value: QuoteRequestStatus;
  label: string;
  description: string;
  /** Tailwind classes for the stage's badge. */
  badge: string;
}[] = [
  {
    value: "new",
    label: "New",
    description: "Fresh requests waiting for a first response",
    badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  },
  {
    value: "contacted",
    label: "Contacted",
    description: "Customer reached, gathering requirements",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  {
    value: "quoted",
    label: "Quoted",
    description: "Quote sent, awaiting the customer's decision",
    badge: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  {
    value: "won",
    label: "Won",
    description: "Accepted jobs",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "lost",
    label: "Lost",
    description: "Declined or no longer active",
    badge: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
  },
];

export const OPEN_STAGES: QuoteRequestStatus[] = ["new", "contacted", "quoted"];

export function stageMeta(status: QuoteRequestStatus) {
  return QUOTE_STAGES.find((s) => s.value === status) ?? QUOTE_STAGES[0];
}

export function isQuoteStatus(value: unknown): value is QuoteRequestStatus {
  return QUOTE_STAGES.some((s) => s.value === value);
}

export const QUOTE_PRIORITIES: { value: QuotePriority; label: string; badge: string }[] = [
  { value: "high", label: "High", badge: "bg-red-500/15 text-red-700 dark:text-red-300" },
  { value: "normal", label: "Normal", badge: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300" },
  { value: "low", label: "Low", badge: "bg-zinc-500/10 text-muted" },
];

export function isQuotePriority(value: unknown): value is QuotePriority {
  return QUOTE_PRIORITIES.some((p) => p.value === value);
}

export const QUOTE_CURRENCIES: QuoteCurrency[] = ["KES", "USD"];

export const ACTIVITY_KINDS: { value: Exclude<QuoteActivityKind, "status">; label: string }[] = [
  { value: "note", label: "Note" },
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
];

export function isActivityKind(value: unknown): value is Exclude<QuoteActivityKind, "status"> {
  return ACTIVITY_KINDS.some((k) => k.value === value);
}

/** Today's date (YYYY-MM-DD) in Nairobi, for comparing follow-up dates. */
export function todayInNairobi() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi" }).format(new Date());
}

export function isFollowUpDue(quote: Pick<QuoteRequest, "follow_up_on" | "status">) {
  return (
    !!quote.follow_up_on &&
    OPEN_STAGES.includes(quote.status) &&
    quote.follow_up_on <= todayInNairobi()
  );
}

export function formatMoney(amount: number | null, currency: QuoteCurrency) {
  if (amount === null) return null;
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-KE", {
    timeZone: "Africa/Nairobi",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-KE", {
    timeZone: "Africa/Nairobi",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Formats a YYYY-MM-DD follow-up date without timezone shifting. */
export function formatDay(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-KE", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Digits-only phone for tel:/WhatsApp links; assumes Kenya (+254) for local 07.../01... numbers. */
export function normalizePhone(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.slice(1).replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits;
}

export function telHref(phone: string) {
  return `tel:+${normalizePhone(phone)}`;
}

export function whatsappHref(phone: string, name: string, service: string) {
  const text = `Hello ${name}, this is Aviat Investment Limited following up on your ${service} request.`;
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;
}
