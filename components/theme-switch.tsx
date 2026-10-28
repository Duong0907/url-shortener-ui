"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

import { Switch } from "@/components/ui/switch";
import { withViewTransition } from "@/lib/utils";

const subscribe = () => () => {};

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const handleCheckedChange = (dark: boolean) =>
    withViewTransition(() => flushSync(() => setTheme(dark ? "dark" : "light")));

  return (
    <Switch
      size="xl"
      aria-label="Dark mode"
      checked={hydrated && resolvedTheme === "dark"}
      onCheckedChange={handleCheckedChange}
      iconOn={<Moon className="size-5" />}
      iconOff={<Sun className="size-5" />}
    />
  );
}
