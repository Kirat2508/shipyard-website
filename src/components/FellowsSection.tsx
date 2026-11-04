import { featuredFellows } from "../data/fellows";
import { FellowCard } from "./FellowCard";

/** Gentle alternating tilt, like photos pinned to a board. */
const TILTS = [-2, 1.5, -1, 2];

/** Polaroid grid of the featured fellows; the section shell and heading live in index.html. */
export function FellowsSection() {
  return (
    <div className="sy-fellows__grid">
      {featuredFellows.map((fellow, i) => (
        <FellowCard key={fellow.id} fellow={fellow} index={i} tilt={TILTS[i % TILTS.length]} />
      ))}
    </div>
  );
}
