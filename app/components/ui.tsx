import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Container({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cx("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

const buttonStyles = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "border border-line bg-white text-ink hover:border-ink/25 hover:bg-subtle",
  light: "bg-white text-brand hover:bg-brand-50",
  ghostLight: "border border-white/40 text-white hover:bg-white/10",
} as const;

export type ButtonVariant = keyof typeof buttonStyles;

export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
    buttonStyles[variant],
    className,
  );
}

export function ButtonLink({
  variant,
  className,
  arrow,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; arrow?: boolean }) {
  return (
    <Link className={buttonClass(variant, className)} {...props}>
      {children}
      {arrow ? <ArrowRight aria-hidden className="size-4" /> : null}
    </Link>
  );
}

/** Plain text link with an arrow, for low-emphasis actions. */
export function ArrowLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cx(
        "group inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-dark",
        className,
      )}
      {...props}
    >
      {children}
      <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-medium text-brand">{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={cx("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-2 text-3xl sm:text-4xl">{title}</h2>
      {intro ? <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p> : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-subtle">
      <Container className="py-16 sm:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-2 max-w-3xl text-4xl sm:text-5xl">{title}</h1>
        {intro ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>
        ) : null}
        {children}
      </Container>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="rounded-2xl bg-brand px-6 py-12 text-white sm:px-12 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl">Ready to get started?</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
                Whether you need immediate help or ongoing support, LDF Solutions makes
                technology simple and stress-free.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <ButtonLink to="/book" variant="light">
                Book a session
              </ButtonLink>
              <ButtonLink to="/report-issue" variant="ghostLight">
                Report an issue
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
