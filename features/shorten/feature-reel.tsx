"use client";

import { useState } from "react";
import { cn } from "cn";

import { fieldLabel } from "@/components/form/text-field";

const SCENE_MS = 4400;

// One tab and one short scene per feature. A new feature adds an entry here; its scene uses the
// reel-* animation classes from globals.css, which play once while the scene is on.
const features = [
  { id: "shorten", name: "Shorten", scene: <ShortenScene /> },
  { id: "custom", name: "Custom link", scene: <CustomScene /> },
  { id: "links", name: "My links", scene: <LinksScene /> },
];

// A looping demo of what the product does, for the wide hero. Hover or focus pauses it, a tab
// jumps to its scene, and without motion each scene rests on its final frame.
export function FeatureReel({ className }: { className?: string }) {
  const [current, setCurrent] = useState(0);
  // Bumped on every switch, so picking the playing tab again restarts its scene.
  const [run, setRun] = useState(0);
  const [paused, setPaused] = useState(false);

  function show(i: number) {
    setCurrent(i);
    setRun((n) => n + 1);
  }

  return (
    <div
      className={cn(
        "max-w-md flex-col gap-4 rounded-xl border border-border bg-card px-5 pt-4 pb-5 shadow-[0_1px_2px_rgb(16_24_40/5%)]",
        className,
      )}
      style={{ "--reel-ms": `${SCENE_MS}ms` } as React.CSSProperties}
      data-reel-paused={paused}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex gap-4" role="group" aria-label="Features">
        {features.map((feature, i) => (
          <button
            key={feature.id}
            type="button"
            aria-pressed={i === current}
            // "Shorten demo", so the tab never shares a name with the form's Shorten button.
            aria-label={`${feature.name} demo`}
            onClick={() => show(i)}
            className={cn(
              fieldLabel,
              "relative min-w-0 flex-1 cursor-pointer truncate pb-2.5 text-left text-muted-foreground outline-none hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring",
              i === current && "text-foreground",
            )}
          >
            {feature.name}
            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-border" />
            {i === current ? (
              <span
                key={run}
                className="reel-progress absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-highlight"
                onAnimationEnd={() => show((current + 1) % features.length)}
              />
            ) : (
              i < current && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary/40" />
              )
            )}
          </button>
        ))}
      </div>

      {/* Fixed height, so switching scenes never moves the headline above it. */}
      <div className="relative h-40" aria-hidden>
        {features.map((feature, i) => (
          <div
            key={i === current ? `${feature.id}-${run}` : feature.id}
            data-reel-active={i === current}
            className={cn(
              "absolute inset-0 flex flex-col gap-2.5 transition-[opacity,translate] duration-300 ease-out",
              i === current ? "opacity-100" : "pointer-events-none translate-y-1.5 opacity-0",
            )}
          >
            {feature.scene}
          </div>
        ))}
      </div>
    </div>
  );
}

// Example links only: the demo shows paths, since the short host comes from the backend.

function ShortenScene() {
  return (
    <>
      <span className={fieldLabel}>Long URL</span>
      <div className="overflow-hidden rounded-lg border border-input bg-card px-3 py-2 text-sm text-muted-foreground">
        <span className="reel-type block truncate">
          https://www.example-shop.com/collections/summer-2026/linen-shirts?utm_source=newsletter
        </span>
      </div>
      <Feed />
      <div className="flex min-h-12 items-center gap-3.5">
        <Tape slug="k7Qp2x" />
        <span className="reel-stamp -rotate-6 rounded-md bg-success px-2 py-0.5 text-xs font-medium text-success-foreground">
          Copied
        </span>
      </div>
    </>
  );
}

function CustomScene() {
  return (
    <>
      <span className={fieldLabel}>Your own link name</span>
      <div className="rounded-lg border border-input bg-card px-3 py-2 text-sm">
        <span className="text-muted-foreground">/</span>
        <span className="reel-type-late inline-block">rsvp-june</span>
      </div>
      <Feed />
      <div className="flex min-h-12 items-center">
        <Tape slug="rsvp-june" />
      </div>
    </>
  );
}

const rows = [
  { slug: "rsvp-june", date: "31 Oct", fresh: true },
  { slug: "menu-fall", date: "28 Oct", fresh: false },
  { slug: "k7Qp2x", date: "24 Oct", fresh: false },
];

function LinksScene() {
  return (
    <>
      <span className={fieldLabel}>Every link, kept</span>
      <div className="flex flex-col overflow-hidden rounded-md border border-border bg-card">
        {rows.map((row) => (
          <div
            key={row.slug}
            className={cn(
              "grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-3 py-2 text-sm not-first:border-t not-first:border-border",
              row.fresh ? "reel-row-in" : "reel-row-shift",
            )}
          >
            <span className="truncate font-semibold text-primary">
              <span className="font-normal text-muted-foreground">/</span>
              {row.slug}
            </span>
            <span className="text-muted-foreground tabular-nums">{row.date}</span>
            <span className="size-1.5 rounded-full bg-success" />
          </div>
        ))}
      </div>
    </>
  );
}

// The dotted feed between the input and the strip, with a dot that runs down it.
function Feed() {
  return (
    <div className="relative ml-4 h-6 w-0.5 bg-[repeating-linear-gradient(to_bottom,var(--input)_0_4px,transparent_4px_8px)]">
      <span className="reel-feed absolute top-0 -left-[3px] size-2 rounded-full bg-highlight opacity-0" />
    </div>
  );
}

function Tape({ slug }: { slug: string }) {
  return (
    <span className="reel-print inline-block rounded-lg bg-tape px-3.5 py-1.5 text-lg font-semibold text-tape-foreground">
      <span className="opacity-60">/</span>
      {slug}
    </span>
  );
}
