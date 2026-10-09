import type { Route } from "./+types/how-it-works";
import { pillars, workflow } from "~/lib/site";
import { pageMeta } from "~/lib/meta";
import { ButtonLink, Container, CtaBand, PageHeader } from "~/components/ui";

export function meta({}: Route.MetaArgs) {
  return pageMeta(
    "How It Works",
    "Our 11-step support workflow: report an issue, get a prompt response, book a remote session and only pay once the problem is fixed.",
  );
}

export default function HowItWorks() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="Simple. Fast. Reliable."
        intro="Here's exactly what happens from the moment you get in touch."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/report-issue" arrow>
            Start with step 1
          </ButtonLink>
          <ButtonLink to="/services" variant="secondary">
            View pricing
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <ol>
            {workflow.map((step, index) => {
              const last = index === workflow.length - 1;
              return (
                <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-5 sm:gap-8">
                  <div className="flex flex-col items-center">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-white text-sm font-semibold text-brand">
                      {index + 1}
                    </span>
                    {!last ? <span aria-hidden className="w-px flex-1 bg-line" /> : null}
                  </div>

                  <div className={last ? "pt-1.5" : "pb-12 pt-1.5"}>
                    <h2 className="flex items-center gap-2.5 text-lg">
                      <step.icon aria-hidden className="size-5 text-brand" />
                      {step.title}
                    </h2>
                    <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
                    {step.bullets ? (
                      <ul className="mt-3 space-y-1.5 text-muted">
                        {step.bullets.map((b) => (
                          <li key={b} className="flex gap-2.5">
                            <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-brand" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {step.note ? (
                      <p className="mt-4 rounded-lg bg-brand-50 px-4 py-3 text-sm font-medium text-brand-dark">
                        {step.note}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <section className="border-y border-line bg-subtle">
        <Container className="grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon aria-hidden className="size-5 text-brand" />
              <h2 className="mt-3 text-base">{title}</h2>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          ))}
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
