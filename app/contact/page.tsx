import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { Container } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send a message to the Hackney Wick Directory.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Contact</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8">
        A question, a correction, or a place we've missed. Send it here, or email patchdirectoryuk@gmail.com.
      </p>
      <EnquiryForm
        formType="contact"
        submitLabel="Send message"
        fields={[
          { name: "name", label: "Name", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "message", label: "Message", required: true, multiline: true },
        ]}
      />
    </Container>
  );
}
