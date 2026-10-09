import { data } from "react-router";
import { bookingServices } from "./site";
import { deliverEnquiry, type Enquiry } from "./email.server";
import {
  ATTACHMENTS,
  HONEYPOT_FIELD,
  fileExtension,
  formatBytes,
  issueCategories,
  timeWindows,
  urgencyLevels,
  type FormResult,
} from "./forms";

type FieldSpec = {
  label: string;
  required?: boolean | string;
  max: number;
  kind?: "email" | "phone" | "date" | "multiline";
  oneOf?: readonly string[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{6,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validate<K extends string>(formData: FormData, spec: Record<K, FieldSpec>) {
  const values = {} as Record<K, string>;
  const fieldErrors: Record<string, string> = {};

  for (const name of Object.keys(spec) as K[]) {
    const rule = spec[name];
    const raw = formData.get(name);
    let value = typeof raw === "string" ? raw.trim() : "";
    // Single-line fields end up in email headers/subjects, so flatten whitespace.
    if (rule.kind !== "multiline") value = value.replace(/\s+/g, " ");
    values[name] = value;

    if (!value) {
      if (rule.required) {
        fieldErrors[name] =
          typeof rule.required === "string"
            ? rule.required
            : `Please enter your ${rule.label.toLowerCase()}.`;
      }
      continue;
    }
    if (value.length > rule.max) {
      fieldErrors[name] = `${rule.label} must be ${rule.max} characters or fewer.`;
    } else if (rule.kind === "email" && !EMAIL_RE.test(value)) {
      fieldErrors[name] = "Please enter a valid email address.";
    } else if (rule.kind === "phone" && !PHONE_RE.test(value)) {
      fieldErrors[name] = "Please enter a valid phone number.";
    } else if (rule.kind === "date" && !isUpcomingDate(value)) {
      fieldErrors[name] = "Please choose today or a future date.";
    } else if (rule.oneOf && !rule.oneOf.includes(value)) {
      fieldErrors[name] = `Please choose a valid ${rule.label.toLowerCase()}.`;
    }
  }

  return { values, fieldErrors };
}

function isUpcomingDate(value: string) {
  if (!DATE_RE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return false;
  // Allow a day of slack for visitors in time zones ahead of the server.
  return date.getTime() >= Date.now() - 2 * 24 * 60 * 60 * 1000;
}

function newReference() {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const code = Array.from(bytes, (b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 6)
    .toUpperCase();
  return `LDF-${code}`;
}

function invalid(fieldErrors: Record<string, string>, status = 400) {
  return data<FormResult>({ ok: false, fieldErrors }, { status });
}

function isSpam(formData: FormData) {
  const trap = formData.get(HONEYPOT_FIELD);
  return typeof trap === "string" && trap.length > 0;
}

async function send(enquiry: Enquiry) {
  try {
    await deliverEnquiry(enquiry);
    return data<FormResult>({ ok: true, reference: enquiry.reference });
  } catch (error) {
    console.error("[email] Failed to deliver enquiry", error);
    return data<FormResult>(
      {
        ok: false,
        fieldErrors: {},
        formError:
          "Sorry, we couldn't send your message right now. Please try again in a moment, or message us on WhatsApp.",
      },
      { status: 502 },
    );
  }
}

const contactFields = {
  name: { label: "Name", required: true, max: 100 },
  email: { label: "Email", required: true, max: 200, kind: "email" },
  phone: { label: "Phone", max: 30, kind: "phone" },
  message: {
    label: "Message",
    required: "Please tell us how we can help.",
    max: 5000,
    kind: "multiline",
  },
} satisfies Record<string, FieldSpec>;

export async function handleContact(request: Request) {
  const formData = await request.formData();
  const reference = newReference();
  if (isSpam(formData)) return data<FormResult>({ ok: true, reference });

  const { values, fieldErrors } = validate(formData, contactFields);
  if (Object.keys(fieldErrors).length) return invalid(fieldErrors);

  return send({
    subject: `New enquiry from ${values.name}`,
    heading: "New website enquiry",
    reference,
    customer: { name: values.name, email: values.email },
    details: [["Phone", values.phone]],
    message: { label: "Message", value: values.message },
    acknowledgement: {
      subject: "We've received your message — LDF Solutions",
      intro:
        "Thanks for getting in touch with LDF Solutions. We've received your message and will get back to you shortly.",
      nextSteps: [
        "We'll review your message and reply by email (or phone, if you left a number).",
        "If you need help with a technical problem, we'll let you know whether we can assist and the next steps.",
      ],
    },
  });
}

const bookingFields = {
  name: { label: "Name", required: true, max: 100 },
  email: { label: "Email", required: true, max: 200, kind: "email" },
  phone: { label: "Phone", required: true, max: 30, kind: "phone" },
  service: {
    label: "Service",
    required: "Please choose a service.",
    max: 100,
    oneOf: bookingServices.map((s) => s.value),
  },
  date: { label: "Preferred date", max: 10, kind: "date" },
  time: { label: "Preferred time", max: 40, oneOf: timeWindows },
  details: { label: "Details", max: 3000, kind: "multiline" },
} satisfies Record<string, FieldSpec>;

export async function handleBooking(request: Request) {
  const formData = await request.formData();
  const reference = newReference();
  if (isSpam(formData)) return data<FormResult>({ ok: true, reference });

  const { values, fieldErrors } = validate(formData, bookingFields);
  if (Object.keys(fieldErrors).length) return invalid(fieldErrors);

  const preferredDate = values.date
    ? new Date(`${values.date}T00:00:00Z`).toLocaleDateString("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  return send({
    subject: `Booking request: ${values.service} — ${values.name}`,
    heading: "New booking request",
    reference,
    customer: { name: values.name, email: values.email },
    details: [
      ["Phone", values.phone],
      ["Service", values.service],
      ["Preferred date", preferredDate],
      ["Preferred time", values.time],
    ],
    message: values.details
      ? { label: "What do you need help with?", value: values.details }
      : undefined,
    acknowledgement: {
      subject: "Your booking request — LDF Solutions",
      intro: `Thanks for your booking request for: ${values.service}. We'll confirm availability and get back to you shortly.`,
      nextSteps: [
        "We'll confirm a time that suits you.",
        "You'll receive a secure link to enter payment details — payment is only processed after the service is completed.",
        "You'll get a booking confirmation, a calendar invite and a secure TeamViewer link for your remote session.",
      ],
    },
  });
}

const issueFields = {
  name: { label: "Name", required: true, max: 100 },
  email: { label: "Email", required: true, max: 200, kind: "email" },
  phone: { label: "Phone", max: 30, kind: "phone" },
  category: {
    label: "Issue type",
    required: "Please choose the type of issue.",
    max: 60,
    oneOf: issueCategories,
  },
  urgency: {
    label: "Urgency",
    required: "Please tell us how urgent this is.",
    max: 60,
    oneOf: urgencyLevels,
  },
  description: {
    label: "Description",
    required: "Please describe the problem.",
    max: 5000,
    kind: "multiline",
  },
} satisfies Record<string, FieldSpec>;

// Leave room for the text fields and multipart overhead on top of the files.
const MAX_ISSUE_REQUEST_BYTES = ATTACHMENTS.maxTotalBytes + 256 * 1024;

export async function handleIssue(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_ISSUE_REQUEST_BYTES) {
    return invalid(
      {
        [ATTACHMENTS.field]: `Attachments are too large. Please keep the total under ${formatBytes(ATTACHMENTS.maxTotalBytes)}.`,
      },
      413,
    );
  }

  const formData = await request.formData();
  const reference = newReference();
  if (isSpam(formData)) return data<FormResult>({ ok: true, reference });

  const { values, fieldErrors } = validate(formData, issueFields);

  const files = formData
    .getAll(ATTACHMENTS.field)
    .filter((v): v is File => typeof v !== "string" && v.size > 0);
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  const badFile = files.find(
    (f) => !(ATTACHMENTS.extensions as readonly string[]).includes(fileExtension(f.name)),
  );

  if (files.length > ATTACHMENTS.maxFiles) {
    fieldErrors[ATTACHMENTS.field] = `Please attach no more than ${ATTACHMENTS.maxFiles} files.`;
  } else if (totalBytes > ATTACHMENTS.maxTotalBytes) {
    fieldErrors[ATTACHMENTS.field] = `Attachments are too large. Please keep the total under ${formatBytes(ATTACHMENTS.maxTotalBytes)}.`;
  } else if (badFile) {
    fieldErrors[ATTACHMENTS.field] = `“${badFile.name}” isn't a supported file type. Please attach photos or PDFs.`;
  }

  if (Object.keys(fieldErrors).length) return invalid(fieldErrors);

  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name.replace(/[^\w.\- ]+/g, "_").slice(-100),
      content: Buffer.from(await file.arrayBuffer()),
    })),
  );

  return send({
    subject: `Issue report (${values.urgency.split(" —")[0]}): ${values.category} — ${values.name}`,
    heading: "New issue report",
    reference,
    customer: { name: values.name, email: values.email },
    details: [
      ["Phone", values.phone],
      ["Issue type", values.category],
      ["Urgency", values.urgency],
    ],
    message: { label: "Problem description", value: values.description },
    attachments,
    acknowledgement: {
      subject: "We've received your issue report — LDF Solutions",
      intro:
        "Thanks for reporting your issue. We're reviewing the details now and will respond promptly to confirm whether we can assist and the next steps.",
      nextSteps: [
        "We review your request and confirm whether we can help.",
        "Once you're happy to proceed, you'll receive a secure payment link — payment is only processed after the service is completed.",
        "You choose a convenient time, and we connect remotely (TeamViewer) to fix the issue in real time.",
      ],
    },
  });
}
