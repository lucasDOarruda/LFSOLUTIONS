import { Link } from "react-router";
import { MessageCircle } from "lucide-react";
import { navLinks, site } from "~/lib/site";
import { Logo } from "./site-header";
import { Container } from "./ui";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-subtle">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {site.description}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-ink">Company</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-muted hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-ink">Get help</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/report-issue" className="text-muted hover:text-ink">
                Report an issue
              </Link>
            </li>
            <li>
              <Link to="/book" className="text-muted hover:text-ink">
                Book a session
              </Link>
            </li>
            <li>
              <a href={site.whatsappHref} target="_blank" rel="noreferrer" className="text-muted hover:text-ink">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.phoneHref} className="text-muted hover:text-ink">
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="break-all text-muted hover:text-ink">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <span>Remote IT support · {site.serviceArea}</span>
        </Container>
      </div>
    </footer>
  );
}

export function ChatButton() {
  return (
    <a
      href={site.whatsappHref}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark sm:bottom-6 sm:right-6"
    >
      <MessageCircle aria-hidden className="size-5" />
      Let's chat
      <span className="sr-only">(opens WhatsApp)</span>
    </a>
  );
}
