import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  // Builds the server as Vercel Functions so the form actions (Resend) run server-side.
  presets: [vercelPreset()],
} satisfies Config;
