import { easing, el, finished, prefersReducedMotion, throwIfAborted, tokenMs } from "./motion";

export const ROCKET_SRC = "/images/s4/rocket.svg";

export type RocketLaunchOptions = {
  /** The preloader's builder: the rocket lands on this spot and the builder climbs in. */
  builder: HTMLElement;
  signal?: AbortSignal;
};

/** On the "ship" checkpoint the builder boards a small rocket, which rumbles and lifts off. */
export async function RocketLaunch(stage: HTMLElement, opts: RocketLaunchOptions): Promise<HTMLElement> {
  const stageBox = stage.getBoundingClientRect();
  const spot = opts.builder.getBoundingClientRect();

  const ship = el("div", "sy-rocket__ship");
  const img = el("img");
  img.src = ROCKET_SRC;
  img.alt = "";
  img.width = 120;
  img.height = 220;
  const trail = el("div", "sy-rocket__trail");
  ship.append(img, trail);
  ship.style.left = `${spot.left + spot.width / 2 - stageBox.left}px`;
  ship.style.top = `${spot.bottom - stageBox.top}px`;
  stage.appendChild(ship);

  if (prefersReducedMotion()) return stage;

  const land = easing("ease-land", "ease-out");
  // Builder climbs in as the rocket appears.
  opts.builder.animate([{ opacity: 1 }, { opacity: 0, transform: "translate(-50%, -10px) scale(0.6)" }], {
    duration: 320,
    fill: "forwards",
  });
  await finished(
    ship.animate(
      [
        { opacity: 0, transform: "translate(-50%, -100%) scale(0.4)" },
        { opacity: 1, transform: "translate(-50%, -100%) scale(1)" },
      ],
      { duration: 380, easing: land, fill: "forwards" },
    ),
  );
  throwIfAborted(opts.signal);

  await finished(
    ship.animate(
      [
        { transform: "translate(-50%, -100%)" },
        { transform: "translate(calc(-50% - 1.5px), -100%) rotate(-2deg)" },
        { transform: "translate(calc(-50% + 1.5px), -100%) rotate(2deg)" },
        { transform: "translate(-50%, -100%)" },
      ],
      { duration: 80, iterations: 5 },
    ),
  );
  throwIfAborted(opts.signal);

  const scene = tokenMs("dur-scene", 1600);
  trail.animate([{ height: "0px" }, { height: "70px" }], { duration: scene * 0.4, delay: scene * 0.45, easing: land, fill: "both" });
  stage.querySelector(".sy-pre__bar")?.animate([{ opacity: 1 }, { opacity: 0.2 }], { duration: scene, fill: "forwards" });
  await finished(
    ship.animate(
      [{ transform: "translate(-50%, -100%)" }, { transform: `translate(-50%, calc(-100% - ${spot.bottom + 80}px))` }],
      { duration: scene, easing: easing("ease-launch", "ease-in"), fill: "forwards" },
    ),
  );
  throwIfAborted(opts.signal);
  return stage;
}
