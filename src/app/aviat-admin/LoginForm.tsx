"use client";

import { useActionState, useRef } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

const inputClasses =
  "w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none";

// TODO: remove this demo-credentials block once a real admin account
// replaces it — it only works once a matching Supabase Auth user exists.
const DEMO_EMAIL = "demo@aviatinvestment.co.ke";
const DEMO_PASSWORD = "AviatDemo2026!";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function fillDemoCredentials() {
    if (emailRef.current) emailRef.current.value = DEMO_EMAIL;
    if (passwordRef.current) passwordRef.current.value = DEMO_PASSWORD;
  }

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
          ref={emailRef}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          ref={passwordRef}
          className={inputClasses}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>

      {state.error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{state.error}</p>}

      <details className="rounded-lg border border-dashed border-card-border bg-card/50 px-4 py-3">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-muted">
          <span>Demo credentials</span>
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
            Temporary
          </span>
        </summary>
        <div className="mt-3 space-y-2 text-sm">
          <p className="font-mono text-foreground">{DEMO_EMAIL}</p>
          <p className="font-mono text-foreground">{DEMO_PASSWORD}</p>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="text-xs font-medium text-primary hover:text-primary-hover"
          >
            Fill in demo credentials
          </button>
          <p className="text-xs text-muted">
            For reviewing this build only — remove this note once real admin access is set up.
          </p>
        </div>
      </details>
    </form>
  );
}
