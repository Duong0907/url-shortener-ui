import { Typography } from "@/components/ui/typography";

export function Footer() {
  return (
    <footer className="my-8 flex w-full flex-col items-center">
      <div className="mb-12 w-full max-w-138.75 border-t border-t-foreground" />
      <Typography>Shortener @ {new Date().getFullYear()}</Typography>
    </footer>
  );
}
