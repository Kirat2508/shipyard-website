/**
 * Primary hero image (between hero copy and gallery):
 * — Visible on first paint when the block is on (or nearly on) screen, slightly scaled down.
 * — Opens (scale + lift) as the user scrolls down.
 * — Shrinks and hands off toward the gallery as that section approaches.
 */
export function initHeroVisualScroll(): void {
  const inner = document.querySelector<HTMLElement>("[data-hero-primary-inner]");
  const primarySection = document.querySelector<HTMLElement>("[data-hero-primary]");
  const gallerySection = document.querySelector<HTMLElement>(".hero-gallery");
  if (!inner || !primarySection) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function smoothstep(t: number): number {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
  }

  function update(): void {
    if (reduceMotion) {
      inner.style.transform = "";
      inner.style.opacity = "";
      return;
    }

    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const primaryRect = primarySection.getBoundingClientRect();

    /* How much of the photo block is “eligible” to show (below fold → 0→1 ramp). */
    const revealBand = Math.max(64, vh * 0.16);
    let visibilityFade = 1;
    if (primaryRect.bottom <= 0) {
      visibilityFade = 0;
    } else if (primaryRect.top >= vh) {
      visibilityFade = smoothstep((vh + revealBand - primaryRect.top) / Math.max(1, revealBand));
    }

    /* Scroll-driven “open”: from first scroll down, scale up and move into final position. */
    const openRange = Math.max(1, vh * 0.36);
    const scrollOpen = smoothstep(scrollY / openRange);

    let op = visibilityFade;
    /* Start a bit lower and smaller; scrolling “opens” the image. */
    let ty = (1 - scrollOpen) * 28;
    let scale = 0.86 + 0.14 * scrollOpen;

    /* Fade + shrink as the block scrolls up toward the top of the viewport */
    const topFadeBand = vh * 0.42;
    if (primaryRect.bottom > 0 && primaryRect.bottom < topFadeBand) {
      const t = Math.max(0, primaryRect.bottom / topFadeBand);
      op *= t;
      scale *= 0.78 + 0.22 * t;
    }

    /* Hand off to gallery: shrink further and drift down toward the next section */
    if (gallerySection) {
      const gr = gallerySection.getBoundingClientRect();
      const handoffHigh = vh * 0.92;
      const handoffLow = vh * 0.28;
      if (gr.top < handoffHigh) {
        const u =
          gr.top <= handoffLow ? 1 : smoothstep((handoffHigh - gr.top) / (handoffHigh - handoffLow));
        op *= 1 - 0.94 * u;
        scale *= 1 - 0.42 * u;
        ty += 64 * u;
      }
    }

    inner.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    inner.style.opacity = op.toFixed(4);
  }

  let raf = 0;
  function onScrollOrResize(): void {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  }

  update();
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
}
