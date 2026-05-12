/**
 * Fade / lift sections into view; light fade when they leave the viewport (after first reveal).
 * Fellows mount via React — MutationObserver picks up `.reveal-on-scroll` inside `#fellows-root`.
 */

export function initSectionReveal(): void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      el.classList.add("is-revealed");
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const t = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          t.classList.add("is-revealed");
          t.dataset.hasRevealed = "true";
          t.classList.remove("is-reveal-out");
        } else if (t.dataset.hasRevealed === "true") {
          t.classList.add("is-reveal-out");
        }
      }
    },
    {
      root: null,
      rootMargin: "-5% 0px -10% 0px",
      threshold: 0.1,
    },
  );

  function observeAll(): void {
    document.querySelectorAll<HTMLElement>(".reveal-on-scroll").forEach((el) => {
      if (el.dataset.revealObserved === "true") return;
      el.dataset.revealObserved = "true";
      io.observe(el);
    });
  }

  observeAll();

  const fellowsHost = document.getElementById("fellows-root");
  if (fellowsHost) {
    new MutationObserver(() => observeAll()).observe(fellowsHost, { childList: true });
  }
}
