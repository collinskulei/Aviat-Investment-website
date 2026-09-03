import Link from "next/link";
import { NAV_LINKS, SITE_NAME, SITE_NAME_FULL } from "@/lib/constants";
import type { SiteContent } from "@/lib/types";

// Footer stays black regardless of the site's light/dark theme.
export function Footer({ siteContent }: { siteContent: SiteContent }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          {siteContent.logo_url ? (
            <div className="inline-block rounded-xl bg-white px-4 py-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={siteContent.logo_url} alt={SITE_NAME} className="h-8 w-auto" />
            </div>
          ) : (
            <p className="text-lg font-bold text-white">{SITE_NAME_FULL}</p>
          )}
          <p className="mt-2 text-sm text-zinc-400">
            Specialist restoration, overhaul, and testing services for critical aircraft
            components.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Navigate</p>
          <ul className="mt-3 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-zinc-400 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>{siteContent.contact_address}</li>
            <li>{siteContent.contact_phone}</li>
            <li>{siteContent.contact_email}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-zinc-500">
        Copyright &copy; {year} {SITE_NAME_FULL}
      </div>
    </footer>
  );
}
