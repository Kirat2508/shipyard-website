/**
 * Shared helpers for the S IV motion components: reduced-motion check,
 * token lookups (durations and easings live in public/styles.css) and small DOM utilities.
 */

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
}

/** Duration token in ms, e.g. tokenMs("dur-slow", 900). */
export function tokenMs(name: string, fallback: number): number {
  const v = parseFloat(readToken(name));
  return Number.isNaN(v) ? fallback : v;
}

/** Easing token, e.g. easing("ease-land", "ease-out"). */
export function easing(name: string, fallback: string): string {
  return readToken(name) || fallback;
}

/** Resolves after `ms`, or rejects with an AbortError as soon as `signal` aborts. */
export function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(abortError());
    const id = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort(): void {
      window.clearTimeout(id);
      reject(abortError());
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/** Resolves when an animation ends; cancelled animations resolve too. */
export function finished(anim: Animation | undefined): Promise<void> {
  return anim ? anim.finished.then(() => undefined).catch(() => undefined) : Promise.resolve();
}

export function abortError(): DOMException {
  return new DOMException("Intro skipped", "AbortError");
}

export function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw abortError();
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function clear(root: Element): void {
  while (root.firstChild) root.removeChild(root.firstChild);
}

export function pad3(n: number): string {
  return String(n).padStart(3, "0");
}
