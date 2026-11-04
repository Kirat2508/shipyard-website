import { builderSpriteSVG } from "./builderSprite";
import { clear, easing, el, pad3, prefersReducedMotion, throwIfAborted } from "./motion";

export type PreloaderOptions = {
  /** Checkpoints along the bar, in order. The last one becomes the launch pad. */
  stages?: string[];
  /** Choreographed fill time in ms. */
  duration?: number;
  /** Real loading progress, 0 → 1. The bar never runs ahead of it. */
  progress?: () => number;
  /** Give up waiting on slow assets after this many ms past `duration`. */
  maxExtraWait?: number;
  signal?: AbortSignal;
};

export type PreloaderResult = {
  stage: HTMLElement;
  /** The builder sprite, standing on the last checkpoint when the bar is full. */
  builder: HTMLElement;
  /** The last checkpoint's label ("ship"), already grown big. */
  finalLabel: HTMLElement;
};

const DEFAULT_STAGES = ["ideate", "build", "gtm", "ship"];

/**
 * A progress bar with four checkpoints. A pixel builder walks along the fill and hops at each
 * checkpoint; at the end "ship" grows to take the stage. Shows min(choreographed curve, real
 * progress), so it never fakes a longer wait than the assets need.
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
  const track = el("div", "sy-pre__track");
  const fill = el("div", "sy-pre__fill");
  track.appendChild(fill);
  bar.appendChild(track);

  const nodes = stages.map((word, i) => {
    const node = el("div", "sy-pre__node");
    node.style.left = `${(i / (stages.length - 1)) * 100}%`;
    const label = el("span", "sy-pre__label", word);
    node.append(el("span", "sy-pre__dot"), label);
    bar.appendChild(node);
    return { node, label };
  });

  const builder = el("div", "sy-walker");
  builder.innerHTML = builderSpriteSVG();
  bar.appendChild(builder);
  const counter = el("div", "sy-pre__counter", "000");
  stage.append(bar, counter);
  root.appendChild(stage);

  const last = nodes[nodes.length - 1];
  let reached = 0;
  let lastP = 0;
  let stepClock = 0;

  const hop = () => {
    if (reduce) return;
    builder.animate(
      [
        { transform: "translate(-50%, 0)" },
        { transform: "translate(-50%, -16px)", offset: 0.45 },
        { transform: "translate(-50%, 0)" },
      ],
      { duration: 360, easing: "cubic-bezier(.3,0,.3,1)" },
    );
  };

  const render = (p: number, now: number) => {
    fill.style.width = `${p * 100}%`;
    builder.style.left = `${p * 100}%`;
    counter.textContent = pad3(Math.round(p * 100));
    // Walk cycle while moving, stand still while the bar waits on real loading.
    if (p > lastP + 0.0005 && now - stepClock > 110) {
      builder.classList.toggle("is-step");
      stepClock = now;
    }
    lastP = p;
    nodes.forEach(({ node }, i) => {
      if (i >= reached && p >= i / (stages.length - 1) - 0.001) {
        node.classList.add("is-on");
        if (i > 0) hop();
        reached = i + 1;
      }
    });
  };

  const growFinal = async () => {
    builder.classList.remove("is-step");
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
    render(1, 0);
    stage.classList.add("is-done");
    return Promise.resolve({ stage, builder, finalLabel: last.label });
  }

  // Progress eases between checkpoints, pausing briefly at each, like a build passing a stage.
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
        return reject(err);
      }
      const elapsed = now - t0;
      const x = Math.min(elapsed / total, 1);
      const real = elapsed >= total + maxExtra ? 1 : realProgress();
      const p = Math.min(shape(x), real);
      render(p, now);
      if (x >= 1 && p >= 1) {
        growFinal().then(() => resolve({ stage, builder, finalLabel: last.label }), reject);
      } else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
