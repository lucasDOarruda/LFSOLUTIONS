import { useRef, useState } from "react";
import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/contact";
import { handleContact } from "~/lib/forms.server";
import type { FormResult } from "~/lib/forms";
import { pageMeta } from "~/lib/meta";
import { PageHeader } from "~/components/ui";
import { AsideCard, DirectContactCard, FormPage } from "~/components/form-page";
import {
  FormAlert,
  Honeypot,
  SubmitButton,
  SuccessPanel,
  TextArea,
  TextField,
  useFocusFirstError,
} from "~/components/form";

export function meta({}: Route.MetaArgs) {
  return pageMeta(
    "Contact Us",
    "Get in touch with LDF Solutions for IT support, quotes and questions. We respond promptly.",
  );
}

export async function action({ request }: Route.ActionArgs) {
  return handleContact(request);
}

export default function Contact({ actionData }: Route.ComponentProps) {
  const [formKey, setFormKey] = useState(0);
  return (
    <>
      <PageHeader
        eyebrow="Contact us"
        title="Get in touch."
        intro="Questions, quotes or not sure where to start? Send us a message and we'll get back to you promptly."
      />
      <FormPage
        aside={
          <>
            <DirectContactCard />
            <AsideCard title="Have a technical problem?">
              <p className="leading-relaxed">
                Use the{" "}
                <Link to="/report-issue" className="font-medium text-brand underline-offset-4 hover:underline">
                  Report an Issue
                </Link>{" "}
                form so you can include screenshots, or{" "}
                <Link to="/book" className="font-medium text-brand underline-offset-4 hover:underline">
                  book a session
                </Link>{" "}
                directly.
              </p>
            </AsideCard>
          </>
        }
      >
        <ContactForm
          key={formKey}
          fallback={formKey === 0 ? actionData : undefined}
          onReset={() => setFormKey((k) => k + 1)}
        />
      </FormPage>
    </>
  );
}

function ContactForm({ fallback, onReset }: { fallback?: FormResult; onReset: () => void }) {
  const fetcher = useFetcher<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const result = fetcher.data ?? fallback;
  const errors = result && !result.ok ? result.fieldErrors : {};
  useFocusFirstError(formRef, fetcher.data);

  if (result?.ok) {
    return (
      <SuccessPanel title="Thanks — message received!" reference={result.reference} onReset={onReset}>
        <p>
          We've got your message and will get back to you shortly. A confirmation has
          been sent to your email.
        </p>
      </SuccessPanel>
    );
  }

  return (
    <fetcher.Form ref={formRef} method="post" className="relative space-y-6">
      <div>
        <h2 className="text-xl">Send us a message</h2>
        <p className="mt-2 text-muted">Fields marked optional can be left blank.</p>
      </div>
      {result && !result.ok && result.formError ? <FormAlert>{result.formError}</FormAlert> : null}
      <Honeypot />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="name" label="Name" autoComplete="name" required maxLength={100} error={errors.name} />
        <TextField name="email" label="Email" type="email" autoComplete="email" required maxLength={200} error={errors.email} />
      </div>
      <TextField
        name="phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
        maxLength={30}
        error={errors.phone}
        hint="Include it if you'd like a call back."
      />
      <TextArea
        name="message"
        label="How can we help?"
        required
        maxLength={5000}
        error={errors.message}
        placeholder="Tell us a little about what you need…"
      />
      <SubmitButton pending={fetcher.state !== "idle"}>Send message</SubmitButton>
    </fetcher.Form>
  );
}
