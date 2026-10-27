import type { Metadata } from "next";
import { Container } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "About",
  description: "Patch is an independent local directory for Hackney Wick and Fish Island.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">About</h1>
      <div className="mt-4 max-w-2xl space-y-4 text-lg leading-8">
        <p>
          Patch is an independent local directory for Hackney Wick and Fish Island. Bars, cafés, breweries,
          galleries, studios and the rest of the neighbourhood, in one place.
        </p>
        <p>
          Listings come from OpenStreetMap and from the businesses themselves. If a listing is yours, you can claim
          it or correct it for free.
        </p>
        <p>
          Questions or a place we should add:{" "}
          <a
            href="mailto:patchdirectoryuk@gmail.com"
            className="text-accent underline decoration-accent/40 underline-offset-4"
          >
            patchdirectoryuk@gmail.com
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
