import type { ActionResult } from "@/lib/types";

/** Inline success/error line shown next to a form's submit button. */
export function ActionStatus({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return (
    <p
      role={result.ok ? "status" : "alert"}
      className={`text-sm font-medium ${
        result.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
      }`}
    >
      {result.message}
    </p>
  );
}
