import { FormSheet } from "@/components/form-sheet";
import { Typography } from "@/components/ui/typography";

// Same composition as the home page: the heading and copy on the left, the form sheet on the
// right. A container query stacks them when the column is narrow.
export function AuthShell({
  title,
  sheet = "Account",
  aside,
  children,
}: {
  title: string;
  sheet?: string;
  aside: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="@container">
      <div className="grid items-start gap-10 @3xl:grid-cols-12 @3xl:gap-12">
        <div className="flex min-w-0 flex-col gap-4 @3xl:col-span-5 @3xl:pt-8">
          <Typography variant="display">{title}</Typography>
          {aside}
        </div>
        <FormSheet label={sheet} className="@3xl:col-span-7">
          <div className="flex flex-col gap-4 p-5">{children}</div>
        </FormSheet>
      </div>
    </div>
  );
}
