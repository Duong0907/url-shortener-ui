"use client";

import { useState } from "react";
import { Drawer } from "@base-ui/react/drawer";
import { Menu } from "lucide-react";

import { SidebarNav } from "@/components/app-shell/sidebar-nav";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

// Sidebar from md up. Below md, a top bar whose menu button opens the same nav as a drawer.
export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh text-foreground">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 border-r border-border md:block">
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-14.25 items-center justify-between gap-3 border-b border-border px-4 md:hidden">
          <Drawer.Root open={open} onOpenChange={setOpen} swipeDirection="left">
            <Drawer.Trigger render={<Button variant="ghost" size="icon" aria-label="Open menu" />}>
              <Menu />
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Backdrop className="fixed inset-0 bg-black/10 backdrop-blur-xs transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
              {/* The viewport enables swipe-to-close and touch scroll locking. */}
              <Drawer.Viewport className="fixed inset-0">
                <Drawer.Popup className="fixed inset-y-0 left-0 w-72 translate-x-(--drawer-swipe-movement-x) border-r border-border bg-background transition-transform data-ending-style:-translate-x-full data-starting-style:-translate-x-full data-swiping:transition-none motion-reduce:transition-none">
                  <Drawer.Title className="sr-only">Menu</Drawer.Title>
                  <SidebarNav onNavigate={() => setOpen(false)} />
                </Drawer.Popup>
              </Drawer.Viewport>
            </Drawer.Portal>
          </Drawer.Root>

          <Typography as="span" variant="h4" weight="bold">
            SHORTENER
          </Typography>
          <ThemeSwitch />
        </header>

        <main className="mx-auto w-full max-w-250 px-4 py-10 md:px-10">{children}</main>
      </div>
    </div>
  );
}
