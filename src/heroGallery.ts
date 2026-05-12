/**
 * Hero highlights: infinite marquee via duplicated strip + CSS animation.
 * Replaces Embla here — carousel loop logic was producing a false “dead band” between tiles.
 */

function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

const MARQUEE_PX_PER_SEC = 52;

function readStripGapPx(strip: HTMLElement): number {
  const px = parseFloat(getComputedStyle(strip).gap);
  return Number.isFinite(px) && px > 0 ? px : 12;
}

function colsForViewport(): number {
  if (window.matchMedia("(max-width: 639px)").matches) return 2;
  if (window.matchMedia("(max-width: 1023px)").matches) return 3;
  return 4;
}

function syncHeroGalleryMetrics(viewport: HTMLElement, strip: HTMLElement, track: HTMLElement): void {
  const cs = getComputedStyle(viewport);
  const pl = parseFloat(cs.paddingLeft) || 0;
  const pr = parseFloat(cs.paddingRight) || 0;
  const inner = Math.max(0, viewport.clientWidth - pl - pr);
  const gapPx = readStripGapPx(strip);
  const cols = colsForViewport();
  const slideW = Math.max(96, (inner - (cols - 1) * gapPx) / cols);
  viewport.style.setProperty("--hg-slide-w", `${slideW}px`);

  void track.offsetHeight;
  const stripW = strip.getBoundingClientRect().width;
  const sec = Math.max(28, stripW / MARQUEE_PX_PER_SEC);
  track.style.setProperty("--hero-gallery-marquee-duration", `${sec}s`);
}

export function initHeroGallery(): void {
  const viewport = document.querySelector<HTMLElement>("[data-hero-marquee-viewport]");
  const track = document.querySelector<HTMLElement>("[data-hero-marquee-track]");
  const strip = document.querySelector<HTMLElement>("[data-hero-marquee-strip]");
  if (!viewport || !track || !strip) return;

  const clone = strip.cloneNode(true) as HTMLElement;
  clone.removeAttribute("data-hero-marquee-strip");
  clone.removeAttribute("id");
  clone.setAttribute("aria-hidden", "true");
  clone.classList.add("hero-gallery__strip--clone");
  clone.querySelectorAll("img").forEach((img) => {
    img.removeAttribute("loading");
  });
  track.appendChild(clone);

  const section = viewport.closest<HTMLElement>(".hero-gallery");

  let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const applyMetrics = () => {
    syncHeroGalleryMetrics(viewport, strip, track);
  };

  applyMetrics();

  const ro = new ResizeObserver(() => applyMetrics());
  ro.observe(viewport);

  window.matchMedia("(max-width: 639px)").addEventListener("change", applyMetrics);
  window.matchMedia("(max-width: 1023px)").addEventListener("change", applyMetrics);

  let sectionScrollRaf = 0;
  const clearSectionScrollStyles = () => {
    if (!section) return;
    section.style.opacity = "";
    section.style.transform = "";
  };

  const updateSectionScroll = () => {
    if (!section || reduceMotion) {
      clearSectionScrollStyles();
      return;
    }

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    const enterVisibleTop = vh * 0.36;
    const enterHiddenTop = vh * 0.94;
    let tIn = 1;
    if (rect.top > enterVisibleTop) {
      tIn = smoothstep((enterHiddenTop - rect.top) / (enterHiddenTop - enterVisibleTop));
    }

    const exitBand = vh * 0.5;
    let tOut = 1;
    if (rect.bottom < exitBand) {
      tOut = smoothstep(rect.bottom / exitBand);
    }

    const opacity = Math.max(0, Math.min(1, tIn * tOut));
    const yEnter = (1 - tIn) * 44;
    const yExit = rect.bottom < exitBand ? (1 - tOut) * -40 : 0;

    section.style.opacity = opacity.toFixed(4);
    section.style.transform = `translate3d(0, ${(yEnter + yExit).toFixed(2)}px, 0)`;
  };

  const onWindowScroll = () => {
    cancelAnimationFrame(sectionScrollRaf);
    sectionScrollRaf = requestAnimationFrame(updateSectionScroll);
  };

  if (section) {
    updateSectionScroll();
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    window.addEventListener("resize", onWindowScroll);
  }

  const onReducedMotionChange = () => {
    const next = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (next === reduceMotion) return;
    reduceMotion = next;
    cancelAnimationFrame(sectionScrollRaf);
    clearSectionScrollStyles();
    applyMetrics();
    if (!reduceMotion) updateSectionScroll();
  };
  window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .addEventListener("change", onReducedMotionChange);
}
