import { clear, el, finished, prefersReducedMotion, tokenMs, easing } from "./motion";

export type WordmarkDropOptions = {
  text?: string;
  kicker?: string;
  /** "inline" sets "Project Shipyard" on one line like the hero title; "stacked" (default) puts it above. */
  layout?: "inline" | "stacked";
  /** Optional line under the wordmark, e.g. "by". */
  byline?: string;
  /** Logo shown after the byline text; its alt joins the accessible name. */
  bylineLogo?: { src: string; alt: string };
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
  const inline = opts.layout === "inline";
  const stage = el("div", `sy-drop${inline ? " sy-drop--inline" : ""}`);
  stage.setAttribute("role", "img");
  stage.setAttribute("aria-label", [kickerText, text, opts.byline, opts.bylineLogo?.alt].filter(Boolean).join(" "));
  const kicker = el(inline ? "span" : "div", "sy-drop__kicker", kickerText);
  const word = el(inline ? "span" : "div", "sy-drop__word");
  const floor = el("div", "sy-drop__floor");
  const chars = Array.from(text).map((c) => {
    const s = el("span", "sy-drop__ch", c);
    word.appendChild(s);
    return s;
  });
  if (inline) {
    const line = el("div", "sy-drop__line");
    line.append(kicker, word);
    stage.appendChild(line);
  } else {
    stage.append(kicker, word, floor);
  }
  const byline = opts.byline || opts.bylineLogo ? el("div", "sy-drop__by") : null;
  if (byline) {
    if (opts.byline) byline.appendChild(el("span", undefined, opts.byline));
    if (opts.bylineLogo) {
      const logo = el("img", "sy-drop__by-logo");
      logo.src = opts.bylineLogo.src;
      logo.alt = "";
      byline.appendChild(logo);
    }
    stage.appendChild(byline);
  }
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
    // Inline: "Project" just fades up beside the word, so the line never reflows.
    kicker.animate(
      inline
        ? [
            { opacity: 0, transform: "translateY(0.2em)" },
            { opacity: 1, transform: "translateY(0)" },
          ]
        : [
            { opacity: 0, letterSpacing: `${tracking + size * 0.7}px` },
            { opacity: 1, letterSpacing: `${tracking}px` },
          ],
      { duration: slow, delay: 200, easing: easing("ease-land", "ease-out"), fill: "both" },
    );
    byline?.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: slow, delay: 220 + chars.length * 70 + slow * 0.8, easing: easing("ease-land", "ease-out"), fill: "both" },
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
