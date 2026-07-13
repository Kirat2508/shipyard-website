import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FellowsSection } from "./components/FellowsSection";
import { HeroGalleryStrip } from "./components/HeroGalleryStrip";
import { MentorsSection } from "./components/MentorsSection";
import { initEditorialScroll } from "./editorialScroll";
import { initHeroGallery } from "./heroGallery";
import { initHeroVisualScroll } from "./heroVisualScroll";
import { initSectionReveal } from "./sectionReveal";
import { initSprintScrollspy } from "./sprintScrollspy";
import "./index.css";

function isMobileViewport(): boolean {
  return window.matchMedia("(max-width: 639px)").matches;
}

function deferOnMobile(mount: () => void): void {
  if (!isMobileViewport()) {
    mount();
    return;
  }

  const schedule =
    window.requestIdleCallback ??
    ((cb: IdleRequestCallback) =>
      window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 } as IdleDeadline), 250));

  schedule(mount, { timeout: 1800 });
}

const galleryRoot = document.getElementById("hero-gallery-root");
if (galleryRoot) {
  deferOnMobile(() => {
    createRoot(galleryRoot).render(
      <StrictMode>
        <HeroGalleryStrip />
      </StrictMode>,
    );
    queueMicrotask(() => initHeroGallery());
  });
} else {
  initHeroGallery();
}

initHeroVisualScroll();
initEditorialScroll();
initSprintScrollspy();

const fellowsRoot = document.getElementById("fellows-root");
if (fellowsRoot) {
  deferOnMobile(() => {
    createRoot(fellowsRoot).render(
      <StrictMode>
        <FellowsSection />
      </StrictMode>,
    );
  });
}

const mentorsRoot = document.getElementById("mentors-root");
if (mentorsRoot) {
  deferOnMobile(() => {
    createRoot(mentorsRoot).render(
      <StrictMode>
        <MentorsSection />
      </StrictMode>,
    );
  });
}

requestAnimationFrame(() => {
  requestAnimationFrame(() => initSectionReveal());
});
