/**
 * Scroll-driven reveal: body copy goes from muted grey to full contrast;
 * inline highlights gain yellow as reading position moves through the section.
 */
export function initEditorialScroll(): void {
  const section = document.querySelector<HTMLElement>(".editorial-intro");
  if (!section) return;

  const blocks = section.querySelectorAll<HTMLElement>(".editorial-intro__block");
  const highlights = section.querySelectorAll<HTMLElement>(".editorial-intro__hl");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function smoothstep(t: number, edge0: number, edge1: number): number {
    if (t <= edge0) return 0;
    if (t >= edge1) return 1;
    const x = (t - edge0) / (edge1 - edge0);
    return x * x * (3 - 2 * x);
  }

  function update(): void {
    if (reduceMotion) {
      blocks.forEach((b) => b.style.setProperty("--lit", "1"));
      highlights.forEach((h) => h.style.setProperty("--hl-strength", "1"));
      return;
    }

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrollY = window.scrollY;
    const sectionTop = scrollY + rect.top;
    const sectionH = Math.max(rect.height, 1);
    const readLine = scrollY + vh * 0.34;
    const raw = (readLine - sectionTop) / (sectionH * 0.92);
    const p = Math.min(1, Math.max(0, raw));

    const n = blocks.length;
    blocks.forEach((block, i) => {
      const stagger = n > 1 ? i / (n - 1) : 0;
      const start = stagger * 0.5;
      const end = start + 0.42;
      block.style.setProperty("--lit", smoothstep(p, start, end).toFixed(4));
    });

    highlights.forEach((hl, i) => {
      const order = Number(hl.dataset.hlIndex ?? i);
      const nHl = highlights.length;
      const stagger = nHl > 1 ? order / Math.max(1, nHl - 1) : 0;
      const start = 0.12 + stagger * 0.52;
      const end = start + 0.34;
      hl.style.setProperty("--hl-strength", smoothstep(p, start, end).toFixed(4));
    });
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
