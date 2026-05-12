const SPRINT_SECTION_IDS = new Set(["sunday-1", "sunday-2", "sunday-3", "product-showcase"]);

/**
 * Highlights the Sunday nav link and panel that is closest to the viewport “reading line”.
 */
export function initSprintScrollspy(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>(".sprint-system__nav-link");
  const panels = document.querySelectorAll<HTMLElement>(".sprint-panel");
  if (!links.length || !panels.length) return;

  function setActive(id: string): void {
    links.forEach((link) => {
      const href = link.getAttribute("href");
      const targetId = href?.startsWith("#") ? href.slice(1) : "";
      const active = targetId === id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === id);
    });
  }

  function pickActive(): void {
    const vh = window.innerHeight;
    const marker = vh * 0.32;
    let chosen = panels[0]?.id ?? "";
    let anyAbove = false;

    panels.forEach((panel) => {
      const r = panel.getBoundingClientRect();
      if (r.top <= marker) {
        chosen = panel.id;
        anyAbove = true;
      }
    });

    if (!anyAbove) chosen = panels[0]?.id ?? chosen;

    if (chosen) setActive(chosen);
  }

  let raf = 0;
  function onScrollOrResize(): void {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(pickActive);
  }

  const hash = window.location.hash.slice(1);
  if (hash && SPRINT_SECTION_IDS.has(hash)) {
    setActive(hash);
    requestAnimationFrame(() => pickActive());
  } else {
    pickActive();
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
  window.addEventListener("hashchange", () => {
    const h = window.location.hash.slice(1);
    if (h && SPRINT_SECTION_IDS.has(h)) setActive(h);
  });
}
