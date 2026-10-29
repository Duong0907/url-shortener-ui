"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Drawer } from "@base-ui/react/drawer";
import { cn } from "cn";
import { ChevronLeft, Menu } from "lucide-react";

import { SidebarNav, wordmark } from "@/components/app-shell/sidebar-nav";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";

// Sidebar from md up. Below md, a top bar whose menu button opens the same nav as a drawer.
export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  // ponytail: not remembered across reloads; store it in a cookie if people ask for that.
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh text-foreground">
      {/* The wrapper is not clipped, so the toggle can sit on the sidebar's edge rule. */}
      <div className="sticky top-0 hidden h-dvh shrink-0 md:block">
        <aside
          className={cn(
            "h-full overflow-hidden border-r border-border transition-[width] duration-300 ease-out motion-reduce:transition-none",
            collapsed ? "w-16" : "w-52",
          )}
        >
          <SidebarNav collapsed={collapsed} />
        </aside>
        <Button
          variant="outline"
          size="icon-xs"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((c) => !c)}
          className="absolute top-[2.85rem] -right-3 z-10 size-6 rounded-full border-border bg-background text-muted-foreground shadow-[0_1px_2px_rgb(0_0_0/8%)] hover:bg-background hover:text-foreground aria-expanded:bg-background"
        >
          <ChevronLeft
            className={cn(
              "transition-transform duration-300 motion-reduce:transition-none",
              collapsed && "rotate-180",
            )}
            aria-hidden
          />
        </Button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Wordmark on the left like the public nav; the menu sits right, within thumb reach. */}
        <header className="flex min-h-14.25 items-center justify-between gap-3 border-b border-border px-4 md:hidden">
          <span className={wordmark}>SHORTENER</span>
          <div className="flex items-center gap-2">
            <ThemeSwitch />
            <Drawer.Root open={open} onOpenChange={setOpen} swipeDirection="right">
              <Drawer.Trigger
                render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
              >
                <Menu />
              </Drawer.Trigger>

              <Drawer.Portal>
                <Drawer.Backdrop className="fixed inset-0 bg-black/10 backdrop-blur-xs transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
                {/* The viewport enables swipe-to-close and touch scroll locking. */}
                <Drawer.Viewport className="fixed inset-0">
                  <Drawer.Popup className="fixed inset-y-0 right-0 w-72 translate-x-(--drawer-swipe-movement-x) border-l border-border bg-background transition-transform data-ending-style:translate-x-full data-starting-style:translate-x-full data-swiping:transition-none motion-reduce:transition-none">
                    <Drawer.Title className="sr-only">Menu</Drawer.Title>
                    <SidebarNav onNavigate={() => setOpen(false)} />
                  </Drawer.Popup>
                </Drawer.Viewport>
              </Drawer.Portal>
            </Drawer.Root>
          </div>
        </header>

        {/* Keyed by route, so each page fades up as the sidebar sheet slides to it. */}
        <main
          key={pathname}
          className="mx-auto w-full max-w-250 px-4 py-10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300 md:px-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
