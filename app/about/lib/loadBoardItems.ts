import fs from "fs/promises";
import path from "path";
import type { BoardItem, BoardItemType, BoardStackImage } from "../types";
import { dedupeStackImagesPreserveOrder, mergeVisibleAndRevealedStacks } from "./dedupeStackImages";

/** Case-insensitive match for common raster/vector extensions */
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|bmp|avif)$/i;

type LayoutEntry = {
  id: string;
  type?: string;
  x: number;
  y: number;
  focusZoom?: number;
};

type LayoutFile = {
  items: LayoutEntry[];
};

type MetaKind =
  | "emoji"
  | "stickerReveal"
  | "polaroidReveal"
  | "stackReveal"
  | "polaroidStackReveal";

type MetaJson = {
  id: string;
  category?: string;
  title?: string;
  description?: string;
  detailBody?: string;
  hoverAside?: string;
  kind?: MetaKind;
  emoji?: string;
  /** Override auto-detected presentation for stack kinds */
  stackPresentation?: "stack" | "sticker" | "polaroid";
  focusZoom?: number;
  interactive?: boolean;
};

async function walkMetaJsonFiles(rootDir: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(dir: string) {
    let entries: import("fs").Dirent[];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.name === "meta.json") out.push(p);
    }
  }
  await walk(rootDir);
  return out;
}

async function listImageUrls(itemDir: string, sub: "visible" | "revealed"): Promise<string[]> {
  const dir = path.join(itemDir, sub);
  let names: string[];
  try {
    names = await fs.readdir(dir);
  } catch {
    return [];
  }
  const files = names
    .filter((n) => IMAGE_EXT.test(n))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  const relFromPublic = path.relative(path.join(process.cwd(), "public"), dir);
  return files.map((f) => `/${relFromPublic.split(path.sep).join("/")}/${f}`);
}

function toStackImages(urls: string[]): BoardStackImage[] {
  return dedupeStackImagesPreserveOrder(urls.map((src) => ({ src, alt: "" })));
}

function boardTypeFromKind(
  kind: MetaKind,
  meta: MetaJson,
): { type: BoardItemType; stackPresentation?: "stack" | "sticker" | "polaroid" } {
  if (kind === "emoji") return { type: "placeholderObject" };
  if (kind === "stickerReveal") {
    return { type: "photoStackObject", stackPresentation: "sticker" };
  }
  if (kind === "polaroidReveal") {
    return { type: "photoStackObject", stackPresentation: "polaroid" };
  }
  if (kind === "polaroidStackReveal") {
    return {
      type: "photoStackObject",
      stackPresentation: meta.stackPresentation ?? "polaroid",
    };
  }
  return {
    type: "photoStackObject",
    stackPresentation: meta.stackPresentation ?? "stack",
  };
}

async function readMetaMap(itemsRoot: string): Promise<Map<string, { dir: string; meta: MetaJson }>> {
  const map = new Map<string, { dir: string; meta: MetaJson }>();
  const files = await walkMetaJsonFiles(itemsRoot);
  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const meta = JSON.parse(raw) as MetaJson;
    if (!meta?.id) continue;
    map.set(meta.id, { dir: path.dirname(file), meta });
  }
  return map;
}

function pushTitleOrEmojiPlaceholder(
  out: BoardItem[],
  meta: MetaJson,
  entry: LayoutEntry,
): void {
  const hasTitle = Boolean(meta.title?.trim());
  out.push({
    id: meta.id,
    type: "placeholderObject",
    x: entry.x,
    y: entry.y,
    title: meta.title,
    category: meta.category,
    description: meta.description,
    detailBody: meta.detailBody,
    hoverAside: meta.hoverAside,
    boardFallback: hasTitle ? "title" : "emoji",
    placeholderEmoji: meta.emoji ?? "◆",
    focusZoom: meta.focusZoom ?? entry.focusZoom ?? 1.12,
    interactive: meta.interactive !== false,
  });
}

export async function loadAboutBoardItems(): Promise<BoardItem[]> {
  const publicRoot = path.join(process.cwd(), "public", "about");
  const layoutPath = path.join(publicRoot, "board-layout.json");
  const layoutRaw = await fs.readFile(layoutPath, "utf8");
  const layout = JSON.parse(layoutRaw) as LayoutFile;

  const itemsRoot = path.join(publicRoot, "items");
  const metaById = await readMetaMap(itemsRoot);

  const out: BoardItem[] = [];

  for (const entry of layout.items) {
    if (entry.type === "instructionCard") {
      out.push({
        id: entry.id,
        type: "instructionCard",
        x: entry.x,
        y: entry.y,
        interactive: false,
      });
      continue;
    }

    const resolved = metaById.get(entry.id);
    if (!resolved) {
      // eslint-disable-next-line no-console
      console.warn(`[about] No meta.json for board item id "${entry.id}"`);
      continue;
    }

    const { dir, meta } = resolved;
    const declaredKind: MetaKind = meta.kind ?? "stackReveal";

    const rawVisible = await listImageUrls(dir, "visible");
    const revealed = await listImageUrls(dir, "revealed");

    /** Image-first: declared `emoji` still becomes a stack when real files exist in `visible/`. */
    let effectiveKind: MetaKind = declaredKind;
    if (declaredKind === "emoji" && rawVisible.length > 0) {
      effectiveKind = "stickerReveal";
    }

    if (rawVisible.length === 0) {
      pushTitleOrEmojiPlaceholder(out, meta, entry);
      continue;
    }

    const visibleImagesBase = toStackImages(rawVisible);
    const revealedImagesBase = toStackImages(revealed);
    const { visible: visibleImages, revealed: revealedImages } = mergeVisibleAndRevealedStacks(
      visibleImagesBase,
      revealedImagesBase,
    );

    const { type, stackPresentation } = boardTypeFromKind(effectiveKind, meta);

    let framingSize: { width: number; height: number } | undefined;
    if (stackPresentation === "sticker") {
      framingSize = { width: 200, height: 220 };
    } else if (stackPresentation === "polaroid") {
      framingSize = { width: 320, height: 340 };
    } else {
      framingSize = { width: 280, height: 320 };
    }

    out.push({
      id: meta.id,
      type,
      x: entry.x,
      y: entry.y,
      title: meta.title,
      category: meta.category,
      description: meta.description,
      detailBody: meta.detailBody,
      hoverAside: meta.hoverAside,
      stackVisibleImages: visibleImages,
      revealedImages,
      stackPresentation,
      focusZoom: meta.focusZoom ?? entry.focusZoom ?? 1.18,
      framingSize,
      interactive: meta.interactive !== false,
    });
  }

  return out;
}
