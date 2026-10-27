import type { MetadataRoute } from "next";
import { getPublishedGuides } from "@/lib/guides";
import { getCategories, getPlaces, isIndexablePlace } from "@/lib/places";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const staticPaths = ["/", "/about", "/privacy", "/contact", "/claim", "/advertise", "/guides"];
  const guidePaths = getPublishedGuides().map((guide) => `/guides/${guide.slug}`);
  const categoryPaths = getCategories().map((category) => `/${category.slug}`);
  const placePaths = getPlaces()
    .filter(isIndexablePlace)
    .map((place) => `/${place.categorySlug}/${place.slug}`);

  return [...staticPaths, ...guidePaths, ...categoryPaths, ...placePaths].map((path) => ({
    url: new URL(path, `${siteUrl}/`).toString(),
  }));
}
