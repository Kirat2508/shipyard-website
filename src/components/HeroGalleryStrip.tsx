import { heroGallerySlides } from "../data/heroGallery";
import { IMAGE_SIZES } from "../lib/optimizedImage";
import { OptimizedImage } from "./OptimizedImage";

export function HeroGalleryStrip() {
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
                width={600}
                height={600}
                loading={index < 6 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
