"use client";

import { useState } from "react";
import { updateQuoteStatus } from "./actions";
import { useAdminAction } from "@/components/admin/AdminFeedback";
import { ProgressBar } from "@/components/admin/ProgressBar";
import { QUOTE_STAGES } from "@/lib/quotes";
import type { QuoteRequestStatus } from "@/lib/types";

export function QuoteStatusSelect({ id, status }: { id: string; status: QuoteRequestStatus }) {
  const [pending, run] = useAdminAction();
  const [value, setValue] = useState(status);

  return (
    <div className="w-28">
      <select
        value={value}
        disabled={pending}
        onChange={(e) => {
          const previous = value;
          const next = e.target.value as QuoteRequestStatus;
          setValue(next);
          run(() => updateQuoteStatus(id, next), { onError: () => setValue(previous) });
        }}
        aria-label="Pipeline stage"
        className="w-full rounded-md border border-card-border bg-background px-2 py-1 text-xs disabled:opacity-60"
      >
        {QUOTE_STAGES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {pending && <ProgressBar label="Updating status" className="mt-1 h-1 rounded-full" />}
    </div>
  );
}
