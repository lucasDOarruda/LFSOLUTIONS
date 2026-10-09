import type { ReactNode } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { site } from "~/lib/site";
import { Container } from "./ui";

/** Two-column layout: the form on the left, supporting info on the right. */
export function FormPage({ children, aside }: { children: ReactNode; aside: ReactNode }) {
  return (
    <section className="py-12 sm:py-20">
      <Container className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-start lg:gap-16">
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-10">{children}</div>
        <aside className="space-y-10 lg:sticky lg:top-24">{aside}</aside>
      </Container>
    </section>
  );
}

export function AsideCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-base">{title}</h2>
      <div className="mt-4 text-sm text-muted">{children}</div>
    </div>
  );
}

export function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li key={item} className="flex gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand">
            {i + 1}
          </span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function DirectContactCard() {
  const linkClass = "flex items-center gap-3 text-sm text-ink hover:text-brand";
  return (
    <div className="border-t border-line pt-8">
      <h2 className="text-base">Prefer to talk directly?</h2>
      <ul className="mt-4 space-y-3">
        <li>
          <a href={site.whatsappHref} target="_blank" rel="noreferrer" className={linkClass}>
            <MessageCircle aria-hidden className="size-4 text-brand" />
            Chat on WhatsApp
          </a>
        </li>
        <li>
          <a href={site.phoneHref} className={linkClass}>
            <Phone aria-hidden className="size-4 text-brand" />
            {site.phoneDisplay}
          </a>
        </li>
        <li>
          <a href={`mailto:${site.email}`} className={`${linkClass} break-all`}>
            <Mail aria-hidden className="size-4 shrink-0 text-brand" />
            {site.email}
          </a>
        </li>
      </ul>
    </div>
  );
}
