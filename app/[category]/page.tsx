import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Container } from "@/components/site-chrome";
import { getCategories, getCategory, getPlacesInCategory } from "@/lib/places";
import { breadcrumbList } from "@/lib/seo";

export const instant = false;

const categoryIntros: Record<string, string> = {
  "breweries-and-taprooms":
    "Breweries and taprooms in Hackney Wick, tucked into the yards. A good excuse to stay for one more.",
  "music-and-nightlife":
    "Hackney Wick after dark. Venues, clubs and the nights that start in a warehouse and end much later.",
  "bars-and-pubs":
    "Pubs and bars for a quick one or a long sit, scattered through Hackney Wick.",
  "cafes-and-coffee-shops":
    "Cafés and coffee shops for the oat flat white, the slow morning, and the laptop you promised to leave at home. Hackney Wick runs on them.",
  "food-and-drink":
    "Restaurants, kitchens and whatever is cooking in the yards. Hungry in Hackney Wick? Start here.",
  "arts-and-galleries":
    "Galleries and art spaces around Hackney Wick and Fish Island. Worth a wander, even if you only came for lunch.",
  "studios-and-creative-spaces":
    "Studios and rooms for making things, which is most of the point of Hackney Wick. If someone is building it, it may well be in here.",
  "health-and-fitness":
    "Gyms, classes and somewhere to stretch. Hackney Wick has options for before work, after the pub, or instead of the pub.",
  "parks-and-outdoors":
    "Parks, paths and the canal, for when the yards feel like enough. Fresh air is a short walk.",
  community:
    "Halls, hubs and the rooms that hold the neighbourhood together. The quiet ones count too.",
  services:
    "Haircuts, repairs and the places you need when something breaks. The useful side of Hackney Wick.",
  workspaces:
    "Desks and offices in the arches and the newer buildings. Somewhere to work that isn't the kitchen table.",
  shops:
    "Shops for the thing you forgot, and a few you didn't know you wanted. Hackney Wick's version of a high street.",
};

export function generateStaticParams() {
  return getCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) return { title: "Not found" };
  const isCafes = category.slug === "cafes-and-coffee-shops";
  return {
    title: isCafes ? "Best Cafés & Coffee Shops in Hackney Wick" : `${category.name} in Hackney Wick`,
    description: isCafes
      ? `${category.count} cafés and coffee shops in Hackney Wick, with addresses and opening hours.`
      : `${category.count} ${category.name} in Hackney Wick, with addresses and opening hours.`,
    alternates: { canonical: `/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const places = getPlacesInCategory(category.slug);
  const intro = categoryIntros[category.slug];

  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={breadcrumbList([
          { name: "Hackney Wick Directory", path: "/" },
          { name: category.name, path: `/${category.slug}` },
        ])}
      />
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{category.name}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8">{intro}</p>
      <ul className="mt-10 border-t border-line">
        {places.map((place) => (
          <li key={place.id} className="border-b border-line">
            <Link
              href={`/${place.categorySlug}/${place.slug}`}
              className="block py-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="text-lg font-medium">{place.name}</span>
              {place.address ? <span className="mt-1 block text-sm text-muted">{place.address}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
