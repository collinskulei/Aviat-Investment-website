import Link from "next/link";
import { CONTACT, NAV_LINKS, SITE_NAME_FULL } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-card-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-foreground">{SITE_NAME_FULL}</p>
          <p className="mt-2 text-sm text-muted">
            Specialist restoration, overhaul, and testing services for critical aircraft
            components.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Navigate</p>
          <ul className="mt-3 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>{CONTACT.address}</li>
            <li>{CONTACT.phone}</li>
            <li>{CONTACT.email}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-card-border px-6 py-6 text-center text-xs text-muted">
        Copyright &copy; {year} {SITE_NAME_FULL}
      </div>
    </footer>
  );
}
