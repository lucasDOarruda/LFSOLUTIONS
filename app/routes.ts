import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("services", "routes/services.tsx"),
  route("how-it-works", "routes/how-it-works.tsx"),
  route("about", "routes/about.tsx"),
  route("contact", "routes/contact.tsx"),
  route("report-issue", "routes/report-issue.tsx"),
  route("book", "routes/book.tsx"),
] satisfies RouteConfig;
