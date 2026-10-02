"use client";

import { useRef, useState } from "react";
import { saveSiteMedia } from "@/app/admin-dashboard/media-actions";
import { useAdminFeedback, useTrackBusy } from "@/components/admin/AdminFeedback";
import { ProgressBar } from "@/components/admin/ProgressBar";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

type Phase = "idle" | "uploading" | "saving";

/** Storage folder for a target; must match the check in saveSiteMedia. */
function mediaFolder(target: string) {
  return target.replace(/[^a-zA-Z0-9-]/g, "-");
}

/**
 * Sends the file straight to Supabase Storage with XHR (fetch can't report
 * upload progress), authenticated as the signed-in admin.
 */
function uploadToStorage(
  file: File,
  path: string,
  accessToken: string,
  onProgress: (pct: number) => void
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${SUPABASE_URL}/storage/v1/object/site-media/${path}`);
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    xhr.setRequestHeader("apikey", SUPABASE_ANON_KEY ?? "");
    xhr.setRequestHeader("x-upsert", "true");
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress((e.loaded / e.total) * 100);
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Storage upload failed (${xhr.status}): ${xhr.responseText}`));
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}

// Deliberately not a <form>: this field sits inside the Site Content and
// Service editor forms, and forms can't be nested.
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
  const { notify } = useAdminFeedback();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  useTrackBusy(phase !== "idle");

  const displayUrl = preview ?? savedUrl ?? currentUrl;
  const busy = phase !== "idle";

  function fail(message: string) {
    setPhase("idle");
    setStatus({ ok: false, message });
    notify({ ok: false, message });
  }

  async function handleUpload() {
    setStatus(null);

    if (!file) return fail("Please choose an image file.");
    if (!file.type.startsWith("image/")) return fail("That file isn't an image.");
    if (file.size > MAX_FILE_BYTES) return fail("Images must be 5MB or smaller.");

    setPhase("uploading");
    setProgress(0);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return fail("Your session has expired. Please sign in again.");

      const rawExt = file.name.includes(".") ? file.name.split(".").pop() ?? "" : "";
      const ext = /^[a-zA-Z0-9]{1,5}$/.test(rawExt) ? rawExt.toLowerCase() : "jpg";
      const path = `${mediaFolder(target)}/${Date.now()}.${ext}`;

      await uploadToStorage(file, path, session.access_token, setProgress);

      setPhase("saving");
      setProgress(100);
      const result = await saveSiteMedia(target, path);
      if (!result.ok) return fail(result.message);

      setSavedUrl(result.url);
      setPreview(null);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setPhase("idle");
      setStatus(result);
      notify(result);
    } catch (err) {
      console.error("[media] Upload failed:", err);
      fail("Upload failed. Please try again.");
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted">{label}</p>

      {displayUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayUrl}
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

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => {
            const chosen = e.target.files?.[0] ?? null;
            setFile(chosen);
            setStatus(null);
            setPreview(chosen ? URL.createObjectURL(chosen) : null);
          }}
          className="text-xs text-muted file:mr-3 file:rounded-lg file:border file:border-card-border file:bg-background file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground"
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={busy || !file}
          className="btn-fade rounded-lg px-4 py-1.5 text-xs font-semibold disabled:opacity-60"
        >
          {phase === "uploading"
            ? `Uploading ${Math.round(progress)}%`
            : phase === "saving"
              ? "Publishing..."
              : "Upload"}
        </button>
      </div>

      {busy && (
        <div className="mt-2 max-w-xs">
          <ProgressBar
            label="Upload progress"
            value={phase === "uploading" ? progress : undefined}
          />
        </div>
      )}

      {status && (
        <p
          className={`mt-1.5 text-xs font-medium ${
            status.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
