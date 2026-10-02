"use client";

import { useState } from "react";
import { updateQuoteStatus } from "./actions";
import { useAdminAction } from "@/components/admin/AdminFeedback";
import { ProgressBar } from "@/components/admin/ProgressBar";
import type { QuoteRequestStatus } from "@/lib/types";

const STATUSES: QuoteRequestStatus[] = ["new", "contacted", "resolved"];

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
        className="w-full rounded-md border border-card-border bg-background px-2 py-1 text-xs capitalize disabled:opacity-60"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {pending && <ProgressBar label="Updating status" className="mt-1 h-1 rounded-full" />}
    </div>
  );
}
