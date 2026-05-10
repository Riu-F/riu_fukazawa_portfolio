#!/usr/bin/env python3
"""One-off: labelled PNG placeholders for supermarket prototyping section."""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent / "public" / "super-market-navigation" / "prototyping"
SIZE_HERO = (960, 540)
SIZE_GALLERY = (800, 450)


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


def make_png(
    rel_path: str,
    label: str,
    bg: tuple[int, int, int],
    size: tuple[int, int] = SIZE_GALLERY,
) -> None:
    path = ROOT / rel_path
    path.parent.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", size, bg)
    draw = ImageDraw.Draw(img)
    font = _font(28 if size == SIZE_HERO else 24)
    w, h = size
    luminance = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]
    fill = (255, 255, 255) if luminance < 160 else (17, 17, 17)
    bbox = draw.textbbox((0, 0), label, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((w - tw) / 2, (h - th) / 2), label, fill=fill, font=font)
    img.save(path, "PNG")
    print("wrote", path.relative_to(ROOT.parent.parent.parent))


def main() -> None:
    # Heroes
    make_png("heroes/proto-hero-digital.png", "proto-hero-digital.png", (37, 99, 235), SIZE_HERO)
    make_png("heroes/proto-hero-spatial.png", "proto-hero-spatial.png", (13, 148, 136), SIZE_HERO)
    make_png("heroes/proto-hero-physical.png", "proto-hero-physical.png", (217, 119, 6), SIZE_HERO)

    for i in range(1, 5):
        make_png(f"digital/sketches/proto-sketch-{i:02d}.png", f"proto-sketch-{i:02d}.png", (229, 231, 235))
    for i in range(1, 5):
        make_png(
            f"digital/wireframes/proto-wireframe-{i:02d}.png",
            f"proto-wireframe-{i:02d}.png",
            (209, 213, 219),
        )
    for i in range(1, 4):
        make_png(f"digital/mockups/proto-mockup-{i:02d}.png", f"proto-mockup-{i:02d}.png", (199, 210, 254))
    for i in range(1, 5):
        make_png(f"digital/hifi/proto-hifi-{i:02d}.png", f"proto-hifi-{i:02d}.png", (233, 213, 255))

    for i in range(1, 4):
        make_png(f"spatial/proto-spatial-{i:02d}.png", f"proto-spatial-{i:02d}.png", (204, 251, 241))
    for i in range(1, 4):
        make_png(f"physical/proto-physical-{i:02d}.png", f"proto-physical-{i:02d}.png", (254, 243, 199))


if __name__ == "__main__":
    main()
