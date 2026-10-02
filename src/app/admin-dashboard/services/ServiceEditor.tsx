"use client";

import { useRef } from "react";
import { deleteService, upsertService } from "../actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useAdminAction } from "@/components/admin/AdminFeedback";
import { ActionStatus } from "@/components/admin/ActionStatus";
import { ProgressBar } from "@/components/admin/ProgressBar";
import type { Service } from "@/lib/types";

const inputClasses =
  "w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none";

const AVAILABLE_ICONS = [
  "battery-charging",
  "life-buoy",
  "zap",
  "radio",
  "gauge",
  "wind",
  "map-pin",
  "shield-check",
  "sparkles",
];

export function ServiceEditor({ service }: { service?: Service }) {
  const [pending, run, lastResult] = useAdminAction();
  const formRef = useRef<HTMLFormElement>(null);
  const isNew = !service;

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        run(() => upsertService(formData), {
          onSuccess: () => {
            if (isNew) formRef.current?.reset();
          },
        });
      }}
      aria-busy={pending}
      className="relative overflow-hidden rounded-xl border border-card-border bg-card p-6"
    >
      {pending && (
        <div className="absolute inset-x-0 top-0">
          <ProgressBar label="Saving service" className="h-1 rounded-none" />
        </div>
      )}
      {service && <input type="hidden" name="id" value={service.id} />}

      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{isNew ? "Add a new service" : service!.title}</h3>
        {!isNew && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (confirm(`Delete "${service!.title}"? This can't be undone.`)) {
                run(() => deleteService(service!.id));
              }
            }}
            className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 disabled:opacity-60"
          >
            Delete
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Title</label>
          <input
            name="title"
            required
            defaultValue={service?.title}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Slug</label>
          <input
            name="slug"
            required
            defaultValue={service?.slug}
            className={inputClasses}
          />
        </div>
      </div>

      {!isNew && (
        <div className="mt-4">
          <ImageUploadField
            target={`service:${service!.id}`}
            currentUrl={service!.image_url}
            label="Photo (shown on the service card and its page; optional)"
            aspect="aspect-video"
          />
        </div>
      )}

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-medium text-muted">
          Short description (card preview)
        </label>
        <input
          name="short_description"
          required
          defaultValue={service?.short_description}
          className={inputClasses}
        />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-medium text-muted">
          Full description (services page)
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={service?.description}
          className={inputClasses}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Icon</label>
          <select name="icon" defaultValue={service?.icon ?? AVAILABLE_ICONS[0]} className={inputClasses}>
            {AVAILABLE_ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Sort order</label>
          <input
            type="number"
            name="sort_order"
            defaultValue={service?.sort_order ?? 0}
            className={inputClasses}
          />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <input
            type="checkbox"
            id={`active-${service?.id ?? "new"}`}
            name="is_active"
            defaultChecked={service?.is_active ?? true}
            className="size-4"
          />
          <label htmlFor={`active-${service?.id ?? "new"}`} className="text-sm">
            Active (visible on site)
          </label>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="btn-fade rounded-lg px-5 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {pending ? "Saving..." : isNew ? "Add Service" : "Save Changes"}
        </button>
        <ActionStatus result={lastResult} />
      </div>
    </form>
  );
}
