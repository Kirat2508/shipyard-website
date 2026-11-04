import { trackAssets } from "./assets";
import { easing, el, finished, tokenMs, wait } from "./motion";
import { PhotoCollage, type CollageFrame } from "./PhotoCollage";
import { Preloader } from "./Preloader";
import { ROCKET_SRC, RocketLaunch } from "./RocketLaunch";
import { WordmarkDrop } from "./WordmarkDrop";

export const INTRO_SEEN_KEY = "sy-intro-seen";
export const ALC_LOGO_SRC = "/images/s4/brand/ai-learn-circle.webp";
/** If the page took longer than this to boot, the CSS cover has already lifted: skip the intro. */
const LATE_BOOT_MS = 5000;

export type IntroOptions = {
  /** Photos for the collage. */
  frames: CollageFrame[];
  /** The real hero (rendered in index.html underneath the intro). */
  hero: HTMLElement;
  /** Hero background image URL to have ready before the hand-off. */
  heroImageSrc: string;
  onHeroOpen?: () => void;
};

/**
 * Preloader (a ship sails ideate → build → gtm → ship) → the ship becomes a rocket and zooms
 * into the camera → PhotoCollage → "Project Shipyard by AI Learn Circle" → Hero.
 * Runs on a fixed white stage over the already-rendered page. "skip intro" and Esc end it at once.
 */
export function runIntro(opts: IntroOptions): void {
  const root = document.documentElement;
  root.classList.remove("intro-pending");
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* storage blocked: the intro may replay, which is harmless */
  }
  if (performance.now() > LATE_BOOT_MS) return;

  const main = document.querySelector("main");
  const controller = new AbortController();
  const { signal } = controller;

  const overlay = el("div", "sy-intro");
  const scene = el("div", "sy-intro__scene");
  scene.setAttribute("aria-hidden", "true");
  const skip = el("button", "sy-pill sy-pill--s sy-intro__skip", "skip intro");
  skip.type = "button";
  overlay.append(scene, skip);
  document.body.appendChild(overlay);

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  root.classList.add("intro-active");
  if (main) main.inert = true;
  skip.focus({ preventScroll: true });

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    controller.abort();
    document.removeEventListener("keydown", onKey);
    const skipHadFocus = document.activeElement === skip;
    overlay.remove();
    root.classList.remove("intro-active");
    if (main) main.inert = false;
    if (skipHadFocus) {
      const heading = opts.hero.querySelector<HTMLElement>("h1");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
    }
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") finish();
  };
  document.addEventListener("keydown", onKey);
  skip.addEventListener("click", finish);

  const assets = trackAssets(
    [opts.heroImageSrc, ROCKET_SRC, ALC_LOGO_SRC, ...opts.frames.map((f) => f.src)],
    [document.fonts.ready],
  );

  (async () => {
    const pre = await Preloader(scene, { progress: assets.progress, signal });
    await RocketLaunch(pre.stage, { vessel: pre.vessel, signal });
    const frames = opts.frames.filter((f) => assets.loaded.has(f.src));
    const collage = await PhotoCollage(scene, { frames, signal });

    // The wordmark lands on top of the dimmed collage.
    collage.animate([{ opacity: 1 }, { opacity: 0.16 }], { duration: tokenMs("dur-base", 480), fill: "forwards" });
    const mark = el("div", "sy-intro__mark");
    scene.appendChild(mark);
    await WordmarkDrop(mark, { layout: "inline", byline: "by", bylineLogo: { src: ALC_LOGO_SRC, alt: "AI Learn Circle" } });
    await wait(900, signal);

    // Hand off: the stage fades away over the hero while its copy staggers in.
    opts.onHeroOpen?.();
    await finished(
      overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: tokenMs("dur-slow", 900),
        easing: easing("ease-land", "ease-out"),
        fill: "forwards",
      }),
    );
  })()
    .catch((err: unknown) => {
      if (!(err instanceof DOMException && err.name === "AbortError")) console.error(err);
    })
    .finally(finish);
}
