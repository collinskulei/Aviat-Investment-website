"use client";

import { useRouter } from "next/navigation";
import { deleteWhyChooseUsItem, upsertWhyChooseUsItem } from "./actions";
import { useAdminAction } from "@/components/admin/AdminFeedback";
import { ActionStatus } from "@/components/admin/ActionStatus";
import { ProgressBar } from "@/components/admin/ProgressBar";
import type { WhyChooseUsItem } from "@/lib/types";

const inputClasses =
  "w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none";

const AVAILABLE_ICONS = [
  "map-pin",
  "shield-check",
  "sparkles",
  "battery-charging",
  "life-buoy",
  "zap",
  "radio",
  "gauge",
  "wind",
];

export function WhyChooseUsEditor({ item }: { item?: WhyChooseUsItem }) {
  const [pending, run, lastResult] = useAdminAction();
  const router = useRouter();
  const isNew = !item;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        run(() => upsertWhyChooseUsItem(formData), {
          onSuccess: (result) => {
            if (isNew && result.id) router.push(`/admin-dashboard/content/why-choose-us/${result.id}`);
          },
        });
      }}
      aria-busy={pending}
      className="relative overflow-hidden rounded-xl border border-card-border bg-card p-6"
    >
      {pending && (
        <div className="absolute inset-x-0 top-0">
          <ProgressBar label="Saving card" className="h-1 rounded-none" />
        </div>
      )}
      {item && <input type="hidden" name="id" value={item.id} />}

      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Card details</h3>
        {!isNew && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (confirm(`Delete "${item!.title}"? This can't be undone.`)) {
                run(() => deleteWhyChooseUsItem(item!.id), {
                  onSuccess: () => router.push("/admin-dashboard/content/why-choose-us"),
                });
              }
            }}
            className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 disabled:opacity-60"
          >
            Delete
          </button>
        )}
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-medium text-muted">Title</label>
        <input name="title" required defaultValue={item?.title} className={inputClasses} />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-medium text-muted">Description</label>
        <textarea name="description" rows={2} required defaultValue={item?.description} className={inputClasses} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Icon</label>
          <select name="icon" defaultValue={item?.icon ?? AVAILABLE_ICONS[0]} className={inputClasses}>
            {AVAILABLE_ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Sort order</label>
          <input type="number" name="sort_order" defaultValue={item?.sort_order ?? 0} className={inputClasses} />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <input
            type="checkbox"
            id={`wcu-active-${item?.id ?? "new"}`}
            name="is_active"
            defaultChecked={item?.is_active ?? true}
            className="size-4"
          />
          <label htmlFor={`wcu-active-${item?.id ?? "new"}`} className="text-sm">
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
          {pending ? "Saving..." : isNew ? "Add Card" : "Save Changes"}
        </button>
        <ActionStatus result={lastResult} />
      </div>
    </form>
  );
}
