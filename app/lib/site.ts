import {
  CalendarClock,
  CircleCheck,
  Clock,
  CreditCard,
  Gift,
  Handshake,
  Headset,
  Laptop,
  MailCheck,
  MessagesSquare,
  Package,
  Printer,
  ScreenShare,
  Settings,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";

// Business details live here so copy changes don't require touching page code.
export const site = {
  name: "LDF Solutions",
  tagline: "Smart Support. Simple Solutions.",
  description:
    "Reliable, straightforward IT support for small businesses and busy professionals across Australia and New Zealand.",
  serviceArea: "Australia & New Zealand",
  email: "fogacaluciana10@gmail.com",
  phoneDisplay: "0481 260 335",
  phoneHref: "tel:+61481260335",
  whatsappHref: `https://wa.me/61481260335?text=${encodeURIComponent(
    "Hi LDF Solutions, I need some help with ",
  )}`,
} as const;

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services & Pricing" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export type Plan = {
  id: string;
  name: string;
  icon: LucideIcon;
  blurb: string;
  prices: { label: string; price: string; unit?: string }[];
  features: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "on-demand",
    name: "On-Demand Support",
    icon: Clock,
    blurb: "Fast, reliable help when you need it most.",
    prices: [
      { label: "30-minute session", price: "$69" },
      { label: "1-hour session", price: "$120" },
    ],
    features: [
      "Remote support",
      "Quick troubleshooting & fixes",
      "Flexible booking",
    ],
  },
  {
    id: "monthly",
    name: "Monthly Support Plan",
    icon: Package,
    blurb: "Ongoing support for peace of mind.",
    prices: [{ label: "Starter Plan", price: "$220", unit: "/month" }],
    features: [
      "Up to 2 hours of support per month",
      "Priority response",
      "Assistance with everyday IT needs",
    ],
    featured: true,
  },
];

export const fixedServices = [
  {
    id: "wifi",
    name: "Wi-Fi Troubleshooting",
    price: "$75",
    icon: Wifi,
    description:
      "Slow, patchy or dropping connections diagnosed and sorted so your team can get back online.",
  },
  {
    id: "printer",
    name: "Printer Support",
    price: "$85",
    icon: Printer,
    description:
      "Printer not connecting, printing or scanning? We'll track down the problem and get it working.",
  },
  {
    id: "setup",
    name: "Business Setup & Configuration",
    price: "Quote",
    icon: Settings,
    description:
      "Email, Microsoft 365, Wi-Fi, printers and system setup done right the first time.",
  },
] as const;

export const coreServices = [
  {
    icon: Headset,
    title: "On-Demand IT Support",
    text: "Fast help when you need it — remote troubleshooting for everyday tech issues.",
  },
  {
    icon: Settings,
    title: "Business Setup & Configuration",
    text: "Email, Microsoft 365, Wi-Fi, printers, and system setup done right.",
  },
  {
    icon: Package,
    title: "Monthly Support Plans",
    text: "Ongoing support with priority service for peace of mind.",
  },
] as const;

// Options for the booking form. Values are sent in the enquiry email.
export const bookingServices = [
  { value: "30-minute session ($69)", id: "on-demand-30" },
  { value: "1-hour session ($120)", id: "on-demand-60" },
  { value: "Monthly Support Plan — Starter ($220/month)", id: "monthly" },
  { value: "Wi-Fi Troubleshooting ($75)", id: "wifi" },
  { value: "Printer Support ($85)", id: "printer" },
  { value: "Business Setup & Configuration (quote)", id: "setup" },
  { value: "Not sure yet — please advise", id: "unsure" },
] as const;

export const pillars = [
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    text: "Your data and privacy are our priority.",
  },
  {
    icon: Zap,
    title: "Fast Response",
    text: "We act quickly to minimise downtime.",
  },
  {
    icon: Users,
    title: "Client Focused",
    text: "Personalised support that builds trust.",
  },
  {
    icon: TrendingUp,
    title: "Long-Term Partnership",
    text: "We're here to support your business growth.",
  },
] as const;

export const values = [
  { title: "Responsiveness", text: "Fast support when you need it." },
  { title: "Reliability", text: "Consistent, dependable service." },
  { title: "Trust", text: "Building long-term relationships." },
  { title: "Efficiency", text: "Solving problems quickly and effectively." },
] as const;

export const differentiators = [
  {
    title: "Easy to request help",
    text: "Report an issue or book a session online in a few clicks — no phone queues.",
  },
  {
    title: "Direct communication",
    text: "You talk to the person fixing your problem, not a ticket system.",
  },
  {
    title: "We know our clients",
    text: "Personal service from someone who understands your setup and your business.",
  },
  {
    title: "More care and attention",
    text: "Clear explanations, no jargon, and a follow-up to make sure everything works.",
  },
] as const;

export type WorkflowStep = {
  title: string;
  icon: LucideIcon;
  text: string;
  bullets?: string[];
  note?: string;
};

export const workflow: WorkflowStep[] = [
  {
    title: "Client submits a request",
    icon: Laptop,
    text: "You report an issue through the website using the “Report an Issue” form.",
  },
  {
    title: "Initial review & response",
    icon: Headset,
    text: "LDF Solutions reviews the request and responds promptly to confirm whether we can assist and the next steps.",
  },
  {
    title: "Client confirmation",
    icon: Handshake,
    text: "You agree to proceed with the service.",
  },
  {
    title: "Payment setup",
    icon: CreditCard,
    text: "You receive a secure link to enter your payment details.",
    note: "Payment is only processed after the service is completed.",
  },
  {
    title: "Booking the session",
    icon: CalendarClock,
    text: "You select a convenient date and time using the booking link.",
  },
  {
    title: "Booking confirmation",
    icon: MailCheck,
    text: "You receive:",
    bullets: [
      "Booking confirmation",
      "Calendar invite",
      "Secure link for the remote session (TeamViewer)",
    ],
  },
  {
    title: "Remote support session",
    icon: ScreenShare,
    text: "At the scheduled time, LDF Solutions connects remotely and resolves the issue in real time.",
  },
  {
    title: "Service completion & payment",
    icon: CircleCheck,
    text: "Once the issue is resolved:",
    bullets: [
      "The service is marked as complete",
      "Payment is processed automatically",
    ],
  },
  {
    title: "Follow-up communication",
    icon: MessagesSquare,
    text: "You receive a follow-up message to:",
    bullets: [
      "Confirm everything is working correctly",
      "Provide any additional guidance or recommendations",
    ],
  },
  {
    title: "Customer feedback",
    icon: Star,
    text: "You're invited to leave a review or feedback about the service.",
  },
  {
    title: "Retention & loyalty",
    icon: Gift,
    text: "You receive a discount offer for your next session — because we're in this for the long term.",
  },
];
