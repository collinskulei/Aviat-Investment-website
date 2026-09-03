import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-card-border bg-card p-8">
        <h1 className="text-xl font-bold">Admin Sign In</h1>
        <p className="mt-1 text-sm text-muted">Aviat Investment Limited admin dashboard.</p>
        <div className="mt-6">
          <LoginForm
            next={next ?? "/admin-dashboard"}
            initialError={error ? "That sign-in link is invalid or has expired. Request a new one below." : undefined}
          />
        </div>
      </div>
    </div>
  );
}
