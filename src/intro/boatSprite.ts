/**
 * The intro's little ship: ember hull, lime mainsail, white jib, ink outlines.
 * Inline SVG so it inherits nothing and stays crisp; drawn on a 40×36 grid.
 */
export function boatSpriteSVG(): string {
  return `<svg viewBox="0 0 40 36" aria-hidden="true" fill="none" stroke="#111111" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
  <path d="M20 3 V25"/>
  <path d="M20 3 L26 5 L20 7 Z" fill="#ff5a1f"/>
  <path d="M21.5 7 L21.5 23 L33 23 Z" fill="#d4ff3a"/>
  <path d="M18.5 9 L18.5 23 L9 23 Z" fill="#ffffff"/>
  <path d="M3 25 H37 L32 33 H8 Z" fill="#ff5a1f"/>
  <path d="M12 29 H28" stroke-width="1.2"/>
</svg>`;
}
