import type { Place } from "@/lib/places";
import { getSiteUrl } from "@/lib/site";

export type Crumb = {
  name: string;
  path: string;
};

export function breadcrumbList(crumbs: Crumb[]) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.path, `${siteUrl}/`).toString(),
    })),
  };
}

export function localBusiness(place: Place) {
  const siteUrl = getSiteUrl();
  const pageUrl = new URL(`/${place.categorySlug}/${place.slug}`, `${siteUrl}/`).toString();

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: place.name,
    url: pageUrl,
    ...(place.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: place.address,
            addressLocality: "London",
            addressCountry: "GB",
          },
        }
      : {}),
    ...(place.phone ? { telephone: place.phone } : {}),
    ...(place.openingHours ? { openingHours: place.openingHours } : {}),
    ...(place.website ? { sameAs: place.website } : {}),
    geo: {
      "@type": "GeoCoordinates",
      latitude: place.lat,
      longitude: place.lng,
    },
  };
}

export function placeDescription(name: string) {
  return `${name}, Hackney Wick – address, opening hours and map`;
}

export function guideArticle(guide: { title: string; description: string; date: string; slug: string }) {
  const siteUrl = getSiteUrl();
  const pageUrl = new URL(`/guides/${guide.slug}`, `${siteUrl}/`).toString();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.date,
    mainEntityOfPage: pageUrl,
  };
}
