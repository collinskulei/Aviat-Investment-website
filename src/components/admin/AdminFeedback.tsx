"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { ProgressBar } from "@/components/admin/ProgressBar";
import type { ActionResult } from "@/lib/types";

type Toast = ActionResult & { id: number };

type FeedbackContext = {
  notify: (result: ActionResult) => void;
  /** +1 when an action starts, -1 when it ends; drives the top-of-page bar. */
  trackBusy: (delta: 1 | -1) => void;
};

const Ctx = createContext<FeedbackContext | null>(null);

const SUCCESS_TOAST_MS = 4000;
const ERROR_TOAST_MS = 8000;

/** Toast messages plus a page-wide progress bar for every admin action. */
export function AdminFeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [busyCount, setBusyCount] = useState(0);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (result: ActionResult) => {
      const id = ++nextId.current;
      setToasts((current) => [...current, { ...result, id }]);
      setTimeout(() => dismiss(id), result.ok ? SUCCESS_TOAST_MS : ERROR_TOAST_MS);
    },
    [dismiss]
  );

  const trackBusy = useCallback((delta: 1 | -1) => {
    setBusyCount((count) => Math.max(0, count + delta));
  }, []);

  const value = useMemo(() => ({ notify, trackBusy }), [notify, trackBusy]);

  return (
    <Ctx.Provider value={value}>
      {busyCount > 0 && (
        <div className="fixed inset-x-0 top-0 z-[60]">
          <ProgressBar label="Saving changes" className="h-1 rounded-none" />
        </div>
      )}

      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.ok ? "status" : "alert"}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-card p-4 text-sm shadow-lg ${
              toast.ok ? "border-emerald-500/40" : "border-red-500/40"
            }`}
          >
            {toast.ok ? (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            ) : (
              <CircleAlert size={18} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
            )}
            <p className="flex-1 text-foreground">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="shrink-0 text-muted hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useAdminFeedback() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdminFeedback must be used inside AdminFeedbackProvider");
  return ctx;
}

/** Keeps the page-wide progress bar visible while `active` is true. */
export function useTrackBusy(active: boolean) {
  const { trackBusy } = useAdminFeedback();
  useEffect(() => {
    if (!active) return;
    trackBusy(1);
    return () => trackBusy(-1);
  }, [active, trackBusy]);
}

/**
 * Runs an admin server action in a transition, shows the progress bar while
 * it's pending, and toasts its success/error message when it settles.
 * `lastResult` is also returned for showing the message inline.
 */
export function useAdminAction() {
  const { notify } = useAdminFeedback();
  const [pending, startTransition] = useTransition();
  const [lastResult, setLastResult] = useState<ActionResult | null>(null);
  useTrackBusy(pending);

  const run = useCallback(
    (
      action: () => Promise<ActionResult>,
      callbacks?: { onSuccess?: () => void; onError?: () => void }
    ) => {
      setLastResult(null);
      startTransition(async () => {
        let result: ActionResult;
        try {
          result = await action();
        } catch {
          result = { ok: false, message: "Something went wrong. Please try again." };
        }
        notify(result);
        setLastResult(result);
        if (result.ok) callbacks?.onSuccess?.();
        else callbacks?.onError?.();
      });
    },
    [notify]
  );

  return [pending, run, lastResult] as const;
}
