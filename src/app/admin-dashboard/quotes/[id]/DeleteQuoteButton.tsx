"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteQuote } from "../actions";
import { useAdminAction } from "@/components/admin/AdminFeedback";

export function DeleteQuoteButton({ id, name }: { id: string; name: string }) {
  const [pending, run] = useAdminAction();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete the quote request from ${name}? Its activity history is deleted too.`)) return;
        run(() => deleteQuote(id), {
          onSuccess: () => router.push("/admin-dashboard/quotes/list"),
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-card-border px-3 py-2 text-sm font-medium text-red-600 hover:border-red-500 disabled:opacity-60 dark:text-red-400"
    >
      <Trash2 size={15} aria-hidden="true" />
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
