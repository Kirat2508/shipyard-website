import { easing, el, finished, prefersReducedMotion, throwIfAborted, wait } from "./motion";

export const ROCKET_SRC = "/images/s4/rocket.svg";

export type RocketLaunchOptions = {
  /** The preloader's boat: it turns into the rocket on this spot. */
  vessel: HTMLElement;
  signal?: AbortSignal;
};

/**
 * On "ship" the boat becomes a rocket: it scales up, lifts off the water, then flies
 * straight at the camera until it fills the screen and the stage flashes white.
 */
export async function RocketLaunch(stage: HTMLElement, opts: RocketLaunchOptions): Promise<HTMLElement> {
  const stageBox = stage.getBoundingClientRect();
  const spot = opts.vessel.getBoundingClientRect();
  const originX = spot.left + spot.width / 2 - stageBox.left;
  const originY = spot.bottom - stageBox.top;

  const ship = el("div", "sy-rocket__ship");
  const img = el("img");
  img.src = ROCKET_SRC;
  img.alt = "";
  img.width = 120;
  img.height = 220;
  const trail = el("div", "sy-rocket__trail");
  ship.append(img, trail);
  ship.style.left = `${originX}px`;
  ship.style.top = `${originY}px`;
  stage.appendChild(ship);

  if (prefersReducedMotion()) return stage;

  const land = easing("ease-land", "ease-out");
  const launch = easing("ease-launch", "ease-in");

  // 1. The boat spins down into a burst and the rocket grows out of it.
  opts.vessel.animate(
    [
      { opacity: 1, transform: "translate(-50%, 0) scale(1) rotate(0)" },
      { opacity: 0, transform: "translate(-50%, -6px) scale(0.3) rotate(-90deg)" },
    ],
    { duration: 340, easing: land, fill: "forwards" },
  );
  const burst = el("div", "sy-rocket__burst");
  burst.style.left = `${originX}px`;
  burst.style.top = `${originY - spot.height / 2}px`;
  stage.appendChild(burst);
  burst.animate(
    [
      { opacity: 0.9, transform: "translate(-50%, -50%) scale(0.2)" },
      { opacity: 0, transform: "translate(-50%, -50%) scale(2.4)" },
    ],
    { duration: 520, easing: land, fill: "forwards" },
  );
  await finished(
    ship.animate(
      [
        { opacity: 0, transform: "translate(-50%, -100%) scale(0.2)" },
        { opacity: 1, transform: "translate(-50%, -100%) scale(1.25)", offset: 0.7 },
        { opacity: 1, transform: "translate(-50%, -100%) scale(1)" },
      ],
      { duration: 520, easing: land, fill: "forwards" },
    ),
  );
  throwIfAborted(opts.signal);

  // 2. Rumble, then lift off the water while scaling up.
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
  stage.querySelector(".sy-pre__bar")?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, fill: "forwards" });
  stage.querySelector(".sy-pre__counter")?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" });
  trail.animate([{ height: "0px" }, { height: "60px" }], { duration: 500, delay: 250, easing: land, fill: "both" });
  const centreX = stageBox.width / 2;
  const centreY = stageBox.height / 2;
  await finished(
    ship.animate(
      [
        { transform: "translate(-50%, -100%) scale(1)" },
        {
          transform: `translate(calc(-50% + ${(centreX - originX) * 0.6}px), calc(-100% + ${(centreY - originY) * 0.6 - 120}px)) scale(2.6)`,
        },
      ],
      { duration: 1000, easing: launch, fill: "forwards" },
    ),
  );
  throwIfAborted(opts.signal);

  // 3. Turn toward the viewer and zoom into the camera.
  trail.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" });
  const fill = Math.max(stageBox.width, stageBox.height) / 30;
  const zoom = ship.animate(
    [
      {
        transform: `translate(calc(-50% + ${(centreX - originX) * 0.6}px), calc(-100% + ${(centreY - originY) * 0.6 - 120}px)) scale(2.6)`,
      },
      {
        transform: `translate(calc(-50% + ${centreX - originX}px), calc(-50% + ${centreY - originY}px)) scale(${fill})`,
      },
    ],
    { duration: 700, easing: "cubic-bezier(0.55, 0, 1, 0.45)", fill: "forwards" },
  );
  const flash = el("div", "sy-rocket__flash");
  stage.appendChild(flash);
  flash.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 560, fill: "both" });
  await finished(zoom);
  await wait(120, opts.signal);
  return stage;
}
