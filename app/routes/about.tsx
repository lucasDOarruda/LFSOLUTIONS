import { Check, HeartHandshake, MapPin, ScreenShare } from "lucide-react";
import type { Route } from "./+types/about";
import { site, values } from "~/lib/site";
import { pageMeta } from "~/lib/meta";
import { Container, CtaBand, PageHeader, SectionHeading } from "~/components/ui";

export function meta({}: Route.MetaArgs) {
  return pageMeta(
    "About Us",
    "LDF Solutions was founded by an experienced IT professional to give small businesses fast, practical IT support without the jargon.",
  );
}

const focus = [
  "Clear communication and practical solutions",
  "Fast response times and efficient support",
  "Building long-term relationships based on trust",
];

const facts = [
  { icon: MapPin, title: "Where we work", text: `Remote support across ${site.serviceArea}.` },
  { icon: ScreenShare, title: "How we connect", text: "Secure remote sessions via TeamViewer." },
  { icon: HeartHandshake, title: "Who we help", text: "Small businesses, consultants and busy professionals." },
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Technology should support your business, not slow it down."
        intro={`Reliable, straightforward IT support for small businesses and busy professionals across ${site.serviceArea}.`}
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              Founded by an experienced IT professional, LDF Solutions helps simplify
              technology, offering fast support, practical solutions and flexible
              services to keep your business running smoothly, without unnecessary
              complexity or technical jargon.
            </p>
            <p>
              When something isn't working, you need help quickly. That's why we've made
              it easy to request support: submit an issue through our website or book a
              session online in a few clicks, and we'll respond promptly and guide you
              through the next steps.
            </p>
            <p>
              For most issues, we provide fast remote support using secure tools like
              TeamViewer, connecting to your device safely and resolving problems in
              real time. No waiting for an on-site visit, and minimal disruption to your
              work.
            </p>
            <p>
              Whether you need occasional help or ongoing support, our services are
              designed to be flexible and accessible, giving you reliable IT assistance
              without the overhead of a full-time IT team.
            </p>
          </div>

          <aside className="space-y-10">
            <div>
              <h2 className="text-lg">What we focus on</h2>
              <ul className="mt-4 space-y-3">
                {focus.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <dl className="space-y-5 border-t border-line pt-8">
              {facts.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
                  <div>
                    <dt className="font-medium">{title}</dt>
                    <dd className="text-muted">{text}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </aside>
        </Container>
      </section>

      <section className="border-t border-line bg-subtle py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Our values" title="What you can count on." />
          <dl className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="border-t-2 border-brand pt-6">
                <dt className="text-lg font-medium">{value.title}</dt>
                <dd className="mt-2 text-muted">{value.text}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
