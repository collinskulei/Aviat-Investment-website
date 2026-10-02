"use client";

import { updateQuoteDetails } from "../actions";
import { useAdminAction } from "@/components/admin/AdminFeedback";
import { ActionStatus } from "@/components/admin/ActionStatus";
import { ProgressBar } from "@/components/admin/ProgressBar";
import { QUOTE_CURRENCIES, QUOTE_PRIORITIES, QUOTE_STAGES } from "@/lib/quotes";
import type { QuoteRequest } from "@/lib/types";

const inputClasses =
  "w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none";
const labelClasses = "mb-1.5 block text-xs font-medium text-muted";

export function QuoteDetailsForm({ quote }: { quote: QuoteRequest }) {
  const [pending, run, lastResult] = useAdminAction();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        run(() => updateQuoteDetails(quote.id, formData));
      }}
      aria-busy={pending}
      className="relative overflow-hidden rounded-xl border border-card-border bg-card p-6"
    >
      {pending && (
        <div className="absolute inset-x-0 top-0">
          <ProgressBar label="Saving quote" className="h-1 rounded-none" />
        </div>
      )}

      <h2 className="font-semibold">Deal</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="q-status" className={labelClasses}>Stage</label>
          <select id="q-status" name="status" defaultValue={quote.status} className={inputClasses}>
            {QUOTE_STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="q-priority" className={labelClasses}>Priority</label>
          <select id="q-priority" name="priority" defaultValue={quote.priority} className={inputClasses}>
            {QUOTE_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="q-amount" className={labelClasses}>Quoted amount</label>
          <div className="flex gap-2">
            <select
              name="currency"
              defaultValue={quote.currency}
              aria-label="Currency"
              className={`${inputClasses} w-24 shrink-0`}
            >
              {QUOTE_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              id="q-amount"
              name="quoted_amount"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              defaultValue={quote.quoted_amount ?? ""}
              placeholder="0"
              className={inputClasses}
            />
          </div>
        </div>
        <div>
          <label htmlFor="q-follow" className={labelClasses}>Follow-up date</label>
          <input
            id="q-follow"
            name="follow_up_on"
            type="date"
            defaultValue={quote.follow_up_on ?? ""}
            className={inputClasses}
          />
        </div>
      </div>

      <h2 className="mt-8 font-semibold">Contact</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="q-name" className={labelClasses}>Full name</label>
          <input id="q-name" name="full_name" required defaultValue={quote.full_name} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="q-company" className={labelClasses}>Company / operator</label>
          <input id="q-company" name="company" defaultValue={quote.company} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="q-phone" className={labelClasses}>Phone</label>
          <input id="q-phone" name="phone" type="tel" defaultValue={quote.phone} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="q-email" className={labelClasses}>Email</label>
          <input
            id="q-email"
            name="email"
            type="email"
            required
            defaultValue={quote.email}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="btn-fade rounded-lg px-5 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save Details"}
        </button>
        <ActionStatus result={lastResult} />
      </div>
    </form>
  );
}
