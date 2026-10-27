import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { Container } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Advertise",
  description: "Ask about a featured placement on the Hackney Wick Directory.",
  alternates: { canonical: "/advertise" },
};

export default function AdvertisePage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Advertise</h1>
      <div className="mt-4 max-w-2xl space-y-4 text-lg leading-8">
        <p>
          A featured placement puts a business on the homepage, and can also appear on a category page such as
          Cafés or Bars & Pubs.
        </p>
        <p>
          An editor’s pick is chosen by the directory. A paid placement is labelled Sponsored, so visitors can tell
          the difference. Send an enquiry and we will reply with the options. There is no obligation.
        </p>
      </div>
      <EnquiryForm
        formType="advertise"
        submitLabel="Send enquiry"
        fields={[
          { name: "business_name", label: "Business name", required: true },
          { name: "name", label: "Contact name", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Phone", type: "tel" },
          { name: "message", label: "Message", required: true, multiline: true },
        ]}
      />
    </Container>
  );
}
