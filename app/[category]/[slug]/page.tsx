import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Container } from "@/components/site-chrome";
import {
  getMoreInCategory,
  getPlace,
  getPlaces,
  isIndexablePlace,
  openingHourLines,
  phoneHref,
  websiteHref,
} from "@/lib/places";
import { breadcrumbList, localBusiness, placeDescription } from "@/lib/seo";

export const instant = false;

export function generateStaticParams() {
  return getPlaces().map((place) => ({
    category: place.categorySlug,
    slug: place.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const place = getPlace(category, slug);
  if (!place) return { title: "Not found" };
  return {
    title: `${place.name}, Hackney Wick`,
    description: placeDescription(place.name),
    alternates: { canonical: `/${place.categorySlug}/${place.slug}` },
    ...(isIndexablePlace(place) ? {} : { robots: { index: false } }),
  };
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const place = getPlace(category, slug);
  if (!place) notFound();

  const more = getMoreInCategory(place);
  const hours = place.openingHours ? openingHourLines(place.openingHours) : [];

  return (
    <Container className="py-10 sm:py-14">
      <JsonLd data={localBusiness(place)} />
      <JsonLd
        data={breadcrumbList([
          { name: "Hackney Wick Directory", path: "/" },
          { name: place.category, path: `/${place.categorySlug}` },
          { name: place.name, path: `/${place.categorySlug}/${place.slug}` },
        ])}
      />
      <Link
        href={`/${place.categorySlug}`}
        className="text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {place.category}
      </Link>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{place.name}</h1>

      <dl className="mt-8 max-w-2xl space-y-5">
        {place.address ? (
          <div>
            <dt className="text-sm font-medium text-accent">Address</dt>
            <dd className="mt-1">{place.address}</dd>
          </div>
        ) : null}
        {hours.length > 0 ? (
          <div>
            <dt className="text-sm font-medium text-accent">Opening hours</dt>
            <dd className="mt-1">
              {hours.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </dd>
          </div>
        ) : null}
        {place.website ? (
          <div>
            <dt className="text-sm font-medium text-accent">Website</dt>
            <dd className="mt-1">
              <a
                href={websiteHref(place.website)}
                className="break-all text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {place.website}
              </a>
            </dd>
          </div>
        ) : null}
        {place.phone ? (
          <div>
            <dt className="text-sm font-medium text-accent">Phone</dt>
            <dd className="mt-1">
              <a
                href={phoneHref(place.phone)}
                className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {place.phone}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-8 text-sm">
        <Link
          href={`/claim?place=${place.slug}`}
          className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Is this your business? Claim or update this listing
        </Link>
      </p>

      {more.length > 0 ? (
        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">More in {place.category}</h2>
          <ul className="mt-4 border-t border-line">
            {more.map((other) => (
              <li key={other.id} className="border-b border-line">
                <Link
                  href={`/${other.categorySlug}/${other.slug}`}
                  className="block py-3 font-medium hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Container>
  );
}
