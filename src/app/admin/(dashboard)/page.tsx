import { createClient } from "@/lib/supabase/server";
import type { QuoteRequest } from "@/lib/types";
import { QuoteStatusSelect } from "./QuoteStatusSelect";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const quotes = (data ?? []) as QuoteRequest[];

  return (
    <div>
      <h1 className="text-2xl font-bold">Quote Requests</h1>
      <p className="mt-1 text-sm text-muted">
        Submissions from the site&apos;s &quot;Request a Service Quote&quot; form.
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400">
          Couldn&apos;t load quote requests: {error.message}
        </p>
      )}

      {!error && quotes.length === 0 && (
        <p className="mt-6 text-sm text-muted">No quote requests yet.</p>
      )}

      {quotes.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-card text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className="border-t border-card-border align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-muted">
                    {new Date(quote.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{quote.full_name}</td>
                  <td className="px-4 py-3 text-muted">{quote.email}</td>
                  <td className="px-4 py-3">{quote.service}</td>
                  <td className="max-w-xs px-4 py-3 text-muted">{quote.message || "—"}</td>
                  <td className="px-4 py-3">
                    <QuoteStatusSelect id={quote.id} status={quote.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
