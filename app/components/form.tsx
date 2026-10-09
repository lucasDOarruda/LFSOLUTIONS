import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from "react";
import {
  ChevronDown,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Paperclip,
  Upload,
  X,
} from "lucide-react";
import {
  ATTACHMENTS,
  HONEYPOT_FIELD,
  fileExtension,
  formatBytes,
  type FormResult,
} from "~/lib/forms";
import { buttonClass, cx } from "./ui";

const controlClass =
  "block w-full rounded-lg border bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-muted/60 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15";

function controlState(error?: string) {
  return error ? "border-red-600" : "border-line hover:border-ink/25";
}

type FieldShellProps = {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: (a11y: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => ReactNode;
};

function FieldShell({ name, label, error, hint, optional, className, children }: FieldShellProps) {
  const id = `field-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-ink">
        {label}
        {optional ? <span className="text-xs font-normal text-muted">Optional</span> : null}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy || undefined })}
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700">
          <CircleAlert aria-hidden className="size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

type BaseProps = {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
};

export function TextField({
  name,
  label,
  error,
  hint,
  className,
  ...props
}: BaseProps & Omit<ComponentProps<"input">, "name">) {
  return (
    <FieldShell name={name} label={label} error={error} hint={hint} optional={!props.required} className={className}>
      {(a11y) => (
        <input name={name} className={cx(controlClass, controlState(error))} {...a11y} {...props} />
      )}
    </FieldShell>
  );
}

export function TextArea({
  name,
  label,
  error,
  hint,
  className,
  ...props
}: BaseProps & Omit<ComponentProps<"textarea">, "name">) {
  return (
    <FieldShell name={name} label={label} error={error} hint={hint} optional={!props.required} className={className}>
      {(a11y) => (
        <textarea
          name={name}
          rows={6}
          className={cx(controlClass, "resize-y", controlState(error))}
          {...a11y}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function SelectField({
  name,
  label,
  error,
  hint,
  className,
  options,
  placeholder = "Choose one…",
  ...props
}: BaseProps &
  Omit<ComponentProps<"select">, "name"> & {
    options: readonly string[];
    placeholder?: string;
  }) {
  return (
    <FieldShell name={name} label={label} error={error} hint={hint} optional={!props.required} className={className}>
      {(a11y) => (
        <div className="relative">
          <select
            name={name}
            className={cx(controlClass, "appearance-none pr-11", controlState(error))}
            defaultValue=""
            {...a11y}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted"
          />
        </div>
      )}
    </FieldShell>
  );
}

/** Hidden field bots tend to fill in; the server silently drops those submissions. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <CircleAlert aria-hidden className="size-5 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button type="submit" disabled={pending} className={buttonClass("primary", "w-full sm:w-auto sm:px-8")}>
      {pending ? (
        <>
          <LoaderCircle aria-hidden className="size-4 animate-spin" /> Sending…
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function SuccessPanel({
  title,
  reference,
  children,
  onReset,
  resetLabel = "Send another",
}: {
  title: string;
  reference: string;
  children: ReactNode;
  onReset: () => void;
  resetLabel?: string;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);
  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6 sm:p-8" role="status">
      <CircleCheck aria-hidden className="size-8 text-brand" />
      <h2 ref={headingRef} tabIndex={-1} className="mt-4 text-xl outline-none">
        {title}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted">{children}</div>
      <p className="mt-4 text-sm text-muted">
        Your reference: <strong className="font-semibold text-brand">{reference}</strong>
      </p>
      <button type="button" onClick={onReset} className={buttonClass("secondary", "mt-6")}>
        {resetLabel}
      </button>
    </div>
  );
}

/** Moves focus to the first invalid field after the server rejects a submission. */
export function useFocusFirstError(
  formRef: RefObject<HTMLFormElement | null>,
  result: FormResult | undefined,
) {
  useEffect(() => {
    if (!result || result.ok) return;
    const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    invalid?.focus();
  }, [result, formRef]);
}

// Phone photos are often 3–8 MB. Downscale them in the browser so a handful
// still fit within the upload limit.
const MAX_IMAGE_DIMENSION = 1920;

async function shrinkImage(file: File): Promise<File> {
  const resizable = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
  if (!resizable.includes(file.type) || file.size < 500 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: file.lastModified });
  } catch {
    // Browser can't decode it (e.g. HEIC outside Safari) — send the original.
    return file;
  }
}

export function AttachmentField({ error }: { error?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [localError, setLocalError] = useState<string>();

  const id = `field-${ATTACHMENTS.field}`;
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  const shownError = localError ?? error;

  function sync(next: File[]) {
    const transfer = new DataTransfer();
    next.forEach((f) => transfer.items.add(f));
    if (inputRef.current) inputRef.current.files = transfer.files;
    setFiles(next);
  }

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []);
    if (!picked.length) {
      // The picker was cancelled, which clears the input; restore the existing list.
      sync(files);
      return;
    }
    setProcessing(true);
    setLocalError(undefined);

    const accepted: File[] = [];
    for (const file of picked) {
      if (!(ATTACHMENTS.extensions as readonly string[]).includes(fileExtension(file.name))) {
        setLocalError(`“${file.name}” isn't supported. Please attach photos or PDFs.`);
        continue;
      }
      accepted.push(await shrinkImage(file));
    }

    let next = [...files, ...accepted];
    if (next.length > ATTACHMENTS.maxFiles) {
      next = next.slice(0, ATTACHMENTS.maxFiles);
      setLocalError(`You can attach up to ${ATTACHMENTS.maxFiles} files.`);
    }
    while (next.reduce((s, f) => s + f.size, 0) > ATTACHMENTS.maxTotalBytes) {
      const dropped = next.pop()!;
      setLocalError(
        `“${dropped.name}” would take you over the ${formatBytes(ATTACHMENTS.maxTotalBytes)} limit.`,
      );
    }
    sync(next);
    setProcessing(false);
  }

  function remove(index: number) {
    setLocalError(undefined);
    sync(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <p className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-ink">
        Photos or screenshots
        <span className="text-xs font-normal text-muted">Optional</span>
      </p>
      <label
        htmlFor={id}
        className={cx(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-white px-4 py-8 text-center transition-colors hover:border-brand hover:bg-brand-50/50 has-[:focus-visible]:border-brand has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/15",
          shownError ? "border-red-600" : "border-line",
        )}
      >
        {processing ? (
          <LoaderCircle aria-hidden className="size-7 animate-spin text-brand" />
        ) : (
          <Upload aria-hidden className="size-7 text-brand" />
        )}
        <span className="font-semibold text-ink">
          {processing ? "Preparing files…" : "Add photos, screenshots or PDFs"}
        </span>
        <span className="text-sm text-muted">
          Up to {ATTACHMENTS.maxFiles} files, {formatBytes(ATTACHMENTS.maxTotalBytes)} total. Large photos are resized automatically.
        </span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          name={ATTACHMENTS.field}
          multiple
          accept={ATTACHMENTS.accept}
          onChange={onChange}
          aria-invalid={Boolean(shownError)}
          aria-describedby={shownError ? `${id}-error` : undefined}
          className="sr-only"
        />
      </label>

      {files.length ? (
        <ul className="mt-3 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-2 text-sm"
            >
              <Paperclip aria-hidden className="size-4 shrink-0 text-muted" />
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <span className="shrink-0 text-muted">{formatBytes(file.size)}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-subtle hover:text-ink"
              >
                <X aria-hidden className="size-4" />
                <span className="sr-only">Remove {file.name}</span>
              </button>
            </li>
          ))}
          <li className="px-1 text-xs text-muted">
            {formatBytes(totalBytes)} of {formatBytes(ATTACHMENTS.maxTotalBytes)} used
          </li>
        </ul>
      ) : null}

      {shownError ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700">
          <CircleAlert aria-hidden className="size-4 shrink-0" />
          {shownError}
        </p>
      ) : null}
    </div>
  );
}
