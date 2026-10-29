import { Typography } from "@/components/ui/typography";

// Form-level (server) error. children render below the message, e.g. a follow-up action.
export function FormError({
  error,
  children,
}: {
  error: Error | string | null;
  children?: React.ReactNode;
}) {
  if (!error) return null;

  return (
    <div className="flex flex-col gap-2">
      <Typography role="alert" className="text-sm text-destructive">
        {typeof error === "string" ? error : error.message}
      </Typography>
      {children}
    </div>
  );
}
