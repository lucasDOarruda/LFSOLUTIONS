import { site } from "./site";

/** Standard title/description tags for a page. */
export function pageMeta(title: string, description: string = site.description) {
  const fullTitle = title === site.name ? `${site.name} | ${site.tagline}` : `${title} | ${site.name}`;
  return [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
  ];
}
