#!/usr/bin/env python3
"""Labelled PNG placeholders for supermarket user-testing section."""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent / "public" / "super-market-navigation" / "user-testing"
SIZE = (800, 450)


def _font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in (
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ):
        if os.path.isfile(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default()


def make(rel: str, label: str, bg: tuple[int, int, int]) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", SIZE, bg)
    draw = ImageDraw.Draw(img)
    font = _font(24)
    w, h = SIZE
    lum = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]
    fill = (255, 255, 255) if lum < 160 else (17, 17, 17)
    bbox = draw.textbbox((0, 0), label, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((w - tw) / 2, (h - th) / 2), label, fill=fill, font=font)
    img.save(path, "PNG")
    print("wrote", path.relative_to(ROOT.parent.parent.parent))


def main() -> None:
    for i in range(1, 4):
        make(f"r1/testing-r1-{i:02d}.png", f"testing-r1-{i:02d}.png", (224, 242, 254))
    for i in range(1, 5):
        make(f"r2/testing-r2-{i:02d}.png", f"testing-r2-{i:02d}.png", (237, 233, 254))
    for i in range(1, 5):
        make(f"r3/gallery/testing-r3-{i:02d}.png", f"testing-r3-{i:02d}.png", (254, 243, 199))
    make("r3/comparison/testing-r3-compass.png", "testing-r3-compass.png", (191, 219, 254))
    make("r3/comparison/testing-r3-map.png", "testing-r3-map.png", (165, 243, 252))
    make("r3/comparison/testing-r3-basket-with.png", "testing-r3-basket-with.png", (254, 202, 202))
    make("r3/comparison/testing-r3-basket-without.png", "testing-r3-basket-without.png", (209, 250, 229))


if __name__ == "__main__":
    main()
