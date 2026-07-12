import { heroGallerySlides } from "../data/heroGallery";

export function HeroGalleryStrip() {
  return (
    <div className="hero-gallery__strip" data-hero-marquee-strip>
      {heroGallerySlides.map((slide) => (
        <div key={slide.src} className="hero-gallery__slide">
          <div className="hero-gallery__card">
            <div className="hero-gallery__parallax" data-hero-gallery-parallax>
              <img
                className="hero-gallery__img"
                src={slide.src}
                alt={slide.alt}
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
