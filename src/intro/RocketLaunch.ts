import { clear, easing, el, finished, prefersReducedMotion, throwIfAborted, tokenMs } from "./motion";

export const ROCKET_SRC = "/images/s4/rocket.svg";

export type RocketLaunchOptions = { word?: string; signal?: AbortSignal };

/** A small rocket appears on the word "ship", rumbles, then lifts off out of the top of the screen. */
export async function RocketLaunch(root: HTMLElement, opts: RocketLaunchOptions = {}): Promise<HTMLElement> {
  clear(root);
  const stage = el("div", "sy-scene sy-rocket");
  const ship = el("div", "sy-rocket__ship");
  const img = el("img");
  img.src = ROCKET_SRC;
  img.alt = "";
  img.width = 120;
  img.height = 220;
  const trail = el("div", "sy-rocket__trail");
  ship.append(img, trail);
  const word = el("div", "sy-pre__word");
  word.appendChild(el("span", undefined, opts.word ?? "ship"));
  stage.append(ship, word);
  root.appendChild(stage);

  if (prefersReducedMotion()) return stage;

  const land = easing("ease-land", "ease-out");
  await finished(
    ship.animate(
      [
        { opacity: 0, transform: "translateY(12px) scale(0.6)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      { duration: 360, easing: land },
    ),
  );
  throwIfAborted(opts.signal);

  await finished(
    ship.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-1.5px) rotate(-2deg)" },
        { transform: "translateX(1.5px) rotate(2deg)" },
        { transform: "translateX(0)" },
      ],
      { duration: 80, iterations: 5 },
    ),
  );
  throwIfAborted(opts.signal);

  const scene = tokenMs("dur-scene", 1600);
  trail.animate([{ height: "0px" }, { height: "56px" }], { duration: scene * 0.5, delay: scene * 0.3, easing: land, fill: "both" });
  word.animate([{ opacity: 1 }, { opacity: 0.25 }], { duration: scene, fill: "forwards" });
  await finished(
    ship.animate([{ transform: "translateY(0)" }, { transform: "translateY(-75vh)" }], {
      duration: scene,
      easing: easing("ease-launch", "ease-in"),
      fill: "forwards",
    }),
  );
  throwIfAborted(opts.signal);
  return stage;
}
