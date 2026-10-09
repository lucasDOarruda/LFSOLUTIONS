import { useRef, useState } from "react";
import { Link, useFetcher, useSearchParams } from "react-router";
import type { Route } from "./+types/book";
import { handleBooking } from "~/lib/forms.server";
import { timeWindows, type FormResult } from "~/lib/forms";
import { bookingServices, plans } from "~/lib/site";
import { pageMeta } from "~/lib/meta";
import { PageHeader } from "~/components/ui";
import { AsideCard, DirectContactCard, FormPage, NumberedList } from "~/components/form-page";
import {
  FormAlert,
  Honeypot,
  SelectField,
  SubmitButton,
  SuccessPanel,
  TextArea,
  TextField,
  useFocusFirstError,
} from "~/components/form";

export function meta({}: Route.MetaArgs) {
  return pageMeta(
    "Book a Session",
    "Request a remote IT support session with LDF Solutions. Choose a service and a time that suits you.",
  );
}

export async function action({ request }: Route.ActionArgs) {
  return handleBooking(request);
}

export default function Book({ actionData }: Route.ComponentProps) {
  const [formKey, setFormKey] = useState(0);
  const onDemand = plans.find((p) => p.id === "on-demand");
  return (
    <>
      <PageHeader
        eyebrow="Book a session"
        title="Book a support session."
        intro="Tell us what you need and when suits you. We'll confirm availability and send your booking and secure payment link."
      />
      <FormPage
        aside={
          <>
            <AsideCard title="On-demand pricing">
              <dl className="space-y-3">
                {onDemand?.prices.map((p) => (
                  <div key={p.label} className="flex items-baseline justify-between border-b border-line pb-3">
                    <dt>{p.label}</dt>
                    <dd className="text-2xl font-semibold tracking-tight text-ink">{p.price}</dd>
                  </div>
                ))}
              </dl>
              <Link
                to="/services"
                className="mt-4 inline-block text-sm font-medium text-brand underline-offset-4 hover:underline"
              >
                See all plans and pricing
              </Link>
            </AsideCard>
            <AsideCard title="How booking works">
              <NumberedList
                items={[
                  "Send your request — it only takes a minute.",
                  "We confirm a time and send a secure payment link.",
                  "You get a confirmation, calendar invite and TeamViewer link.",
                  "Payment is only processed once the service is completed.",
                ]}
              />
            </AsideCard>
            <DirectContactCard />
          </>
        }
      >
        <BookingForm
          key={formKey}
          fallback={formKey === 0 ? actionData : undefined}
          onReset={() => setFormKey((k) => k + 1)}
        />
      </FormPage>
    </>
  );
}

function todayIso() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

function BookingForm({ fallback, onReset }: { fallback?: FormResult; onReset: () => void }) {
  const fetcher = useFetcher<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const [searchParams] = useSearchParams();
  const result = fetcher.data ?? fallback;
  const errors = result && !result.ok ? result.fieldErrors : {};
  useFocusFirstError(formRef, fetcher.data);

  const preselected = bookingServices.find((s) => s.id === searchParams.get("service"))?.value;

  if (result?.ok) {
    return (
      <SuccessPanel
        title="Booking request sent!"
        reference={result.reference}
        onReset={onReset}
        resetLabel="Make another booking"
      >
        <p>
          Thanks — we'll confirm availability shortly and send your booking
          confirmation with a secure payment link. Payment is only processed after
          the service is completed.
        </p>
      </SuccessPanel>
    );
  }

  return (
    <fetcher.Form ref={formRef} method="post" className="relative space-y-6">
      <div>
        <h2 className="text-xl">Your booking request</h2>
        <p className="mt-2 text-muted">We'll confirm the exact time with you before anything is charged.</p>
      </div>
      {result && !result.ok && result.formError ? <FormAlert>{result.formError}</FormAlert> : null}
      <Honeypot />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="name" label="Name" autoComplete="name" required maxLength={100} error={errors.name} />
        <TextField name="email" label="Email" type="email" autoComplete="email" required maxLength={200} error={errors.email} />
      </div>
      <TextField name="phone" label="Phone" type="tel" autoComplete="tel" required maxLength={30} error={errors.phone} />
      <SelectField
        name="service"
        label="Service"
        options={bookingServices.map((s) => s.value)}
        defaultValue={preselected ?? ""}
        required
        error={errors.service}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="date"
          label="Preferred date"
          type="date"
          min={todayIso()}
          suppressHydrationWarning
          error={errors.date}
        />
        <SelectField
          name="time"
          label="Preferred time"
          options={timeWindows}
          placeholder="Choose a time window…"
          error={errors.time}
        />
      </div>
      <TextArea
        name="details"
        label="What do you need help with?"
        maxLength={3000}
        rows={5}
        error={errors.details}
        placeholder="A short description helps us prepare for your session…"
      />
      <SubmitButton pending={fetcher.state !== "idle"}>Request booking</SubmitButton>
    </fetcher.Form>
  );
}
