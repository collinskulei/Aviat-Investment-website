"use client";

import { useActionState, useState } from "react";
import { uploadSiteMedia, type UploadState } from "@/app/admin-dashboard/media-actions";

const initialState: UploadState = { status: "idle", message: null, url: null };

export function ImageUploadField({
  target,
  currentUrl,
  label,
  aspect = "aspect-video",
}: {
  target: string;
  currentUrl: string | null;
  label: string;
  aspect?: string;
}) {
  const [state, formAction, pending] = useActionState(uploadSiteMedia, initialState);
  const [preview, setPreview] = useState<string | null>(null);

  const displayUrl = state.status === "success" && state.url ? state.url : currentUrl;

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted">{label}</p>

      {(preview ?? displayUrl) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview ?? displayUrl ?? undefined}
          alt={label}
          className={`mb-2 w-full max-w-xs rounded-lg border border-card-border object-cover ${aspect}`}
        />
      ) : (
        <div
          className={`mb-2 flex w-full max-w-xs items-center justify-center rounded-lg border border-dashed border-card-border text-xs text-muted ${aspect}`}
        >
          No image set
        </div>
      )}

      <form action={formAction} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="target" value={target} />
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
          className="text-xs text-muted file:mr-3 file:rounded-lg file:border file:border-card-border file:bg-background file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground"
        />
        <button
          type="submit"
          disabled={pending}
          className="btn-fade rounded-lg px-4 py-1.5 text-xs font-semibold disabled:opacity-60"
        >
          {pending ? "Uploading..." : "Upload"}
        </button>
      </form>

      {state.status === "success" && (
        <p className="mt-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {state.message}
        </p>
      )}
      {state.status === "error" && (
        <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{state.message}</p>
      )}
    </div>
  );
}
