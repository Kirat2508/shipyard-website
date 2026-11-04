import { easing, prefersReducedMotion, tokenMs } from "../intro/motion";

/**
 * KineticHeadline: letters slide in from alternating sides with a skew, masked per letter,
 * once when the heading scrolls into view. Markup: <h2 class="sy-kin" data-sy-kinetic data-accent="6">;
 * data-italic="1" sets that word (0-based) in italic.
 * The heading keeps its text as its accessible name; the split letters are aria-hidden.
 */
function split(heading: HTMLElement): HTMLElement[] {
  const text = heading.textContent?.trim() ?? "";
  const accent = Number(heading.dataset.accent ?? -1);
  const italic = Number(heading.dataset.italic ?? -1);
  heading.setAttribute("aria-label", text);
  heading.textContent = "";

  const chars: HTMLElement[] = [];
  let index = 0;
  text.split(" ").forEach((word, w) => {
    if (w > 0) index += 1; // the space between words
    const wordEl = document.createElement("span");
    wordEl.className = `sy-kin__word${w === italic ? " is-italic" : ""}`;
    wordEl.setAttribute("aria-hidden", "true");
    for (const c of Array.from(word)) {
      const mask = document.createElement("span");
      mask.className = "sy-kin__mask";
      const ch = document.createElement("span");
      ch.className = `sy-kin__ch${index === accent ? " is-ember" : ""}`;
      ch.textContent = c;
      mask.appendChild(ch);
      wordEl.appendChild(mask);
      chars.push(ch);
      index += 1;
    }
    heading.appendChild(wordEl);
  });
  return chars;
}

function play(chars: HTMLElement[]): void {
  const duration = tokenMs("dur-slow", 900);
  const ease = easing("ease-land", "ease-out");
  chars.forEach((c, i) => {
    const from = i % 2 ? "translateY(-110%) skewX(-18deg)" : "translateY(110%) skewX(18deg)";
    c.animate([{ transform: from }, { transform: "translateY(0) skewX(0)" }], {
      duration,
      delay: i * 45,
      easing: ease,
      fill: "backwards",
    });
  });
}

export function initKineticHeadlines(): void {
  const headings = document.querySelectorAll<HTMLElement>("[data-sy-kinetic]");
  if (!headings.length) return;
  const reduce = prefersReducedMotion() || !("IntersectionObserver" in window);

  const pending = new Map<Element, HTMLElement[]>();
  headings.forEach((h) => {
    const chars = split(h);
    if (reduce) return;
    h.classList.add("is-waiting");
    pending.set(h, chars);
  });
  if (reduce) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const chars = pending.get(entry.target);
        io.unobserve(entry.target);
        pending.delete(entry.target);
        entry.target.classList.remove("is-waiting");
        if (chars) play(chars);
      }
    },
    { threshold: 0.4 },
  );
  pending.forEach((_, h) => io.observe(h));
}
