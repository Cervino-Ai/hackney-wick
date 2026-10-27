import type { Metadata } from "next";
import { Suspense } from "react";
import { ClaimForm } from "@/components/claim-form";
import { Container } from "@/components/site-chrome";
import { getPlaces } from "@/lib/places";

export const metadata: Metadata = {
  title: "Claim a listing",
  description: "Claim or update a Hackney Wick Directory listing for free.",
  alternates: { canonical: "/claim" },
};

export default function ClaimPage() {
  const places = getPlaces().map((place) => ({ slug: place.slug, name: place.name }));

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Claim your listing</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8">
        Claiming is free. Tell us how you are connected to the business and what should change. We will check the
        request before the page is updated.
      </p>
      <Suspense fallback={<p className="mt-8 text-lg">Loading the form…</p>}>
        <ClaimForm places={places} />
      </Suspense>
    </Container>
  );
}
