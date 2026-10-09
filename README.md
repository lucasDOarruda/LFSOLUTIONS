# LDF Solutions website

Marketing and support-request site for LDF Solutions, built with React Router (framework mode), Vite, Tailwind CSS v4 and Resend.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, services overview, how-it-works preview, why us |
| `/services` | Plans, pricing and fixed-price services |
| `/how-it-works` | The 11-step support workflow |
| `/about` | Company information and values |
| `/contact` | "Get in touch" form → email |
| `/report-issue` | Issue report form with optional photo/PDF attachments → email |
| `/book` | Booking enquiry form → email (`/book?service=wifi` preselects a service) |

Business details, pricing and workflow copy all live in [`app/lib/site.ts`](app/lib/site.ts).

## Email (Resend)

Form submissions are handled by route `action`s, which run **only on the server**, so the Resend API key is never exposed to the browser. Each submission:

1. emails the enquiry to `EMAIL_TO` (with `Reply-To` set to the customer), then
2. sends the customer an acknowledgement with a reference number (best effort — a failure here doesn't fail the form).

Copy `.env.example` to `.env` and fill in:

- `RESEND_API_KEY`: from https://resend.com/api-keys
- `EMAIL_TO`: inbox that receives enquiries
- `EMAIL_FROM`: sender on a domain verified in Resend. Until a domain is verified, Resend only delivers to the account owner, so customer acknowledgements won't arrive.

Without `RESEND_API_KEY` in development, emails are printed to the server console instead of being sent. In production, missing config causes submissions to fail with a friendly error.

Attachments are capped at 5 files / 4 MB total so requests stay under common serverless body limits. Large photos are downscaled in the browser before upload.

## Development

Requires Node 22.22+ (or 24).

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build
npm start          # serves the production build on :3000
```

## Deployment

Any Node host works. The included `Dockerfile` builds and runs the production server; pass the env vars above at runtime. For Vercel or Netlify, add the matching React Router adapter/preset, and the route actions deploy as serverless functions.
