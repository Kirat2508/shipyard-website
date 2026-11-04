import { boatSpriteSVG } from "./boatSprite";
import { clear, easing, el, pad3, prefersReducedMotion, throwIfAborted } from "./motion";

export type PreloaderOptions = {
  /** Checkpoints along the waves, in order. The last one is where the boat becomes a rocket. */
  stages?: string[];
  /** Choreographed sailing time in ms. */
  duration?: number;
  /** Real loading progress, 0 → 1. The boat never sails ahead of it. */
  progress?: () => number;
  /** Give up waiting on slow assets after this many ms past `duration`. */
  maxExtraWait?: number;
  signal?: AbortSignal;
};

export type PreloaderResult = {
  stage: HTMLElement;
  /** The boat, moored on the last checkpoint when loading is done. */
  vessel: HTMLElement;
  /** The last checkpoint's label ("ship"), already grown big. */
  finalLabel: HTMLElement;
};

const DEFAULT_STAGES = ["ideate", "build", "gtm", "ship"];

/**
 * A wavy progress line with four checkpoints. A little ship sails along the filled water and
 * bobs over each checkpoint; at the end "ship" grows to take the stage. Shows
 * min(choreographed curve, real progress), so it never fakes a longer wait than the assets need.
 */
export function Preloader(root: HTMLElement, opts: PreloaderOptions = {}): Promise<PreloaderResult> {
  const stages = opts.stages ?? DEFAULT_STAGES;
  const total = opts.duration ?? 3200;
  const maxExtra = opts.maxExtraWait ?? 3000;
  const realProgress = opts.progress ?? (() => 1);
  const reduce = prefersReducedMotion();

  clear(root);
  const stage = el("div", "sy-scene sy-pre");
  const bar = el("div", "sy-pre__bar");
  const sea = el("div", "sy-pre__sea");
  const fill = el("div", "sy-pre__fill");
  sea.appendChild(fill);
  bar.appendChild(sea);

  const nodes = stages.map((word, i) => {
    const node = el("div", "sy-pre__node");
    node.style.left = `${(i / (stages.length - 1)) * 100}%`;
    const label = el("span", "sy-pre__label", word);
    node.append(el("span", "sy-pre__dot"), label);
    bar.appendChild(node);
    return { node, label };
  });

  const vessel = el("div", "sy-boat");
  const hull = el("div", "sy-boat__hull");
  hull.innerHTML = boatSpriteSVG();
  vessel.appendChild(hull);
  bar.appendChild(vessel);
  const counter = el("div", "sy-pre__counter", "000");
  stage.append(bar, counter);
  root.appendChild(stage);

  const last = nodes[nodes.length - 1];
  let reached = 0;

  // Gentle rocking for the whole voyage.
  const rock = reduce
    ? undefined
    : hull.animate(
        [
          { transform: "translateY(0) rotate(-4deg)" },
          { transform: "translateY(-2px) rotate(3deg)" },
          { transform: "translateY(0) rotate(-4deg)" },
        ],
        { duration: 1100, iterations: Infinity, easing: "ease-in-out" },
      );

  const bob = () => {
    if (reduce) return;
    vessel.animate(
      [
        { transform: "translate(-50%, 0)" },
        { transform: "translate(-50%, -12px)", offset: 0.4 },
        { transform: "translate(-50%, 0)" },
      ],
      { duration: 420, easing: "cubic-bezier(.3,0,.3,1)" },
    );
  };

  const render = (p: number) => {
    fill.style.width = `${p * 100}%`;
    vessel.style.left = `${p * 100}%`;
    counter.textContent = pad3(Math.round(p * 100));
    nodes.forEach(({ node }, i) => {
      if (i >= reached && p >= i / (stages.length - 1) - 0.001) {
        node.classList.add("is-on");
        if (i > 0) bob();
        reached = i + 1;
      }
    });
  };

  const growFinal = async () => {
    rock?.cancel();
    stage.classList.add("is-done");
    if (reduce) return;
    await last.label
      .animate(
        [
          { transform: "translate(-50%, 0) scale(1)" },
          { transform: "translate(-50%, 6px) scale(2.6)" },
        ],
        { duration: 520, easing: easing("ease-land", "ease-out"), fill: "forwards" },
      )
      .finished.catch(() => undefined);
  };

  if (reduce) {
    render(1);
    stage.classList.add("is-done");
    return Promise.resolve({ stage, vessel, finalLabel: last.label });
  }

  // Sailing eases between checkpoints, pausing briefly at each, like a build passing a stage.
  const shape = (x: number) => {
    const steps = stages.length - 1;
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
        rock?.cancel();
        return reject(err);
      }
      const elapsed = now - t0;
      const x = Math.min(elapsed / total, 1);
      const real = elapsed >= total + maxExtra ? 1 : realProgress();
      const p = Math.min(shape(x), real);
      render(p);
      if (x >= 1 && p >= 1) {
        growFinal().then(() => resolve({ stage, vessel, finalLabel: last.label }), reject);
      } else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
