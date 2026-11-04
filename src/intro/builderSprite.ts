/**
 * The intro's pixel-art builder: lime hard hat, ember shirt, two walking frames.
 * An original 12×15 sprite drawn as SVG rects so it stays crisp at any size.
 */
const PALETTE: Record<string, string> = {
  o: "#111111", // outline, eyes, boots
  H: "#d4ff3a", // hard hat
  S: "#e2a47c", // skin
  T: "#ff5a1f", // shirt
  P: "#2b2b30", // trousers
  W: "#f5f5f7", // hat highlight
};

const BODY = [
  "....oooo....",
  "...oHHWHo...",
  "..oHHHHHHo..",
  ".oooooooooo.",
  "...SSSSSS...",
  "...SoSSoS...",
  "...SSSSSS...",
  "..TTTTTTTT..",
  ".STTTTTTTTS.",
  ".STTTTTTTTS.",
  "..TTTTTTTT..",
  "..PPPPPPPP..",
];

const LEGS_A = ["..PPP..PPP..", ".PP......PP.", ".oo......oo."];
const LEGS_B = ["...PPPPPP...", "....PPPP....", "....oooo...."];

function rects(rows: string[], offsetY: number): string {
  let out = "";
  rows.forEach((row, y) => {
    Array.from(row).forEach((c, x) => {
      const fill = PALETTE[c];
      if (fill) out += `<rect x="${x}" y="${y + offsetY}" width="1" height="1" fill="${fill}"/>`;
    });
  });
  return out;
}

/** Returns the sprite markup; toggle `.is-step` on its parent to swap walking frames. */
export function builderSpriteSVG(): string {
  return (
    `<svg viewBox="0 0 12 15" shape-rendering="crispEdges" aria-hidden="true">` +
    rects(BODY, 0) +
    `<g class="sy-walker__legs-a">${rects(LEGS_A, BODY.length)}</g>` +
    `<g class="sy-walker__legs-b">${rects(LEGS_B, BODY.length)}</g>` +
    `</svg>`
  );
}
