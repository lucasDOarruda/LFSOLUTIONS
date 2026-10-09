import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { VercelAnalytics } from "./components/analytics";
import { ChatButton, SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { ButtonLink, Container } from "./components/ui";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png", type: "image/png" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <Meta />
        <Links />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ChatButton />
        <VercelAnalytics />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Something went wrong";
  let details = "An unexpected error occurred. Please try again.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page not found";
      details = "The page you're looking for doesn't exist or has moved.";
    } else {
      details = error.statusText || details;
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Container className="py-24 text-center">
      <title>{`${title} | LDF Solutions`}</title>
      <h1 className="text-4xl sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-muted">{details}</p>
      <div className="mt-8 flex justify-center">
        <ButtonLink to="/" arrow>
          Back to home
        </ButtonLink>
      </div>
      {stack && (
        <pre className="mt-10 w-full overflow-x-auto rounded-xl bg-subtle p-4 text-left text-xs">
          <code>{stack}</code>
        </pre>
      )}
    </Container>
  );
}
