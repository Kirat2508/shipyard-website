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

const galleryRoot = document.getElementById("hero-gallery-root");
if (galleryRoot) {
  createRoot(galleryRoot).render(
    <StrictMode>
      <HeroGalleryStrip />
    </StrictMode>,
  );
  queueMicrotask(() => initHeroGallery());
} else {
  initHeroGallery();
}

initHeroVisualScroll();
initEditorialScroll();
initSprintScrollspy();

const fellowsRoot = document.getElementById("fellows-root");
if (fellowsRoot) {
  createRoot(fellowsRoot).render(
    <StrictMode>
      <FellowsSection />
    </StrictMode>,
  );
}

const mentorsRoot = document.getElementById("mentors-root");
if (mentorsRoot) {
  createRoot(mentorsRoot).render(
    <StrictMode>
      <MentorsSection />
    </StrictMode>,
  );
}

requestAnimationFrame(() => {
  requestAnimationFrame(() => initSectionReveal());
});
