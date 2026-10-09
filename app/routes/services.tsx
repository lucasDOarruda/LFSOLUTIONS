import { Check, Mail, Monitor, Printer, Settings, ShieldCheck, Wifi } from "lucide-react";
import type { Route } from "./+types/services";
import { fixedServices, plans } from "~/lib/site";
import { pageMeta } from "~/lib/meta";
import {
  ArrowLink,
  ButtonLink,
  Container,
  CtaBand,
  PageHeader,
  SectionHeading,
  cx,
} from "~/components/ui";

export function meta({}: Route.MetaArgs) {
  return pageMeta(
    "Services & Pricing",
    "Simple, transparent IT support pricing: on-demand remote sessions, monthly support plans, Wi-Fi and printer fixes, and business setup.",
  );
}

const helpAreas = [
  { icon: Mail, label: "Email & Microsoft 365" },
  { icon: Wifi, label: "Wi-Fi & internet" },
  { icon: Printer, label: "Printers & scanners" },
  { icon: Monitor, label: "Computers & everyday software" },
  { icon: Settings, label: "New system setup" },
  { icon: ShieldCheck, label: "Security best practices" },
];

export default function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Services & pricing"
        title="Simple, transparent pricing."
        intro="No hidden costs, so you always know what to expect."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={cx(
                  "relative flex flex-col rounded-2xl border bg-white p-8 sm:p-10",
                  plan.featured ? "border-brand ring-1 ring-brand" : "border-line",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl">{plan.name}</h2>
                  {plan.featured ? (
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand">
                      Best value
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-muted">{plan.blurb}</p>

                <dl className="mt-8 space-y-4">
                  {plan.prices.map((p) => (
                    <div key={p.label}>
                      <dt className="text-sm text-muted">{p.label}</dt>
                      <dd className="mt-1 text-4xl font-semibold tracking-tight">
                        {p.price}
                        {p.unit ? (
                          <span className="ml-1 text-base font-normal text-muted">{p.unit}</span>
                        ) : null}
                      </dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-8 flex-1 space-y-3 border-t border-line pt-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  to={`/book?service=${plan.id === "monthly" ? "monthly" : "on-demand-30"}`}
                  variant={plan.featured ? "primary" : "secondary"}
                  className="mt-10"
                >
                  {plan.featured ? "Start a monthly plan" : "Book a session"}
                </ButtonLink>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Fixed-price services"
            title="Common fixes, one clear price."
          />
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {fixedServices.map((service) => (
              <li
                key={service.id}
                className="grid gap-4 py-7 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand">
                  <service.icon aria-hidden className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg">{service.name}</h3>
                  <p className="mt-1 text-muted">{service.description}</p>
                </div>
                <div className="flex items-center gap-6 sm:justify-end">
                  <p className="text-2xl font-semibold tracking-tight">{service.price}</p>
                  <ArrowLink to={service.id === "setup" ? "/contact" : `/book?service=${service.id}`}>
                    {service.id === "setup" ? "Get a quote" : "Book"}
                  </ArrowLink>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-subtle py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <SectionHeading
            eyebrow="What we help with"
            title="Everyday IT, handled."
            intro="Not sure if we can help? Report your issue and we'll let you know before you commit to anything."
          />
          <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {helpAreas.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <Icon aria-hidden className="size-5 shrink-0 text-brand" />
                {label}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
