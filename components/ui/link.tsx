import NextLink from "next/link";
import { cn } from "cn";

function Link({ className, ...props }: React.ComponentProps<typeof NextLink>) {
  return (
    <NextLink
      data-slot="link"
      className={cn("text-primary underline-offset-4 hover:underline", className)}
      {...props}
    />
  );
}

export { Link };
