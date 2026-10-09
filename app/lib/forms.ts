// Shared between the browser and the server, so keep this free of Node-only imports.

export type FormResult =
  | { ok: true; reference: string }
  | { ok: false; fieldErrors: Record<string, string>; formError?: string };

/** Name of the hidden anti-spam field. Real visitors never fill it in. */
export const HONEYPOT_FIELD = "website";

export const ATTACHMENTS = {
  field: "attachments",
  maxFiles: 5,
  // Kept under the ~4.5 MB request cap on common serverless hosts (Vercel, Netlify).
  maxTotalBytes: 4 * 1024 * 1024,
  extensions: ["jpg", "jpeg", "png", "webp", "gif", "heic", "heif", "pdf"],
  accept: "image/*,.heic,.heif,application/pdf",
} as const;

export const issueCategories = [
  "Computer (Windows)",
  "Computer (Mac)",
  "Wi-Fi / Internet",
  "Printer / Scanner",
  "Email / Microsoft 365",
  "Phone / Tablet",
  "Security / Virus concern",
  "Other",
] as const;

export const urgencyLevels = [
  "Low — whenever you can",
  "Normal — within a day or two",
  "Urgent — I can't work",
] as const;

export const timeWindows = [
  "Any time",
  "Morning (9am – 12pm)",
  "Afternoon (12pm – 5pm)",
  "Evening (5pm – 7pm)",
] as const;

export function fileExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
