import { useRef, useState } from "react";
import { useFetcher } from "react-router";
import { CreditCard } from "lucide-react";
import type { Route } from "./+types/report-issue";
import { handleIssue } from "~/lib/forms.server";
import { ATTACHMENTS, issueCategories, urgencyLevels, type FormResult } from "~/lib/forms";
import { pageMeta } from "~/lib/meta";
import { PageHeader } from "~/components/ui";
import { AsideCard, DirectContactCard, FormPage, NumberedList } from "~/components/form-page";
import {
  AttachmentField,
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
    "Report an Issue",
    "Tell us what's going wrong — include photos or screenshots — and LDF Solutions will respond promptly with the next steps.",
  );
}

export async function action({ request }: Route.ActionArgs) {
  return handleIssue(request);
}

export default function ReportIssue({ actionData }: Route.ComponentProps) {
  const [formKey, setFormKey] = useState(0);
  return (
    <>
      <PageHeader
        eyebrow="Report an issue"
        title="Tell us what's going wrong."
        intro="Describe the problem and add a photo or screenshot if you can. We'll review it and confirm whether we can help — before you commit to anything."
      />
      <FormPage
        aside={
          <>
            <AsideCard title="What happens next">
              <NumberedList
                items={[
                  "We review your request and respond promptly.",
                  "You confirm you'd like to proceed.",
                  "You receive a secure payment link and pick a time.",
                  "We connect remotely via TeamViewer and fix it.",
                ]}
              />
              <p className="mt-5 flex items-start gap-2 rounded-lg bg-brand-50 px-4 py-3 text-sm font-medium text-brand-dark">
                <CreditCard aria-hidden className="mt-0.5 size-4 shrink-0" />
                Payment is only processed after the service is completed.
              </p>
            </AsideCard>
            <DirectContactCard />
          </>
        }
      >
        <IssueForm
          key={formKey}
          fallback={formKey === 0 ? actionData : undefined}
          onReset={() => setFormKey((k) => k + 1)}
        />
      </FormPage>
    </>
  );
}

function IssueForm({ fallback, onReset }: { fallback?: FormResult; onReset: () => void }) {
  const fetcher = useFetcher<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const result = fetcher.data ?? fallback;
  const errors = result && !result.ok ? result.fieldErrors : {};
  useFocusFirstError(formRef, fetcher.data);

  if (result?.ok) {
    return (
      <SuccessPanel
        title="Thanks — we've got your report."
        reference={result.reference}
        onReset={onReset}
        resetLabel="Report another issue"
      >
        <p>
          We're reviewing the details now and will respond promptly to confirm whether
          we can assist and the next steps. A copy of your reference has been sent to
          your email.
        </p>
      </SuccessPanel>
    );
  }

  return (
    <fetcher.Form ref={formRef} method="post" encType="multipart/form-data" className="relative space-y-6">
      <div>
        <h2 className="text-xl">Issue details</h2>
        <p className="mt-2 text-muted">The more detail you give us, the faster we can help.</p>
      </div>
      {result && !result.ok && result.formError ? <FormAlert>{result.formError}</FormAlert> : null}
      <Honeypot />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="name" label="Name" autoComplete="name" required maxLength={100} error={errors.name} />
        <TextField name="email" label="Email" type="email" autoComplete="email" required maxLength={200} error={errors.email} />
      </div>
      <TextField name="phone" label="Phone" type="tel" autoComplete="tel" maxLength={30} error={errors.phone} />
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          name="category"
          label="What's the issue with?"
          options={issueCategories}
          required
          error={errors.category}
        />
        <SelectField
          name="urgency"
          label="How urgent is it?"
          options={urgencyLevels}
          required
          error={errors.urgency}
        />
      </div>
      <TextArea
        name="description"
        label="Describe the problem"
        required
        maxLength={5000}
        rows={7}
        error={errors.description}
        placeholder="What's happening, when did it start, and any error messages you see…"
      />
      <AttachmentField error={errors[ATTACHMENTS.field]} />
      <SubmitButton pending={fetcher.state !== "idle"}>Submit issue report</SubmitButton>
    </fetcher.Form>
  );
}
