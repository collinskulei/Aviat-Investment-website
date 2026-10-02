"use client";

import { useRef } from "react";
import { addQuoteActivity } from "../actions";
import { useAdminAction } from "@/components/admin/AdminFeedback";
import { ProgressBar } from "@/components/admin/ProgressBar";
import { ACTIVITY_KINDS } from "@/lib/quotes";

const inputClasses =
  "w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none";

export function ActivityForm({ quoteId }: { quoteId: string }) {
  const [pending, run] = useAdminAction();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        run(() => addQuoteActivity(quoteId, formData), {
          onSuccess: () => formRef.current?.reset(),
        });
      }}
      aria-busy={pending}
      className="space-y-3"
    >
      <div className="flex flex-wrap gap-3">
        {ACTIVITY_KINDS.map((kind, i) => (
          <label key={kind.value} className="flex items-center gap-1.5 text-sm">
            <input type="radio" name="kind" value={kind.value} defaultChecked={i === 0} />
            {kind.label}
          </label>
        ))}
      </div>
      <textarea
        name="body"
        rows={3}
        required
        placeholder="e.g. Called to confirm aircraft type; sending quote tomorrow."
        aria-label="Activity details"
        className={inputClasses}
      />
      {pending && <ProgressBar label="Logging activity" />}
      <button
        type="submit"
        disabled={pending}
        className="btn-fade rounded-lg px-4 py-1.5 text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Logging..." : "Log Activity"}
      </button>
    </form>
  );
}
