import { Check } from "lucide-react";
import type { Route } from "./+types/home";
import { coreServices, differentiators, pillars, site, workflow } from "~/lib/site";
import { pageMeta } from "~/lib/meta";
import {
  ArrowLink,
  ButtonLink,
  Container,
  CtaBand,
  Eyebrow,
  SectionHeading,
} from "~/components/ui";

export function meta({}: Route.MetaArgs) {
  return pageMeta(site.name);
}

const quickSteps = [workflow[0], workflow[1], workflow[4], workflow[6]];

export default function Home() {
  return (
    <>
      <Hero />
      <Pillars />
      <Services />
      <HowItWorksPreview />
      <WhyUs />
      <CtaBand />
    </>
  );
}

function Hero() {
  return (
    <section>
      <Container className="grid gap-14 py-20 sm:py-28 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <Eyebrow>IT support for small businesses · {site.serviceArea}</Eyebrow>
          <h1 className="mt-4 text-5xl leading-[1.05] sm:text-6xl">
            Smart support.
            <br />
            <span className="text-brand">Simple solutions.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Reliable, straightforward IT support for small businesses and busy
            professionals. Fast remote help, practical fixes, no jargon.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/report-issue" arrow>
              Report an issue
            </ButtonLink>
            <ButtonLink to="/services" variant="secondary">
              View pricing
            </ButtonLink>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {["Remote support via TeamViewer", "Pay only once it's fixed", "Upfront pricing"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check aria-hidden className="size-4 text-brand" /> {item}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-subtle p-7 sm:p-8">
          <p className="text-sm font-medium text-ink">Getting help is simple</p>
          <ol className="mt-6 space-y-6">
            {quickSteps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-sm font-semibold text-brand ring-1 ring-line">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-7 border-t border-line pt-5 text-sm text-muted">
            Payment is only processed after the service is completed.
          </p>
        </div>
      </Container>
    </section>
  );
}

function Pillars() {
  return (
    <section className="border-y border-line">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map(({ icon: Icon, title, text }) => (
          <div key={title}>
            <Icon aria-hidden className="size-5 text-brand" />
            <p className="mt-3 font-medium">{title}</p>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}

function Services() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Services"
            title="Everything your business needs to stay running."
          />
          <ArrowLink to="/services" className="shrink-0">
            See plans and pricing
          </ArrowLink>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {coreServices.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white p-8">
              <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-6 text-lg">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function HowItWorksPreview() {
  const steps = [workflow[0], workflow[3], workflow[6], workflow[10]];
  return (
    <section className="bg-subtle py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="How it works"
            title="From request to resolved, without leaving your desk."
          />
          <ArrowLink to="/how-it-works" className="shrink-0">
            See all 11 steps
          </ArrowLink>
        </div>

        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const number = workflow.indexOf(step) + 1;
            return (
              <li key={step.title} className="border-t-2 border-brand pt-6">
                <p className="text-sm font-medium text-brand">Step {number}</p>
                <h3 className="mt-2 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.note ?? step.text}
                </p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <SectionHeading
          eyebrow="Why LDF Solutions"
          title="IT help that feels personal."
          intro="For small businesses, consultants and professionals who want reliable IT assistance without the overhead of a full-time IT team."
        />
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {differentiators.map((item) => (
            <div key={item.title}>
              <dt className="flex items-center gap-2 font-medium">
                <Check aria-hidden className="size-4 text-brand" />
                {item.title}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{item.text}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
