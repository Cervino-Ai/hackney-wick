import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Container } from "@/components/site-chrome";
import {
  formatGuideDate,
  getGuidePlaces,
  getPublishedGuide,
  getPublishedGuides,
  renderGuideMarkdown,
} from "@/lib/guides";
import { guideArticle } from "@/lib/seo";

export const instant = false;

export function generateStaticParams() {
  const guides = getPublishedGuides();
  // Cache Components requires at least one result, even when every guide is a draft.
  if (guides.length === 0) return [{ slug: "_" }];
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPublishedGuide(slug);
  if (!guide) return { title: "Not found" };
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

const guideBodyClass = [
  "max-w-2xl text-lg leading-8",
  "[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
  "[&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight",
  "[&_p]:mt-4",
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
  "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
  "[&_a]:text-accent [&_a]:underline [&_a]:decoration-accent/40 [&_a]:underline-offset-4",
  "[&_img]:mx-auto [&_img]:mt-6 [&_img]:max-h-[32rem] [&_img]:w-auto [&_img]:max-w-full [&_img]:rounded-lg",
  "[&_p_em]:text-base [&_p_em]:text-muted",
  "[&_code]:rounded [&_code]:bg-line [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-base",
  "[&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-line [&_pre]:p-4 [&_pre]:text-sm",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
].join(" ");

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getPublishedGuide(slug);
  if (!guide) notFound();

  const places = getGuidePlaces(guide);
  const html = renderGuideMarkdown(guide.body);

  return (
    <Container className="py-10 sm:py-14">
      <JsonLd data={guideArticle(guide)} />
      <article>
        <header className="max-w-2xl">
          <p className="text-sm text-muted">
            <time dateTime={guide.date}>{formatGuideDate(guide.date)}</time>
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{guide.title}</h1>
          <p className="mt-4 text-lg leading-8">{guide.description}</p>
        </header>
        <div className={`mt-8 ${guideBodyClass}`} dangerouslySetInnerHTML={{ __html: html }} />
        {places.length > 0 ? (
          <section className="mt-12" aria-labelledby="guide-places-heading">
            <h2 id="guide-places-heading" className="text-2xl font-semibold tracking-tight">
              Places in this guide
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <li key={place.id}>
                  <Link
                    href={`/${place.categorySlug}/${place.slug}`}
                    className="block h-full rounded-lg border border-line bg-card p-4 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted">{place.category}</span>
                    <span className="mt-2 block text-lg font-medium">{place.name}</span>
                    {place.address ? <span className="mt-1 block text-sm leading-6 text-muted">{place.address}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </Container>
  );
}
