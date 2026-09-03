"use client";

import { useActionState } from "react";
import { submitQuoteRequest, type QuoteFormState } from "@/app/actions/quote";
import type { Service } from "@/lib/types";

const initialState: QuoteFormState = { status: "idle", message: "" };

const inputClasses =
  "w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none";

export function QuoteForm({
  services,
  defaultService,
}: {
  services: Service[];
  defaultService?: string;
}) {
  const [state, formAction, pending] = useActionState(submitQuoteRequest, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {/* Honeypot - hidden from real visitors, catches simple bots */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            placeholder="Your name"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="email@company.com"
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-foreground">
          Service Required
        </label>
        <select
          id="service"
          name="service"
          required
          defaultValue={defaultService ?? ""}
          className={inputClasses}
        >
          <option value="" disabled>
            Select a service
          </option>
          {services.map((service) => (
            <option key={service.id} value={service.title}>
              {service.title}
            </option>
          ))}
          <option value="Other Technical Inquiry">Other Technical Inquiry</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
          Message / Aircraft Details
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Please describe your requirements or aircraft type..."
          className={inputClasses}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-fade w-full rounded-lg px-6 py-3 text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send Service Request"}
      </button>

      {state.status !== "idle" && (
        <p
          role="status"
          className={
            state.status === "success"
              ? "text-sm font-medium text-emerald-600 dark:text-emerald-400"
              : "text-sm font-medium text-red-600 dark:text-red-400"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
