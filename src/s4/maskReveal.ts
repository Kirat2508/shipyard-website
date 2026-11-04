import { easing, prefersReducedMotion } from "../intro/motion";

const A = "polygon(70% 0%, 100% 0%, 100% 40%, 90% 100%, 60% 100%, 80% 40%)";
const B = "polygon(28% 0%, 62% 0%, 52% 48%, 70% 100%, 18% 100%, 36% 46%)";
const C = "polygon(0% 0%, 30% 0%, 22% 52%, 34% 100%, 0% 100%, 6% 50%)";

/**
 * MaskReveal: the giant SHIPYARD sits in marble-200 and shows in ink only where the
 * ember-tint shape passes over it. Drifts between three positions while on screen.
 * Markup: [data-sy-mask] containing .sy-mask__shape and .sy-mask__word--ink.
 */
export function initMaskReveal(): void {
  const box = document.querySelector<HTMLElement>("[data-sy-mask]");
  if (!box || prefersReducedMotion()) return;
  const targets = box.querySelectorAll<HTMLElement>(".sy-mask__shape, .sy-mask__word--ink");
  const keyframes = [{ clipPath: A }, { clipPath: B, offset: 0.45 }, { clipPath: C }];
  const timing: KeyframeAnimationOptions = {
    duration: 5200,
    iterations: Infinity,
    direction: "alternate",
    easing: easing("ease-snap", "ease-in-out"),
  };
  const anims = Array.from(targets, (t) => {
    const a = t.animate(keyframes, timing);
    a.pause();
    return a;
  });

  // Only run while visible.
  new IntersectionObserver((entries) => {
    const visible = entries.some((e) => e.isIntersecting);
    anims.forEach((a) => (visible ? a.play() : a.pause()));
  }).observe(box);
}
