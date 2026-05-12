import { fellows } from "../data/fellows";
import { FellowCard } from "./FellowCard";

export function FellowsSection() {
  return (
    <section
      className="reveal-on-scroll bg-white px-[5vw] py-[var(--fold-gap)]"
      aria-label="Recent fellows"
    >
      <div className="mx-auto max-w-[1440px]">
        <h2 className="heading-section heading-section--fold">Recent Fellows</h2>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {fellows.map((fellow) => (
            <FellowCard key={fellow.id} fellow={fellow} />
          ))}
        </div>
      </div>
    </section>
  );
}
