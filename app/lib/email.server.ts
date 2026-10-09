import { Resend } from "resend";

export type Enquiry = {
  /** Subject line for the email LDF Solutions receives. */
  subject: string;
  heading: string;
  reference: string;
  customer: { name: string; email: string };
  details: [label: string, value: string][];
  message?: { label: string; value: string };
  attachments?: { filename: string; content: Buffer }[];
  acknowledgement: { subject: string; intro: string; nextSteps: string[] };
};

export class EmailConfigError extends Error {}

function getConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.EMAIL_TO;
  // onboarding@resend.dev works for testing, but can only deliver to the Resend
  // account owner. Use an address on a verified domain in production.
  const from = process.env.EMAIL_FROM || "LDF Solutions <onboarding@resend.dev>";
  return { apiKey, to, from };
}

/**
 * Sends the enquiry to LDF Solutions, then a best-effort acknowledgement to the
 * customer. Throws if the enquiry itself could not be delivered.
 */
export async function deliverEnquiry(enquiry: Enquiry) {
  const { apiKey, to, from } = getConfig();

  if (!apiKey || !to) {
    if (process.env.NODE_ENV === "production") {
      throw new EmailConfigError("RESEND_API_KEY and EMAIL_TO must be set");
    }
    console.info(
      `[email] RESEND_API_KEY/EMAIL_TO not set — skipping send in development.\n` +
        renderText(enquiry),
    );
    return;
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: to.split(",").map((s) => s.trim()),
    replyTo: enquiry.customer.email,
    subject: `${enquiry.subject} [${enquiry.reference}]`,
    html: renderInternalHtml(enquiry),
    text: renderText(enquiry),
    attachments: enquiry.attachments,
  });
  if (error) throw new Error(`Resend error: ${error.name} — ${error.message}`);

  // The acknowledgement is a courtesy; a failure here shouldn't fail the form.
  const ack = await resend.emails.send({
    from,
    to: enquiry.customer.email,
    replyTo: to.split(",")[0].trim(),
    subject: enquiry.acknowledgement.subject,
    html: renderAcknowledgementHtml(enquiry),
    text: renderAcknowledgementText(enquiry),
  });
  if (ack.error) {
    console.warn(`[email] Acknowledgement to customer failed: ${ack.error.message}`);
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const shell = (title: string, body: string) => `<!doctype html>
<html><body style="margin:0;background:#f7f8fa;font-family:Helvetica,Arial,sans-serif;color:#102134">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f8fa;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0063de;padding:24px 28px;color:#ffffff">
<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.7">LDF Solutions</div>
<div style="font-size:22px;font-weight:bold;margin-top:6px">${escapeHtml(title)}</div>
</td></tr>
<tr><td style="padding:28px">${body}</td></tr>
</table>
<p style="font-size:12px;color:#8a93a3;margin-top:16px">LDF Solutions · Smart Support. Simple Solutions.</p>
</td></tr></table></body></html>`;

function detailRows(enquiry: Enquiry) {
  const rows: [string, string][] = [
    ["Reference", enquiry.reference],
    ["Name", enquiry.customer.name],
    ["Email", enquiry.customer.email],
    ...enquiry.details,
  ];
  return rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `<tr>
<td style="padding:8px 12px 8px 0;color:#5b6475;font-size:14px;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>
<td style="padding:8px 0;font-size:14px;font-weight:600">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
}

function renderInternalHtml(enquiry: Enquiry) {
  const message = enquiry.message
    ? `<p style="margin:24px 0 8px;color:#5b6475;font-size:14px">${escapeHtml(enquiry.message.label)}</p>
<div style="background:#f7f8fa;border-radius:12px;padding:16px;font-size:15px;line-height:1.5;white-space:pre-wrap">${escapeHtml(enquiry.message.value)}</div>`
    : "";
  const files = enquiry.attachments?.length
    ? `<p style="margin-top:16px;font-size:14px;color:#5b6475">📎 ${enquiry.attachments.length} attachment(s) included.</p>`
    : "";
  return shell(
    enquiry.heading,
    `<table role="presentation" cellpadding="0" cellspacing="0">${detailRows(enquiry)}</table>${message}${files}
<p style="margin-top:24px;font-size:13px;color:#8a93a3">Reply to this email to respond directly to ${escapeHtml(enquiry.customer.name)}.</p>`,
  );
}

function renderAcknowledgementHtml(enquiry: Enquiry) {
  const firstName = enquiry.customer.name.split(" ")[0];
  const steps = enquiry.acknowledgement.nextSteps
    .map((s) => `<li style="margin-bottom:8px">${escapeHtml(s)}</li>`)
    .join("");
  return shell(
    enquiry.acknowledgement.subject,
    `<p style="font-size:16px;line-height:1.6;margin-top:0">Hi ${escapeHtml(firstName)},</p>
<p style="font-size:16px;line-height:1.6">${escapeHtml(enquiry.acknowledgement.intro)}</p>
<p style="font-size:14px;color:#5b6475">Your reference: <strong style="color:#0063de">${escapeHtml(enquiry.reference)}</strong></p>
<p style="font-size:15px;font-weight:bold;margin-top:24px">What happens next</p>
<ol style="font-size:15px;line-height:1.5;padding-left:20px">${steps}</ol>
<p style="font-size:15px;line-height:1.6;margin-top:24px">If anything changes in the meantime, just reply to this email.</p>
<p style="font-size:15px;line-height:1.6">— The LDF Solutions team</p>`,
  );
}

function renderText(enquiry: Enquiry) {
  const lines = [
    enquiry.heading,
    "",
    `Reference: ${enquiry.reference}`,
    `Name: ${enquiry.customer.name}`,
    `Email: ${enquiry.customer.email}`,
    ...enquiry.details.filter(([, v]) => v).map(([l, v]) => `${l}: ${v}`),
  ];
  if (enquiry.message) lines.push("", `${enquiry.message.label}:`, enquiry.message.value);
  if (enquiry.attachments?.length) {
    lines.push("", `Attachments: ${enquiry.attachments.map((a) => a.filename).join(", ")}`);
  }
  return lines.join("\n");
}

function renderAcknowledgementText(enquiry: Enquiry) {
  return [
    `Hi ${enquiry.customer.name.split(" ")[0]},`,
    "",
    enquiry.acknowledgement.intro,
    "",
    `Your reference: ${enquiry.reference}`,
    "",
    "What happens next:",
    ...enquiry.acknowledgement.nextSteps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "If anything changes in the meantime, just reply to this email.",
    "— The LDF Solutions team",
  ].join("\n");
}
