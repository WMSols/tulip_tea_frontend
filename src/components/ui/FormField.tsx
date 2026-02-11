import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  optional?: boolean;
}

/**
 * Reusable form field wrapper with label and error message.
 * Shows a red error message below the field and turns the input border red when validation fails.
 */
export function FormField({
  label,
  error,
  children,
  htmlFor,
  className,
  optional = false,
}: FormFieldProps) {
  return (
    <div
      className={cn(
        "space-y-2",
        error &&
          "[&_input]:border-destructive [&_input]:focus-visible:ring-destructive [&_textarea]:border-destructive [&_textarea]:focus-visible:ring-destructive [&_[role=combobox]]:border-destructive [&_[role=combobox]]:focus:ring-destructive",
        className,
      )}
    >
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {optional && (
          <span className="text-muted-foreground font-normal ml-1">
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="text-[13px] text-destructive font-medium animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
