import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FellowsSection } from "./components/FellowsSection";
import { initEditorialScroll } from "./editorialScroll";
import { initHeroGallery } from "./heroGallery";
import { initHeroVisualScroll } from "./heroVisualScroll";
import { initSectionReveal } from "./sectionReveal";
import { initSprintScrollspy } from "./sprintScrollspy";
import "./index.css";

initHeroGallery();
initHeroVisualScroll();
initEditorialScroll();
initSprintScrollspy();

const rootEl = document.getElementById("fellows-root");
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <FellowsSection />
    </StrictMode>,
  );
}

requestAnimationFrame(() => {
  requestAnimationFrame(() => initSectionReveal());
});
