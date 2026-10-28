import { Typography } from "@/components/ui/typography";

// Auth layout from the design system: title and copy on the left, the form on the right.
export function AuthShell({
  title,
  aside,
  children,
}: {
  title: string;
  aside: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
      <div className="flex flex-col gap-3">
        <Typography as="h1" variant="h3">
          {title}
        </Typography>
        {aside}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
