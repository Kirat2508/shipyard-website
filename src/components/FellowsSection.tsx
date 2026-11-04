import { fellows } from "../data/fellows";
import { FellowCard } from "./FellowCard";

/** Sticker tilt per card, cycling between -4 and 4 degrees so neighbours never match. */
const TILTS = [-4, 2, -2, 4];

/** Grid of fellow stickers; the section shell and kinetic heading live in index.html. */
export function FellowsSection() {
  return (
    <div className="sy-fellows__grid">
      {fellows.map((fellow, i) => (
        <FellowCard key={fellow.id} fellow={fellow} tilt={TILTS[i % TILTS.length]} />
      ))}
    </div>
  );
}
