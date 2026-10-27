import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site-chrome";
import { formatGuideDate, getPublishedGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description: "Guides to places and neighbourhoods in Hackney Wick.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const guides = getPublishedGuides();

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Guides</h1>
      {guides.length === 0 ? (
        <p className="mt-4 max-w-2xl text-lg leading-8">No guides yet. They’ll turn up here when they’re ready.</p>
      ) : (
        <ul className="mt-8 max-w-2xl divide-y divide-line">
          {guides.map((guide) => (
            <li key={guide.slug} className="py-5">
              <Link
                href={`/guides/${guide.slug}`}
                className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <span className="text-sm text-muted">{formatGuideDate(guide.date)}</span>
                <span className="mt-1 block text-xl font-medium group-hover:text-accent">{guide.title}</span>
                <span className="mt-1 block leading-7">{guide.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
