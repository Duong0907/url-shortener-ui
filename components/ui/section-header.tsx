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
      <Typography variant="h1" className="mb-2 text-center">
        {title}
      </Typography>
      <Typography as="p" variant="h4" weight="light" className="mb-16 text-center">
        {description}
      </Typography>
    </div>
  );
}
