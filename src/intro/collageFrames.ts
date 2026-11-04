import { heroGallerySlides } from "../data/heroGallery";
import { getOptimizedImage } from "../lib/optimizedImage";
import type { CollageFrame } from "./PhotoCollage";

/** How many gallery photos pile into the intro collage. */
export const COLLAGE_FRAME_COUNT = 30;

/** Gallery originals too small to show sharp in the collage. */
const LOW_RES = new Set(["/images/gallery/vivek-bhuva.jpeg"]);

function slug(src: string): string {
  const base = src.slice(src.lastIndexOf("/") + 1).replace(/\.[^.]+$/, "");
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** Largest existing gallery WebP from the manifest (480w), for phones. */
function manifestLargest(src: string): string {
  const opt = getOptimizedImage(src);
  if (!opt) return src;
  const last = opt.srcSet.split(",").pop()?.trim().split(/\s+/)[0];
  return last ?? opt.src;
}

/**
 * Shipyard gallery photos (S1 + S2) for the collage. Desktop gets the 900px HD copies in
 * /images/s4/collage/ (made from the originals); phones get the existing 480w WebP.
 */
export function collageFrames(): CollageFrame[] {
  const phone = window.matchMedia("(max-width: 639px)").matches;
  return heroGallerySlides
    .filter((slide) => !LOW_RES.has(slide.src))
    .slice(0, COLLAGE_FRAME_COUNT)
    .map((slide) => ({
      src: phone ? manifestLargest(slide.src) : `/images/s4/collage/${slug(slide.src)}-900.webp`,
      alt: slide.alt,
    }));
}
