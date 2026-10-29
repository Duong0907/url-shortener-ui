import { Typography } from "@/components/ui/typography";

export function Footer() {
  return (
    <footer className="my-8 flex w-full flex-col items-center">
      <div className="mb-8 w-full max-w-250 border-t border-border" />
      <Typography className="text-sm text-muted-foreground">
        Shortener @ {new Date().getFullYear()}
      </Typography>
    </footer>
  );
}
