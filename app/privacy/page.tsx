// DRAFT — this privacy notice needs your review before it is published. It is not legal advice.
// Replace every [Company name] and [contact email] before going live.

import type { Metadata } from "next";
import { Container } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How the Hackney Wick Directory handles personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Privacy</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8">
        Patch UK runs the Hackney Wick Directory. For any privacy question or request, email{" "}
        <a
          href="mailto:patchdirectoryuk@gmail.com"
          className="text-accent underline decoration-accent/40 underline-offset-4"
        >
          patchdirectoryuk@gmail.com
        </a>.
      </p>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight">What we collect</h2>
      <div className="mt-3 max-w-2xl space-y-4 leading-7">
        <p>
          We only collect what you send us through the contact, claim or advertise forms: your name, email, phone
          number if you give one, and your message. We use it to reply to you and, for claims, to update the listing.
          We don&apos;t sell it or use it for marketing.
        </p>
        <p>
          Forms are delivered by Formspree and the site is hosted by Vercel. Both process data on our behalf and may
          store it outside the UK. Vercel keeps basic server logs, including IP addresses, to run the site securely.
        </p>
        <p>We delete form messages within 24 months of our last contact with you.</p>
      </div>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight">Listings</h2>
      <p className="mt-3 max-w-2xl leading-7">
        Business details come from OpenStreetMap and from businesses themselves. If you&apos;d like a listing corrected
        or removed, email us.
      </p>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight">Cookies</h2>
      <p className="mt-3 max-w-2xl leading-7">
        This site doesn&apos;t use tracking or advertising cookies. If that changes, we&apos;ll ask for your consent
        first and update this page.
      </p>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight">Your rights</h2>
      <p className="mt-3 max-w-2xl leading-7">
        You can ask to see, correct or delete the information we hold about you, or object to how we use it. Email{" "}
        <a
          href="mailto:patchdirectoryuk@gmail.com"
          className="text-accent underline decoration-accent/40 underline-offset-4"
        >
          patchdirectoryuk@gmail.com
        </a>. If you&apos;re not happy with our response, you can complain to the ICO at{" "}
        <a
          href="https://ico.org.uk/"
          className="text-accent underline decoration-accent/40 underline-offset-4"
        >
          ico.org.uk
        </a>.
      </p>
    </Container>
  );
}
