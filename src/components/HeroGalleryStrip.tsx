import { heroGallerySlides } from "../data/heroGallery";
import { IMAGE_SIZES } from "../lib/optimizedImage";
import { OptimizedImage } from "./OptimizedImage";

const MOBILE_EAGER_COUNT = 2;
const DESKTOP_EAGER_COUNT = 4;

function eagerCountForViewport(): number {
  if (typeof window === "undefined") return MOBILE_EAGER_COUNT;
  return window.matchMedia("(max-width: 639px)").matches
    ? MOBILE_EAGER_COUNT
    : DESKTOP_EAGER_COUNT;
}

export function HeroGalleryStrip() {
  const eagerCount = eagerCountForViewport();

  return (
    <div className="hero-gallery__strip" data-hero-marquee-strip>
      {heroGallerySlides.map((slide, index) => (
        <div key={slide.src} className="hero-gallery__slide">
          <div className="hero-gallery__card">
            <div className="hero-gallery__parallax" data-hero-gallery-parallax>
              <OptimizedImage
                originalSrc={slide.src}
                alt={slide.alt}
                className="hero-gallery__img"
                wrapperClassName="hero-gallery__img-wrap"
                sizes={IMAGE_SIZES.gallery}
                width={480}
                height={480}
                loading={index < eagerCount ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index < eagerCount ? "auto" : "low"}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
