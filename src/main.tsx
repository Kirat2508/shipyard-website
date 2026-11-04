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
import { initWordmarkOnView } from "./intro/WordmarkDrop";
import { initHeroParallax, playHeroEntrance } from "./s4/hero";
import { initKineticHeadlines } from "./s4/kineticHeadline";
import { initMaskReveal } from "./s4/maskReveal";
import "./index.css";

const HERO_IMAGE_FALLBACK = "/images/s4/hero-garden-1280.webp";

/* S IV opening sequence: loaded as its own chunk, only when the head script flagged this visit. */
if (document.documentElement.classList.contains("intro-pending")) {
  const hero = document.querySelector<HTMLElement>("[data-sy-hero]");
  if (hero) {
    void Promise.all([import("./intro/IntroSequence"), import("./intro/collageFrames")]).then(
      ([{ runIntro }, { collageFrames }]) =>
        runIntro({
          frames: collageFrames(),
          hero,
          heroImageSrc: hero.querySelector<HTMLImageElement>(".sy-hero__bg img")?.currentSrc || HERO_IMAGE_FALLBACK,
          onHeroOpen: playHeroEntrance,
        }),
    ).catch(() => document.documentElement.classList.remove("intro-pending"));
  } else {
    document.documentElement.classList.remove("intro-pending");
  }
}

initHeroParallax();
initKineticHeadlines();
initMaskReveal();

const footerMark = document.querySelector<HTMLElement>("[data-sy-wordmark]");
if (footerMark) initWordmarkOnView(footerMark);

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
