import { Typography } from "@/components/ui/typography";

// The heading of every signed-in page: left-aligned like the content below it.
export function SectionHeader({
  title,
  description,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-3">
      <Typography variant="display" className="@3xl:text-5xl">
        {title}
      </Typography>
      <Typography className="text-pretty text-muted-foreground">{description}</Typography>
    </header>
  );
}
