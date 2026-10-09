import { Link } from "react-router";
import {
  CalendarClock,
  Check,
  ClipboardPen,
  Headset,
  MessageCircle,
  Package,
  ScreenShare,
  Settings,
  Tag,
  type LucideIcon,
} from "lucide-react";
import type { Route } from "./+types/home";
import { differentiators, site } from "~/lib/site";
import { pageMeta } from "~/lib/meta";
import { ArrowLink, Container, CtaBand, cx } from "~/components/ui";

export function meta({}: Route.MetaArgs) {
  return pageMeta(site.name);
}

type Shortcut = {
  icon: LucideIcon;
  label: string;
  hint: string;
  to: string;
  external?: boolean;
  primary?: boolean;
};

const shortcuts: Shortcut[] = [
  { icon: ClipboardPen, label: "Report an issue", hint: "Tell us what's wrong", to: "/report-issue", primary: true },
  { icon: CalendarClock, label: "Book a session", hint: "Pick a time", to: "/book" },
  { icon: Tag, label: "See pricing", hint: "From $69", to: "/services" },
  { icon: MessageCircle, label: "Chat with us", hint: "On WhatsApp", to: site.whatsappHref, external: true },
];

const services = [
  { icon: Headset, title: "On-demand help", text: "Quick remote fixes. From $69." },
  { icon: Settings, title: "Setup & config", text: "Email, Microsoft 365, Wi-Fi, printers." },
  { icon: Package, title: "Monthly plan", text: "Priority support. $220/month." },
];

const steps = [
  { icon: ClipboardPen, title: "Tell us", text: "Send a quick report" },
  { icon: Headset, title: "We reply", text: "Fast, with next steps" },
  { icon: CalendarClock, title: "Pick a time", text: "Whenever suits you" },
  { icon: ScreenShare, title: "Sorted", text: "Fixed remotely" },
];

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Steps />
      <WhyUs />
      <CtaBand />
    </>
  );
}

function IconBadge({ icon: Icon, solid }: { icon: LucideIcon; solid?: boolean }) {
  return (
    <span
      className={cx(
        "grid size-14 shrink-0 place-items-center rounded-2xl",
        solid ? "bg-white/15 text-white" : "bg-brand-50 text-brand",
      )}
    >
      <Icon aria-hidden className="size-7" strokeWidth={1.75} />
    </span>
  );
}

function Hero() {
  return (
    <section>
      <Container className="py-16 text-center sm:py-24">
        <p className="text-sm font-medium text-brand">{site.tagline}</p>
        <h1 className="mx-auto mt-3 max-w-2xl text-4xl leading-tight sm:text-6xl">
          Tech trouble? <span className="text-brand">Let's sort it.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted">
          Friendly remote IT help for small businesses across {site.serviceArea}.
        </p>

        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {shortcuts.map((s) => {
            const className = cx(
              "flex h-full flex-col items-center gap-3 rounded-2xl border p-5 transition-colors sm:p-6",
              s.primary
                ? "border-brand bg-brand text-white hover:bg-brand-dark"
                : "border-line bg-white hover:border-brand/40 hover:bg-brand-50/40",
            );
            const content = (
              <>
                <IconBadge icon={s.icon} solid={s.primary} />
                <span className="font-medium">{s.label}</span>
                <span className={cx("-mt-2 text-sm", s.primary ? "text-white/75" : "text-muted")}>
                  {s.hint}
                </span>
              </>
            );
            return (
              <li key={s.label}>
                {s.external ? (
                  <a href={s.to} target="_blank" rel="noreferrer" className={className}>
                    {content}
                  </a>
                ) : (
                  <Link to={s.to} className={className}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
          <Check aria-hidden className="size-4 text-brand" />
          You only pay once it's fixed.
        </p>
      </Container>
    </section>
  );
}

function Services() {
  return (
    <section className="border-t border-line py-16 sm:py-20">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-2xl sm:text-3xl">What we do</h2>
          <ArrowLink to="/services">Pricing</ArrowLink>
        </div>
        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {services.map((s) => (
            <li key={s.title} className="flex items-center gap-4 sm:flex-col sm:items-start">
              <IconBadge icon={s.icon} />
              <div>
                <h3 className="text-lg">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Steps() {
  return (
    <section className="bg-subtle py-16 sm:py-20">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-2xl sm:text-3xl">How it works</h2>
          <ArrowLink to="/how-it-works">Details</ArrowLink>
        </div>
        <ol className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col items-center text-center">
              <span className="relative">
                <span className="grid size-16 place-items-center rounded-full bg-white text-brand ring-1 ring-line">
                  <step.icon aria-hidden className="size-7" strokeWidth={1.75} />
                </span>
                <span
                  aria-hidden
                  className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-brand text-xs font-semibold text-white"
                >
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-4 text-lg">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <img
          src="/images.jpeg"
          alt="IT technician holding a server hard drive in a data centre"
          width={596}
          height={335}
          loading="lazy"
          className="mx-auto aspect-video w-full max-w-xl rounded-2xl object-cover lg:mx-0"
        />
        <div>
          <h2 className="text-2xl sm:text-3xl">IT help that feels personal.</h2>
          <ul className="mt-8 space-y-4">
            {differentiators.map((item) => (
              <li key={item.title} className="flex items-center gap-3 text-lg">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand">
                  <Check aria-hidden className="size-4" />
                </span>
                {item.title}
              </li>
            ))}
          </ul>
          <ArrowLink to="/about" className="mt-8">
            About us
          </ArrowLink>
        </div>
      </Container>
    </section>
  );
}
