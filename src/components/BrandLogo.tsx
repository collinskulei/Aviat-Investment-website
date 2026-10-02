import { SITE_NAME_FULL } from "@/lib/constants";

const LOGO_WIDTH = 768;
const LOGO_HEIGHT = 366;

/**
 * Aviat Investment Limited wordmark.
 * - "auto": navy/brown on light theme, white/tan on dark theme (follows the html class).
 * - "dark": always the light-on-dark variant, for surfaces that stay dark in both themes.
 */
export function BrandLogo({
  className = "h-12 w-auto",
  variant = "auto",
}: {
  className?: string;
  variant?: "auto" | "dark";
}) {
  /* eslint-disable @next/next/no-img-element */
  if (variant === "dark") {
    return (
      <img
        src="/images/logo/logo-dark.png"
        alt={SITE_NAME_FULL}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className={className}
      />
    );
  }

  return (
    <>
      <img
        src="/images/logo/logo-light.png"
        alt={SITE_NAME_FULL}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className={`${className} dark:hidden`}
      />
      <img
        src="/images/logo/logo-dark.png"
        alt={SITE_NAME_FULL}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className={`${className} hidden dark:block`}
      />
    </>
  );
  /* eslint-enable @next/next/no-img-element */
}
