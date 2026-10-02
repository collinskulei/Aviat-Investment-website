/**
 * Thin progress bar. Pass `value` (0-100) for a determinate bar, e.g. upload
 * progress; omit it for an indeterminate bar while a save is in flight.
 */
export function ProgressBar({
  value,
  label = "Working",
  className = "h-1.5 rounded-full",
}: {
  value?: number;
  label?: string;
  className?: string;
}) {
  const determinate = typeof value === "number";
  const pct = determinate ? Math.min(100, Math.max(0, value)) : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={determinate ? Math.round(pct) : undefined}
      className={`w-full overflow-hidden bg-primary/15 ${className}`}
    >
      {determinate ? (
        <div
          className="h-full rounded-[inherit] bg-primary transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      ) : (
        <div className="progress-indeterminate h-full w-1/3 rounded-[inherit] bg-primary" />
      )}
    </div>
  );
}
