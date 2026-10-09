import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "~/lib/site";
import { ButtonLink, Container, cx } from "./ui";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
      <img src="/logo-mark.png" alt="" width={315} height={192} className="h-7 w-auto" />
      <span className="text-base font-semibold tracking-tight text-ink">LDF Solutions</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    cx(
                      "text-sm transition-colors",
                      isActive ? "font-medium text-ink" : "text-muted hover:text-ink",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link to="/report-issue" className="text-sm font-medium text-ink hover:text-brand">
            Report an issue
          </Link>
          <ButtonLink to="/book" className="px-4 py-2">
            Book a session
          </ButtonLink>
        </div>

        <button
          type="button"
          className="-mr-2 grid size-10 place-items-center rounded-lg text-ink hover:bg-subtle lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
        </button>
      </Container>

      <div id="mobile-menu" hidden={!open} className="border-t border-line bg-white lg:hidden">
        <Container className="py-3">
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      cx(
                        "block py-3 text-base",
                        isActive ? "font-medium text-brand" : "text-ink",
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-3 grid gap-2 border-t border-line pt-4 sm:grid-cols-2">
            <ButtonLink to="/report-issue" variant="secondary">
              Report an issue
            </ButtonLink>
            <ButtonLink to="/book">Book a session</ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  );
}
