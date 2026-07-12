import { mentors } from "../data/mentors";

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
              <img
                src={mentor.imageSrc}
                alt={`Portrait of ${mentor.name}, ${mentor.role}`}
                width={400}
                height={500}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="supported-by-mentors__text">
              <div className="supported-by-mentors__name">{mentor.name}</div>
              <div className="supported-by-mentors__role">{mentor.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
