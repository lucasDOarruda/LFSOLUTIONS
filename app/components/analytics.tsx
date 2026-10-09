import { useLocation } from "react-router";
import { Analytics } from "@vercel/analytics/react";

/**
 * Vercel Web Analytics. @vercel/analytics has no React Router entry point, so we
 * pass the current path ourselves to record client-side navigations. No route
 * has URL params, so the route and path are the same.
 */
export function VercelAnalytics() {
  const { pathname } = useLocation();
  return <Analytics route={pathname} path={pathname} />;
}
