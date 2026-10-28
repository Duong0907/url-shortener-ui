export { cn } from "cn";

// Crossfade a DOM change with the View Transitions API; instant when unsupported or reduced motion.
export function withViewTransition(update: () => void) {
  if (
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return;
  }

  document.startViewTransition(update);
}
