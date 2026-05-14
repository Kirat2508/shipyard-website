import { motion } from "framer-motion";
import type { Fellow } from "../data/fellows";

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

const hoverTransition = { type: "tween" as const, duration: 0.28, ease: "easeOut" };

export function FellowCard({ fellow }: { fellow: Fellow }) {
  const nameId = `fellow-name-${fellow.id}`;
  const label = `LinkedIn profile for ${fellow.name}`;
  const bioTrimmed = fellow.bio?.trim();
  const productUrl = fellow.productUrl?.trim();
  const productLinkLabel = `Visit ${fellow.role} website (opens in new tab)`;

  return (
    <motion.article
      className="group relative flex h-full flex-col"
      aria-labelledby={nameId}
      initial={false}
      whileHover={{ y: -6 }}
      transition={hoverTransition}
    >
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-black/[0.08] bg-white shadow-sm transition-shadow duration-250 group-hover:shadow-md">
        <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-neutral-100">
          <div className="h-full w-full origin-center transition-transform duration-250 ease-out group-hover:scale-[1.04]">
            <img
              src={fellow.imageSrc}
              alt={`Portrait of ${fellow.name}, ${fellow.role}`}
              className="h-full w-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Strong bottom scrim so white type reads on bright / busy photos (inspired by YC-style cards) */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[60%] bg-[linear-gradient(to_top,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.72)_22%,rgba(0,0,0,0.38)_48%,rgba(0,0,0,0.12)_72%,transparent_100%)]"
            aria-hidden="true"
          />

          {/* Fixed corner so every card has the LinkedIn CTA in the same place */}
          <a
            href={fellow.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="pointer-events-auto absolute right-4 top-4 z-30 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#0A66C2] text-white shadow-md ring-1 ring-white/15 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <LinkedInMark className="size-4 text-white" />
          </a>

          <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-2 sm:px-5 sm:pb-5 [&_h3]:[text-shadow:0_1px_3px_rgba(0,0,0,0.9)] [&_p]:[text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
            <h3
              id={nameId}
              className="min-w-0 font-sans text-sm font-semibold leading-snug tracking-tight text-white sm:text-base lg:text-[0.9375rem]"
            >
              {fellow.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-1 font-sans text-xs font-normal leading-snug text-white sm:text-sm lg:text-[0.8125rem] [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
              <span className="min-w-0">{fellow.role}</span>
              {productUrl ? (
                <a
                  href={productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={productLinkLabel}
                  className="pointer-events-auto inline-flex shrink-0 items-center rounded-sm text-white opacity-95 ring-offset-2 ring-offset-transparent transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90"
                >
                  <ProductLinkIcon className="h-[1em] w-[1em] translate-y-px drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]" />
                </a>
              ) : null}
            </div>
            {bioTrimmed ? (
              <p className="mt-1 line-clamp-3 font-sans text-[0.6875rem] font-normal leading-relaxed text-white/95 sm:text-xs sm:leading-relaxed lg:line-clamp-2 lg:text-[0.7rem] lg:leading-relaxed">
                {bioTrimmed}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
