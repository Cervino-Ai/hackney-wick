"use client";

import Link from "next/link";
import { useState } from "react";
import { FORMSPREE_ENDPOINT } from "@/lib/forms";

export type FormField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel";
  required?: boolean;
  multiline?: boolean;
  defaultValue?: string;
};

const fieldClass =
  "mt-1 block w-full rounded-md border border-line bg-card px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function EnquiryForm({
  formType,
  fields,
  submitLabel = "Send",
  hiddenFields = {},
}: {
  formType: string;
  fields: FormField[];
  submitLabel?: string;
  hiddenFields?: Record<string, string>;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(event.currentTarget),
      });
      if (!response.ok) throw new Error("Form was not accepted");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="mt-8 max-w-xl text-lg" role="status">
        Thank you. Your message has been sent.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-xl space-y-4">
      <input type="hidden" name="form_type" value={formType} />
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium">
            {field.label}
          </label>
          {field.multiline ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              rows={5}
              defaultValue={field.defaultValue}
              className={fieldClass}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              defaultValue={field.defaultValue}
              autoComplete={field.type === "email" ? "email" : field.type === "tel" ? "tel" : undefined}
              className={fieldClass}
            />
          )}
        </div>
      ))}
      {status === "error" ? (
        <p className="text-sm" role="alert">
          Something went wrong and the message was not sent. Please try again.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-accent px-4 py-2 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : submitLabel}
      </button>
      <p className="text-sm text-muted">
        We use this only to reply. Read the{" "}
        <Link href="/privacy" className="text-accent underline decoration-accent/40 underline-offset-4">
          privacy page
        </Link>
        .
      </p>
    </form>
  );
}
