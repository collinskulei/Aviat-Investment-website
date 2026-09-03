"use client";

import { useActionState } from "react";
import { updateSiteContent, type SaveState } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { SiteContent } from "@/lib/types";

const initialState: SaveState = { status: "idle", message: null };

const inputClasses =
  "w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none";

function Field({
  label,
  name,
  defaultValue,
  textarea,
  rows = 3,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  textarea?: boolean;
  rows?: number;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      {textarea ? (
        <textarea name={name} rows={rows} defaultValue={defaultValue} className={inputClasses} />
      ) : (
        <input type={type} name={name} defaultValue={defaultValue} className={inputClasses} />
      )}
    </div>
  );
}

export function SiteContentForm({ content }: { content: SiteContent }) {
  const [state, formAction, pending] = useActionState(updateSiteContent, initialState);

  return (
    <form action={formAction} className="space-y-10">
      <section className="rounded-xl border border-card-border bg-card p-6">
        <h2 className="font-semibold">Logo</h2>
        <p className="mt-1 text-sm text-muted">
          Shown in the header and (on a light badge) the footer. Leave unset to use the text
          wordmark instead.
        </p>
        <div className="mt-4">
          <ImageUploadField target="logo" currentUrl={content.logo_url} label="Logo image" aspect="aspect-[3/1]" />
        </div>
      </section>

      <section className="rounded-xl border border-card-border bg-card p-6">
        <h2 className="font-semibold">Home hero</h2>
        <div className="mt-4">
          <ImageUploadField
            target="hero"
            currentUrl={content.hero_image_url}
            label="Hero background photo"
            aspect="aspect-video"
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Headline (line 1)" name="hero_headline" defaultValue={content.hero_headline} />
          <Field
            label="Headline (line 2, accent color)"
            name="hero_subheadline"
            defaultValue={content.hero_subheadline}
          />
        </div>
        <div className="mt-4">
          <Field label="Tagline" name="hero_tagline" defaultValue={content.hero_tagline} />
        </div>
      </section>

      <section className="rounded-xl border border-card-border bg-card p-6">
        <h2 className="font-semibold">About page</h2>
        <div className="mt-4">
          <ImageUploadField
            target="about"
            currentUrl={content.about_image_url}
            label="Team / facility photo (optional)"
            aspect="aspect-video"
          />
        </div>
        <div className="mt-4 space-y-4">
          <Field
            label="Who We Are (use a blank line to start a new paragraph)"
            name="about_intro"
            defaultValue={content.about_intro}
            textarea
            rows={6}
          />
          <Field label="Our Mission" name="about_mission" defaultValue={content.about_mission} textarea />
        </div>
      </section>

      <section className="rounded-xl border border-card-border bg-card p-6">
        <h2 className="font-semibold">Contact details</h2>
        <p className="mt-1 text-sm text-muted">Shown on the Contact page and in the footer.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Phone" name="contact_phone" defaultValue={content.contact_phone} />
          <Field label="Email" name="contact_email" defaultValue={content.contact_email} type="email" />
          <Field label="Address" name="contact_address" defaultValue={content.contact_address} />
          <Field label="Business hours" name="contact_hours" defaultValue={content.contact_hours} />
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="btn-fade rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save Content"}
        </button>
        {state.status === "success" && (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{state.message}</p>
        )}
        {state.status === "error" && (
          <p className="text-sm font-medium text-red-600 dark:text-red-400">{state.message}</p>
        )}
      </div>
    </form>
  );
}
