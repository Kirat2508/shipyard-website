import { clear, easing, el, pad3, prefersReducedMotion, throwIfAborted } from "./motion";

export type PreloaderOptions = {
  /** Words shown one at a time, in order. */
  stages?: string[];
  /** Choreographed fill time in ms. */
  duration?: number;
  /** Real loading progress, 0 → 1. The counter never runs ahead of it. */
  progress?: () => number;
  /** Give up waiting on slow assets after this many ms past `duration`. */
  maxExtraWait?: number;
  signal?: AbortSignal;
};

const DEFAULT_STAGES = ["ideate", "build", "gtm", "ship"];

/**
 * Small, centred, lowercase: ideate → build → gtm → ship, with a thin progress line and counter.
 * Shows min(choreographed curve, real progress), so it never fakes a longer wait
 * than the assets need and never claims assets are ready before they are.
 */
export function Preloader(root: HTMLElement, opts: PreloaderOptions = {}): Promise<HTMLElement> {
  const stages = opts.stages ?? DEFAULT_STAGES;
  const total = opts.duration ?? 2800;
  const maxExtra = opts.maxExtraWait ?? 3000;
  const realProgress = opts.progress ?? (() => 1);

  clear(root);
  const stage = el("div", "sy-scene sy-pre");
  const word = el("div", "sy-pre__word");
  let current = el("span", undefined, stages[0]);
  word.appendChild(current);
  const track = el("div", "sy-pre__track");
  const fill = el("div", "sy-pre__fill");
  track.appendChild(fill);
  const counter = el("div", "sy-pre__counter", "000");
  stage.append(word, track, counter);
  root.appendChild(stage);

  let shown = 0;
  const showStage = (i: number) => {
    if (i === shown) return;
    shown = i;
    const next = el("span", undefined, stages[i]);
    if (prefersReducedMotion()) {
      current.replaceWith(next);
      current = next;
      return;
    }
    const prev = current;
    prev.style.position = "absolute";
    prev.style.inset = "0";
    word.appendChild(next);
    current = next;
    const ease = easing("ease-snap", "ease-in-out");
    prev.animate([{ transform: "translateY(0)" }, { transform: "translateY(-110%)" }], { duration: 320, easing: ease, fill: "forwards" }).finished.then(
      () => prev.remove(),
      () => prev.remove(),
    );
    next.animate([{ transform: "translateY(110%)" }, { transform: "translateY(0)" }], { duration: 320, easing: ease });
  };

  const render = (p: number) => {
    fill.style.width = `${p * 100}%`;
    counter.textContent = pad3(Math.round(p * 100));
    showStage(Math.min(stages.length - 1, Math.floor(p * stages.length)));
  };

  if (prefersReducedMotion()) {
    render(1);
    return Promise.resolve(stage);
  }

  // Progress eases through each word, pausing briefly as it changes, like a build checkpoint.
  const shape = (x: number) => {
    const steps = stages.length;
    const seg = 1 / steps;
    const i = Math.min(Math.floor(x / seg), steps - 1);
    const local = (x - i * seg) / seg;
    const e = local < 0.5 ? 4 * local ** 3 : 1 - (-2 * local + 2) ** 3 / 2;
    return (i + e) * seg;
  };

  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const tick = (now: number) => {
      try {
        throwIfAborted(opts.signal);
      } catch (err) {
        return reject(err);
      }
      const elapsed = now - t0;
      const x = Math.min(elapsed / total, 1);
      const real = elapsed >= total + maxExtra ? 1 : realProgress();
      const p = Math.min(shape(x), real);
      render(p);
      if (x >= 1 && p >= 1) resolve(stage);
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
