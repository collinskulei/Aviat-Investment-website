"use client";

import { useTransition } from "react";
import { deleteService, upsertService } from "../actions";
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
  const [pending, startTransition] = useTransition();
  const isNew = !service;

  return (
    <form
      action={upsertService}
      className="rounded-xl border border-card-border bg-card p-6"
    >
      {service && <input type="hidden" name="id" value={service.id} />}

      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{isNew ? "Add a new service" : service!.title}</h3>
        {!isNew && (
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => deleteService(service!.id))}
            className="text-xs font-medium text-red-400 hover:text-red-300 disabled:opacity-60"
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

      <button
        type="submit"
        className="mt-5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        {isNew ? "Add Service" : "Save Changes"}
      </button>
    </form>
  );
}
