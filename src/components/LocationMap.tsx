import { MapPin } from "lucide-react";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7608540056394!2d36.815073073647355!3d-1.3191796356601801!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1046370ae7b1%3A0xff9f6c3c9300a993!2sWilson%20Airport!5e0!3m2!1sen!2ske!4v1770549142780!5m2!1sen!2ske";

const DIRECTIONS_URL = "https://www.google.com/maps?q=-1.3191796356601801,36.815073073647355";

export function LocationMap() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-2xl border border-card-border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-bold">Find Us at Wilson Airport</h2>
            <p className="mt-1 text-sm text-muted">
              Conveniently located near Parapet for easy access and fast turnaround.
            </p>
          </div>
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <MapPin size={18} aria-hidden="true" />
            Visit Us
          </a>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-card-border">
          <iframe
            src={MAP_EMBED_SRC}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Aviat Investment Limited location map"
            className="block w-full"
          />
        </div>
      </div>
    </section>
  );
}
