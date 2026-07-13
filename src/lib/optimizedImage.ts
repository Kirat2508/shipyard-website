import manifest from "../data/imageManifest.json";

export type OptimizedImageMeta = {
  src: string;
  srcSet: string;
  placeholder: string;
  widths: number[];
};

const images = manifest as Record<string, OptimizedImageMeta>;

/** Resolve optimized WebP src/srcSet/placeholder for an original /images/... path. */
export function getOptimizedImage(originalSrc: string): OptimizedImageMeta | null {
  return images[originalSrc] ?? null;
}

export const IMAGE_SIZES = {
  fellow: "(max-width: 639px) 44vw, (max-width: 1023px) 42vw, 280px",
  gallery: "(max-width: 639px) 46vw, (max-width: 1023px) 28vw, 220px",
  mentor: "(max-width: 639px) 36vw, (max-width: 1023px) 28vw, 200px",
  hero: "(max-width: 680px) 92vw, (min-width: 960px) min(680px, 46vw), 640px",
} as const;
