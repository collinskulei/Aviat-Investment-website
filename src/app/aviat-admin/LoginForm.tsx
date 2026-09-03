"use client";

import { useActionState } from "react";
import { sendMagicLink, type MagicLinkState } from "./actions";

const inputClasses =
  "w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none";

export function LoginForm({ next, initialError }: { next: string; initialError?: string }) {
  const initialState: MagicLinkState = {
    status: initialError ? "error" : "idle",
    message: initialError ?? null,
  };
  const [state, formAction, pending] = useActionState(sendMagicLink, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@aviatinvestment.co.ke"
          className={inputClasses}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-fade w-full rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Sending..." : "Email me a sign-in link"}
      </button>

      {state.status === "success" && (
        <p role="status" className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {state.message}
        </p>
      )}
      {state.status === "error" && (
        <p role="status" className="text-sm font-medium text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}

      <p className="text-xs text-muted">
        No password needed. We&apos;ll email a one-time link that signs you straight in.
      </p>
    </form>
  );
}
