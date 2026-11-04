import { heroGallerySlides } from "../data/heroGallery";
import { getOptimizedImage } from "../lib/optimizedImage";
import type { CollageFrame } from "./PhotoCollage";

/** How many gallery photos pile into the intro collage. */
export const COLLAGE_FRAME_COUNT = 30;

/** Picks the existing gallery WebP closest to `width` from the image manifest. */
function variantFor(src: string, width: number): string {
  const opt = getOptimizedImage(src);
  if (!opt) return src;
  const candidates = opt.srcSet.split(",").map((entry) => {
    const [url, w] = entry.trim().split(/\s+/);
    return { url, w: parseInt(w, 10) };
  });
  const fit = candidates.find((c) => c.w >= width) ?? candidates[candidates.length - 1];
  return fit.url;
}

/** Shipyard gallery photos (S1 + S2) for the collage, sized for the viewport. */
export function collageFrames(): CollageFrame[] {
  const width = window.matchMedia("(max-width: 639px)").matches ? 180 : 300;
  return heroGallerySlides.slice(0, COLLAGE_FRAME_COUNT).map((slide) => ({
    src: variantFor(slide.src, width),
    alt: slide.alt,
  }));
}
