import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site-chrome";
import { getFeaturedPlaces } from "@/lib/featured";
import { formatGuideDate, getLatestGuides } from "@/lib/guides";
import { getCategories } from "@/lib/places";

export const metadata: Metadata = {
  title: {
    absolute: "Hackney Wick Directory",
  },
  description:
    "The local guide to Hackney Wick and Fish Island: the best bars, cafés, breweries, galleries and studios, plus guides to eating, drinking and making things in E9.",
  alternates: { canonical: "/" },
};

const intro =
  "Hackney Wick, sorted. Every bar, café, brewery, gallery and studio in Hackney Wick and Fish Island, in one place.";

export default function HomePage() {
  const categories = getCategories();
  const featured = getFeaturedPlaces();
  const latestGuides = getLatestGuides(3);

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Hackney Wick Directory</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8">{intro}</p>
      {featured.length > 0 ? (
        <section className="mt-10" aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="text-2xl font-semibold tracking-tight">
            Featured
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {featured.map(({ place, blurb, sponsored }) => (
              <li key={place.id}>
                <Link
                  href={`/${place.categorySlug}/${place.slug}`}
                  rel={sponsored ? "sponsored" : undefined}
                  className="block h-full rounded-lg border border-line bg-card p-4 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {sponsored ? (
                    <span className="inline-block rounded-full bg-line px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted">
                      Sponsored
                    </span>
                  ) : (
                    <span className="text-xs font-semibold uppercase tracking-wide text-accent">Editor’s pick</span>
                  )}
                  <span className="mt-2 block text-lg font-medium">{place.name}</span>
                  {blurb ? <span className="mt-1 block text-sm leading-6 text-muted">{blurb}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {latestGuides.length > 0 ? (
        <section className="mt-10" aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="text-2xl font-semibold tracking-tight">
            Guides
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {latestGuides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="block h-full rounded-lg border border-line bg-card p-4 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {formatGuideDate(guide.date)}
                  </span>
                  <span className="mt-2 block text-lg font-medium">{guide.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-muted">{guide.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/${category.slug}`}
              className="block h-full rounded-lg border border-line bg-card p-4 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="text-3xl font-semibold text-accent">{category.count}</span>
              <span className="mt-2 block text-lg font-medium">{category.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/advertise"
        className="mt-8 block rounded-md border border-line bg-card px-4 py-3 text-sm hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="font-medium">Advertise here</span>
        <span className="text-muted"> — a featured spot on the homepage or a category page</span>
      </Link>
    </Container>
  );
}
