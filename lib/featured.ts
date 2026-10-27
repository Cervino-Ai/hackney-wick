import featuredJson from "@/data/featured.json";
import { getPlaces, type Place } from "@/lib/places";

export type FeaturedEntry = {
  slug: string;
  sponsored: boolean;
  blurb: string;
};

export type FeaturedPlace = FeaturedEntry & {
  place: Place;
};

export function getFeaturedPlaces(): FeaturedPlace[] {
  const places = getPlaces();

  return (featuredJson as FeaturedEntry[]).flatMap((entry) => {
    const place = places.find((item) => item.slug === entry.slug);
    if (!place) return [];
    return [{ ...entry, place }];
  });
}
