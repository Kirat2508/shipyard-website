/**
 * Tracks the intro's real assets so the Preloader counter reflects actual loading.
 * Failed images still count as settled (the intro must never hang on one file);
 * `loaded` tells callers which ones actually arrived.
 */
export type AssetTracker = {
  /** 0 → 1, fraction of tracked assets that have settled. */
  progress(): number;
  /** Resolves once every tracked asset has settled. */
  ready: Promise<void>;
  /** Image URLs that loaded successfully. */
  loaded: Set<string>;
};

export function trackAssets(imageUrls: string[], extra: Promise<unknown>[] = []): AssetTracker {
  const loaded = new Set<string>();
  const total = imageUrls.length + extra.length;
  let settled = 0;

  const settle = () => {
    settled += 1;
  };

  const imagePromises = imageUrls.map(
    (url) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          loaded.add(url);
          settle();
          resolve();
        };
        img.onerror = () => {
          settle();
          resolve();
        };
        img.src = url;
      }),
  );

  const extraPromises = extra.map((p) =>
    p.then(
      () => settle(),
      () => settle(),
    ),
  );

  return {
    progress: () => (total === 0 ? 1 : settled / total),
    ready: Promise.all([...imagePromises, ...extraPromises]).then(() => undefined),
    loaded,
  };
}
