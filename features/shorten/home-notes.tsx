import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

// The order is the point of this list, so the steps keep their numbers.
const steps = [
  { title: "Paste", text: "Drop in any http or https link. No account needed." },
  { title: "Shorten", text: "Press Shorten. The short link appears on the form." },
  { title: "Share", text: "Copy it and send it anywhere a long link won't fit." },
];

const extras = [
  {
    title: "Custom links",
    text: "Choose your own ending: 3 to 32 letters, numbers, -\u00a0or\u00a0_.",
  },
  { title: "My links", text: "Every link you make, newest first, in one list." },
];

export function HomeNotes() {
  return (
    <div className="@container flex flex-col gap-20">
      <section aria-labelledby="how-it-works" className="flex flex-col gap-8">
        <Typography id="how-it-works" variant="title">
          How it works
        </Typography>
        <ol className="grid border-t border-dashed border-input @2xl:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-2 border-b border-dashed border-input py-5 @2xl:border-b-0 @2xl:not-last:border-r @2xl:not-first:pl-6 @2xl:not-last:pr-6"
            >
              <span className="font-mono text-sm text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Typography variant="heading">{step.title}</Typography>
              <Typography className="text-pretty text-muted-foreground">{step.text}</Typography>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="with-an-account"
        className="grid items-start gap-8 @3xl:grid-cols-12 @3xl:gap-12"
      >
        <div className="flex flex-col gap-4 @3xl:col-span-5">
          <Typography id="with-an-account" variant="title">
            With an account
          </Typography>
          <Typography className="text-pretty text-muted-foreground">
            Optional. Shortening stays free and open without one.
          </Typography>
        </div>
        <div className="flex flex-col gap-6 @3xl:col-span-7">
          <dl className="flex flex-col border-t border-border">
            {extras.map((extra) => (
              <div
                key={extra.title}
                className="flex flex-col gap-1 border-b border-border py-4 @md:flex-row @md:gap-6"
              >
                <dt className="font-display text-sm font-semibold tracking-[0.16em] uppercase @md:w-40 @md:shrink-0">
                  {extra.title}
                </dt>
                <dd className="text-pretty text-muted-foreground">{extra.text}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/register"
            className={buttonVariants({ variant: "outline", className: "self-start" })}
          >
            Create an account
          </Link>
        </div>
      </section>
    </div>
  );
}
