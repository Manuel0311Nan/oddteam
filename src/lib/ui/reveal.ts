/**
 * Bring freshly generated results into view after a button press.
 * Scrolls only when the target is not already near the top of the screen
 * (on desktop the team already sits next to the options), respects reduced motion,
 * and moves focus without a second scroll so screen readers land on it.
 */
export function revealResults(target: HTMLElement | null): void {
  if (!target) return;
  const top = target.getBoundingClientRect().top;
  const visible = top >= 0 && top <= window.innerHeight * 0.6;
  if (!visible) {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  target.focus({ preventScroll: true });
}
