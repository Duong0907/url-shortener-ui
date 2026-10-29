import { Typography } from "@/components/ui/typography";

export function SectionHeader({
  title,
  description,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <div>
      <Typography variant="display" className="mb-3 text-center @3xl:text-5xl">
        {title}
      </Typography>
      <Typography as="p" className="mb-16 text-center text-lg text-muted-foreground">
        {description}
      </Typography>
    </div>
  );
}
