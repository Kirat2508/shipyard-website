import { clear, el, finished, prefersReducedMotion, tokenMs, easing } from "./motion";

export type WordmarkDropOptions = {
  text?: string;
  kicker?: string;
};

export type Wordmark = {
  stage: HTMLElement;
  /** Plays the fall-and-land animation; resolves when the last letter lands. */
  play(): Promise<void>;
};

/** Builds the wordmark ("Project" + falling "Shipyard" letters) without playing it. */
export function renderWordmark(root: HTMLElement, opts: WordmarkDropOptions = {}): Wordmark {
  const text = opts.text ?? "Shipyard";
  const kickerText = opts.kicker ?? "Project";
  clear(root);
  const stage = el("div", "sy-drop");
  stage.setAttribute("role", "img");
  stage.setAttribute("aria-label", `${kickerText} ${text}`);
  const kicker = el("div", "sy-drop__kicker", kickerText);
  const word = el("div", "sy-drop__word");
  const floor = el("div", "sy-drop__floor");
  const chars = Array.from(text).map((c) => {
    const s = el("span", "sy-drop__ch", c);
    word.appendChild(s);
    return s;
  });
  stage.append(kicker, word, floor);
  root.appendChild(stage);

  const play = async () => {
    stage.classList.remove("is-waiting");
    if (prefersReducedMotion()) return;
    const slow = tokenMs("dur-slow", 900);
    floor.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
      duration: slow,
      easing: easing("ease-snap", "ease"),
      fill: "both",
    });
    // Tracking settles from wide to whatever the stylesheet sets for this wordmark.
    const tracking = parseFloat(getComputedStyle(kicker).letterSpacing) || 0;
    const size = parseFloat(getComputedStyle(kicker).fontSize) || 16;
    kicker.animate(
      [
        { opacity: 0, letterSpacing: `${tracking + size * 0.7}px` },
        { opacity: 1, letterSpacing: `${tracking}px` },
      ],
      { duration: slow, delay: 200, easing: easing("ease-land", "ease-out"), fill: "both" },
    );
    let last: Animation | undefined;
    chars.forEach((c, i) => {
      const r = (i % 2 ? 1 : -1) * (8 + ((i * 7) % 14));
      last = c.animate(
        [
          { transform: `translateY(-140vh) rotate(${r}deg)`, easing: "cubic-bezier(.55,0,1,.45)" },
          { transform: `translateY(0) rotate(${r / 4}deg)`, offset: 0.55, easing: "cubic-bezier(0,.55,.45,1)" },
          { transform: `translateY(-14%) rotate(${-r / 8}deg)`, offset: 0.72, easing: "cubic-bezier(.55,0,1,.45)" },
          { transform: "translateY(0) rotate(0deg)", offset: 0.86, easing: "cubic-bezier(0,.55,.45,1)" },
          { transform: "translateY(-3%)", offset: 0.93 },
          { transform: "translateY(0)" },
        ],
        { duration: slow * 1.4, delay: 120 + i * 70, fill: "both" },
      );
    });
    await finished(last);
  };

  return { stage, play };
}

/** Renders and plays straight away (the intro scene). */
export async function WordmarkDrop(root: HTMLElement, opts: WordmarkDropOptions = {}): Promise<HTMLElement> {
  const mark = renderWordmark(root, opts);
  await mark.play();
  return mark.stage;
}

/** Footer sign-off: letters wait out of view, then drop once when scrolled into view. */
export function initWordmarkOnView(root: HTMLElement, opts: WordmarkDropOptions = {}): void {
  const mark = renderWordmark(root, opts);
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;
  mark.stage.classList.add("is-waiting");
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      void mark.play();
    },
    { threshold: 0.35 },
  );
  io.observe(mark.stage);
}
