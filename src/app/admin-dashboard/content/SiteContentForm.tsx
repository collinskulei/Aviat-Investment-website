"use client";

import { updateSiteContent } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useAdminAction } from "@/components/admin/AdminFeedback";
import { ActionStatus } from "@/components/admin/ActionStatus";
import { ProgressBar } from "@/components/admin/ProgressBar";
import type { SiteContent } from "@/lib/types";
import type { ContentSection } from "./sections";

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
      <label htmlFor={`sc-${name}`} className="mb-1.5 block text-xs font-medium text-muted">
        {label}
      </label>
      {textarea ? (
        <textarea id={`sc-${name}`} name={name} rows={rows} defaultValue={defaultValue} className={inputClasses} />
      ) : (
        <input id={`sc-${name}`} type={type} name={name} defaultValue={defaultValue} className={inputClasses} />
      )}
    </div>
  );
}

/** Text fields for one content section, saved together. */
function SectionTextForm({ children }: { children: React.ReactNode }) {
  const [pending, run, lastResult] = useAdminAction();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        run(() => updateSiteContent(formData));
      }}
      aria-busy={pending}
      className="relative overflow-hidden rounded-xl border border-card-border bg-card p-6"
    >
      {pending && (
        <div className="absolute inset-x-0 top-0">
          <ProgressBar label="Saving content" className="h-1 rounded-none" />
        </div>
      )}
      {children}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="btn-fade rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
        <ActionStatus result={lastResult} />
      </div>
    </form>
  );
}

function ImageCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-card-border bg-card p-6">{children}</div>;
}

export function SiteContentForm({
  section,
  content,
}: {
  section: ContentSection;
  content: SiteContent;
}) {
  if (section === "logo") {
    return (
      <ImageCard>
        <p className="mb-4 text-sm text-muted">
          Shown in the header and (on a light badge) the footer. Leave unset to use the
          built-in Aviat Investment Limited logo, which adapts to light and dark mode.
        </p>
        <ImageUploadField target="logo" currentUrl={content.logo_url} label="Logo image" aspect="aspect-[3/1]" />
      </ImageCard>
    );
  }

  if (section === "hero") {
    return (
      <div className="space-y-6">
        <ImageCard>
          <ImageUploadField
            target="hero"
            currentUrl={content.hero_image_url}
            label="Hero background photo"
            aspect="aspect-video"
          />
        </ImageCard>
        <SectionTextForm>
          <div className="grid gap-4 sm:grid-cols-2">
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
        </SectionTextForm>
      </div>
    );
  }

  if (section === "about") {
    return (
      <div className="space-y-6">
        <ImageCard>
          <ImageUploadField
            target="about"
            currentUrl={content.about_image_url}
            label="Team / facility photo (optional)"
            aspect="aspect-video"
          />
        </ImageCard>
        <SectionTextForm>
          <div className="space-y-4">
            <Field
              label="Who We Are (use a blank line to start a new paragraph)"
              name="about_intro"
              defaultValue={content.about_intro}
              textarea
              rows={6}
            />
            <Field label="Our Mission" name="about_mission" defaultValue={content.about_mission} textarea />
          </div>
        </SectionTextForm>
      </div>
    );
  }

  return (
    <SectionTextForm>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" name="contact_phone" defaultValue={content.contact_phone} />
        <Field label="Email" name="contact_email" defaultValue={content.contact_email} type="email" />
        <Field label="Address" name="contact_address" defaultValue={content.contact_address} />
        <Field label="Business hours" name="contact_hours" defaultValue={content.contact_hours} />
      </div>
    </SectionTextForm>
  );
}
