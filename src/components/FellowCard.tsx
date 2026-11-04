import type { CSSProperties } from "react";
import type { Fellow } from "../data/fellows";
import { IMAGE_SIZES } from "../lib/optimizedImage";
import { OptimizedImage } from "./OptimizedImage";

function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/** Inline chain-link icon, sized with `em` to match adjacent product label. */
function ProductLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  );
}

export function FellowCard({ fellow, index, tilt }: { fellow: Fellow; index: number; tilt: number }) {
  const nameId = `fellow-name-${fellow.id}`;
  const label = `LinkedIn profile for ${fellow.name}`;
  const role = fellow.role.trim();
  const productUrl = fellow.productUrl?.trim();
  const productLinkLabel = `Visit ${role} website (opens in new tab)`;
  const alt = role ? `Portrait of ${fellow.name}, ${role}` : `Portrait of ${fellow.name}`;

  return (
    <article
      className="sy-fellow"
      aria-labelledby={nameId}
      style={{ "--tilt": `${tilt}deg` } as CSSProperties}
    >
      <div className="sy-fellow__photo">
        <OptimizedImage
          originalSrc={fellow.imageSrc}
          alt={alt}
          className="sy-fellow__img"
          wrapperClassName="sy-fellow__img-wrap"
          sizes={IMAGE_SIZES.fellow}
          width={800}
          height={1000}
          loading="lazy"
          decoding="async"
        />

        {/* Fixed corner so every card has the LinkedIn link in the same place */}
        <a
          href={fellow.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="sy-fellow__linkedin"
        >
          <LinkedInMark className="sy-fellow__linkedin-icon" />
        </a>
      </div>

      <div className="sy-fellow__caption">
        <span className="sy-fellow__num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h3 id={nameId} className="sy-fellow__name">
            {fellow.name}
          </h3>
          {role ? (
            <div className="sy-fellow__meta">
              <span>{role}</span>
              {productUrl ? (
                <a
                  href={productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={productLinkLabel}
                  className="sy-fellow__product"
                >
                  <ProductLinkIcon className="sy-fellow__product-icon" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
