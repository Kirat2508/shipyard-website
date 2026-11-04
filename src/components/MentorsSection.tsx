import { mentors } from "../data/mentors";
import { IMAGE_SIZES } from "../lib/optimizedImage";
import { OptimizedImage } from "./OptimizedImage";

export function MentorsSection() {
  return (
    <div className="supported-by-mentors">
      <div
        className="supported-by-mentors__grid"
        role="group"
        aria-label="Featured speakers and mentors"
      >
        {mentors.map((mentor) => (
          <div key={mentor.id} className="supported-by-mentors__item">
            <div className="supported-by-mentors__portrait">
              <OptimizedImage
                originalSrc={mentor.imageSrc}
                alt={mentor.role ? `Portrait of ${mentor.name}, ${mentor.role}` : `Portrait of ${mentor.name}`}
                className="supported-by-mentors__img"
                wrapperClassName="supported-by-mentors__img-wrap"
                sizes={IMAGE_SIZES.mentor}
                width={600}
                height={750}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="supported-by-mentors__text">
              <div className="supported-by-mentors__name">{mentor.name}</div>
              {mentor.role ? <div className="supported-by-mentors__role">{mentor.role}</div> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
