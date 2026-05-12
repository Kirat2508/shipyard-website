"""One-off / repeatable: edge flood-fill background removal for hero PNG."""
from __future__ import annotations

import collections
import sys
from pathlib import Path

from PIL import Image


def is_background(r: int, g: int, b: int) -> bool:
    mx, mn = max(r, g, b), min(r, g, b)
    spread = mx - mn
    lum = (r + g + b) / 3.0
    # Near-white / light neutral (typical studio backdrop)
    if lum >= 249 and spread <= 18:
        return True
    if lum >= 244 and spread <= 12:
        return True
    if r >= 252 and g >= 252 and b >= 248:
        return True
    # Magenta/purple export artifact band (not neutral gray)
    if spread >= 42 and r >= 115 and g <= 98 and b <= 105:
        return True
    return False


def flood_transparent(im: Image.Image) -> Image.Image:
    w, h = im.size
    px = im.load()
    visited = [[False] * w for _ in range(h)]
    q: collections.deque[tuple[int, int]] = collections.deque()

    def try_seed(x: int, y: int) -> None:
        if not (0 <= x < w and 0 <= y < h) or visited[y][x]:
            return
        r, g, b, _a = px[x, y]
        if not is_background(r, g, b):
            return
        visited[y][x] = True
        q.append((x, y))

    for x in range(w):
        try_seed(x, 0)
        try_seed(x, h - 1)
    for y in range(h):
        try_seed(0, y)
        try_seed(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, _a = px[x, y]
        px[x, y] = (r, g, b, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                r2, g2, b2, _a2 = px[nx, ny]
                if is_background(r2, g2, b2):
                    visited[ny][nx] = True
                    q.append((nx, ny))
    return im


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    src = Path(
        sys.argv[1]
        if len(sys.argv) > 1
        else "/Users/harkiratsingh/.cursor/projects/Users-harkiratsingh-shipyard-website/assets/image-5fffb948-5a45-48c1-a5a4-f751eff35cf9.png"
    )
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else root / "public/images/hero-image/hero_shipyard_drone.png"
    im = Image.open(src).convert("RGBA")
    flood_transparent(im)
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, "PNG", optimize=True)
    print(f"Wrote {dst} ({im.size[0]}×{im.size[1]})")


if __name__ == "__main__":
    main()
