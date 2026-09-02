"use client";

import { useTransition } from "react";
import { updateQuoteStatus } from "./actions";
import type { QuoteRequestStatus } from "@/lib/types";

const STATUSES: QuoteRequestStatus[] = ["new", "contacted", "resolved"];

export function QuoteStatusSelect({ id, status }: { id: string; status: QuoteRequestStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(() => {
          updateQuoteStatus(id, e.target.value as QuoteRequestStatus);
        })
      }
      className="rounded-md border border-card-border bg-background px-2 py-1 text-xs capitalize disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
