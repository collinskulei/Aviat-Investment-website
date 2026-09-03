import { WHY_CHOOSE_US } from "@/lib/constants";
import { ServiceIcon } from "@/lib/service-icons";

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-bold sm:text-4xl">
        Why Choose <span className="text-primary">Aviat Investment Limited?</span>
      </h2>
      <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-primary to-transparent" />

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {WHY_CHOOSE_US.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-card-border bg-card p-6"
          >
            <ServiceIcon name={item.icon} className="size-8 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
