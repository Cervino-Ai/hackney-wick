"use client";

import { useSearchParams } from "next/navigation";
import { EnquiryForm } from "@/components/enquiry-form";

export function ClaimForm({ places }: { places: { slug: string; name: string }[] }) {
  const slug = useSearchParams().get("place") ?? "";
  const businessName = places.find((place) => place.slug === slug)?.name ?? "";

  return (
    <EnquiryForm
      formType="claim"
      submitLabel="Send claim"
      hiddenFields={slug ? { place: slug } : {}}
      fields={[
        {
          name: "business_name",
          label: "Business name",
          required: true,
          defaultValue: businessName,
        },
        { name: "name", label: "Your name", required: true, type: "text" },
        { name: "role", label: "Your role", required: true },
        { name: "email", label: "Email", required: true, type: "email" },
        { name: "phone", label: "Phone", type: "tel" },
        {
          name: "message",
          label: "What you’d like to update",
          required: true,
          multiline: true,
        },
      ]}
    />
  );
}
