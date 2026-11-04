import { easing, prefersReducedMotion, tokenMs } from "../intro/motion";

/** Soft pointer parallax on the hero background image. */
export function initHeroParallax(): void {
  const hero = document.querySelector<HTMLElement>("[data-sy-hero]");
  const art = hero?.querySelector<HTMLElement>(".sy-hero__bg img");
  if (!hero || !art || prefersReducedMotion()) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  let raf = 0;
  hero.addEventListener("pointermove", (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      art.style.translate = `${(-x * 18).toFixed(2)}px ${(-y * 10).toFixed(2)}px`;
    });
  });
  hero.addEventListener("pointerleave", () => {
    cancelAnimationFrame(raf);
    art.style.translate = "";
  });
}

/** Staggers the hero copy in. Only used after the intro, so it never delays LCP on repeat visits. */
export function playHeroEntrance(): void {
  const copy = document.querySelector<HTMLElement>("[data-sy-hero] .sy-hero__copy");
  if (!copy || prefersReducedMotion()) return;
  Array.from(copy.children).forEach((child, i) => {
    child.animate(
      [
        { opacity: 0, transform: "translateY(18px)" },
        { opacity: 1, transform: "none" },
      ],
      {
        duration: tokenMs("dur-base", 480),
        delay: 300 + i * 90,
        easing: easing("ease-land", "ease-out"),
        fill: "backwards",
      },
    );
  });
}
