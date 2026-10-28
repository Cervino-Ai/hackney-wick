import placesJson from "@/data/places.json";

export type Place = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  lat: number;
  lng: number;
  address: string | null;
  website: string | null;
  phone: string | null;
  openingHours: string | null;
  tags: Record<string, string>;
};

export type Category = {
  name: string;
  slug: string;
  count: number;
};

const CATEGORY_ORDER = [
  "breweries-and-taprooms",
  "music-and-nightlife",
  "bars-and-pubs",
  "cafes-and-coffee-shops",
  "food-and-drink",
  "arts-and-galleries",
  "studios-and-creative-spaces",
  "health-and-fitness",
  "parks-and-outdoors",
  "community",
  "services",
  "workspaces",
  "shops",
];

const places = (placesJson as unknown as Place[]).filter(
  (place) => place.category !== "Other" && place.categorySlug !== "other",
);

const DETAIL_FIELDS = ["address", "openingHours", "website", "phone"] as const;

export function detailCount(place: Place) {
  return DETAIL_FIELDS.filter((field) => {
    const value = place[field];
    return typeof value === "string" && value.trim() !== "";
  }).length;
}

export function isIndexablePlace(place: Place) {
  return detailCount(place) >= 2;
}

function byName(a: Place, b: Place) {
  return a.name.localeCompare(b.name, "en", { sensitivity: "base" }) || a.slug.localeCompare(b.slug);
}

export function getPlaces() {
  return places;
}

export function getCategories(): Category[] {
  const categories = new Map<string, Category>();

  for (const place of places) {
    const existing = categories.get(place.categorySlug);
    if (existing) {
      existing.count += 1;
    } else {
      categories.set(place.categorySlug, {
        name: place.category,
        slug: place.categorySlug,
        count: 1,
      });
    }
  }

  return [...categories.values()].sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a.slug);
    const bIndex = CATEGORY_ORDER.indexOf(b.slug);
    return (aIndex === -1 ? CATEGORY_ORDER.length : aIndex) - (bIndex === -1 ? CATEGORY_ORDER.length : bIndex);
  });
}

export function getCategory(slug: string) {
  return getCategories().find((category) => category.slug === slug) ?? null;
}

export function getPlacesInCategory(slug: string) {
  return places.filter((place) => place.categorySlug === slug).sort(byName);
}

export function getPlace(categorySlug: string, slug: string) {
  return places.find((place) => place.categorySlug === categorySlug && place.slug === slug) ?? null;
}

export function getMoreInCategory(place: Place, limit = 6) {
  return getPlacesInCategory(place.categorySlug)
    .filter((other) => other.id !== place.id)
    .slice(0, limit);
}

export function websiteHref(website: string) {
  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function openingHourLines(hours: string) {
  return hours
    .split(";")
    .map((line) => line.trim())
    .filter(Boolean);
}
