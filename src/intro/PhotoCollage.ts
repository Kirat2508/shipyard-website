import { clear, easing, el, finished, prefersReducedMotion, throwIfAborted, wait } from "./motion";

export type CollageFrame = { src: string; alt: string };

export type PhotoCollageOptions = {
  /** Photos of Shipyard folks. Only pass ones you have the rights to use. */
  frames: CollageFrame[];
  signal?: AbortSignal;
};

/** Small deterministic PRNG so the collage looks hand-placed but is the same on every visit. */
function random(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Photos pop in across the screen, faster and faster, until they cover it like a pinned-up wall.
 * Resolves with the collage element so the wordmark can land on top of it.
 */
export async function PhotoCollage(root: HTMLElement, opts: PhotoCollageOptions): Promise<HTMLElement> {
  const frames = opts.frames;
  clear(root);
  const stage = el("div", "sy-scene sy-collage");
  root.appendChild(stage);
  if (!frames.length) return stage;

  const vw = root.clientWidth;
  const vh = root.clientHeight;
  const aspect = vw / Math.max(vh, 1);
  const cols = Math.max(3, Math.round(Math.sqrt(frames.length * aspect)));
  // Floor, so every row is full; photos beyond the grid land on top at random spots.
  const rows = Math.max(2, Math.floor(frames.length / cols));
  const cellCount = cols * rows;
  const cellW = vw / cols;
  const cellH = vh / rows;
  // Tiles overlap their cells so the wall covers the whole screen.
  const tileW = cellW * 1.5;
  const tileH = cellH * 1.5;
  const rand = random(7);

  // Fill cells in a shuffled order so the wall builds up from everywhere at once.
  const cells = Array.from({ length: cellCount }, (_, i) => i).sort(() => rand() - 0.5);
  const tiles = frames.map((frame, i) => {
    const cell = i < cellCount ? cells[i] : Math.floor(rand() * cellCount);
    const cx = (cell % cols) * cellW + cellW / 2 + (rand() - 0.5) * cellW * 0.3;
    const cy = Math.floor(cell / cols) * cellH + cellH / 2 + (rand() - 0.5) * cellH * 0.3;
    const tile = el("figure", "sy-collage__tile");
    tile.style.margin = "0";
    tile.style.width = `${tileW}px`;
    tile.style.height = `${tileH}px`;
    tile.style.left = `${cx - tileW / 2}px`;
    tile.style.top = `${cy - tileH / 2}px`;
    tile.style.rotate = `${((rand() - 0.5) * 16).toFixed(1)}deg`;
    tile.style.opacity = "0";
    const img = el("img");
    img.src = frame.src;
    img.alt = frame.alt;
    img.decoding = "async";
    tile.appendChild(img);
    stage.appendChild(tile);
    return tile;
  });

  if (prefersReducedMotion()) {
    tiles.forEach((t) => (t.style.opacity = "1"));
    return stage;
  }

  const land = easing("ease-land", "ease-out");
  let last: Animation | undefined;
  for (let i = 0; i < tiles.length; i++) {
    last = tiles[i].animate(
      [
        { opacity: 0, transform: "scale(1.35)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      { duration: 360, easing: land, fill: "forwards" },
    );
    // Accelerate: 170ms between the first photos, down to 35ms at the end.
    await wait(Math.max(35, 170 * 0.88 ** i), opts.signal);
  }
  await finished(last);
  throwIfAborted(opts.signal);
  await wait(350, opts.signal);
  return stage;
}
