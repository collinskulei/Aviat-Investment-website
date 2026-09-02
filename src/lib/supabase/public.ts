import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/**
 * Anonymous Supabase client for public, unauthenticated reads (e.g. the
 * services list). Unlike the cookie-based server client, this has no
 * request context, so it works at build time (generateStaticParams)
 * as well as at request time.
 */
export function createPublicClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
