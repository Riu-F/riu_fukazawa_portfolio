#!/usr/bin/env python3
"""Labelled PNG placeholders for supermarket research section galleries."""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = (
    Path(__file__).resolve().parent.parent
    / "public"
    / "super-market-navigation"
    / "research"
    / "observations"
)
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


def make(filename: str, bg: tuple[int, int, int]) -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    path = ROOT / filename
    img = Image.new("RGB", SIZE, bg)
    draw = ImageDraw.Draw(img)
    font = _font(24)
    w, h = SIZE
    lum = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]
    fill = (255, 255, 255) if lum < 160 else (17, 17, 17)
    bbox = draw.textbbox((0, 0), filename, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((w - tw) / 2, (h - th) / 2), filename, fill=fill, font=font)
    img.save(path, "PNG")
    print("wrote", path)


def main() -> None:
    for i in range(1, 4):
        make(f"research-obs-{i:02d}.png", (209, 250, 229))


if __name__ == "__main__":
    main()

