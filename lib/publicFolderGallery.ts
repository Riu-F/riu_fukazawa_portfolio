import 'server-only';

import fs from 'fs';
import path from 'path';

/** Extensions treated as gallery images (lowercase, with dot). */
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.svg', '.webp']);

export type PublicFolderGalleryImage = {
  src: string;
  alt: string;
};

function normalizeFolderPath(folderPath: string): string {
  return folderPath.replace(/^\/+|\/+$/g, '').replace(/\\/g, '/');
}

function isSafePublicSubpath(normalized: string): boolean {
  if (!normalized || normalized.includes('..')) return false;
  const segments = normalized.split('/');
  return segments.every((s) => s.length > 0 && s !== '..');
}

function humanizeFilenameForAlt(filename: string): string {
  const base = path.basename(filename, path.extname(filename));
  const spaced = base.replace(/[-_]+/g, ' ').trim();
  return spaced || filename;
}

/**
 * Lists image files in `public/<folderPath>/` on the server (build or request time).
 * Non-image files (e.g. README.txt) are skipped. Sorted alphabetically with numeric awareness
 * (`affinity-2` before `affinity-10`).
 *
 * In production, the set of files is whatever exists at deploy/build time; add or replace files
 * locally, then redeploy (or restart dev) so the server picks them up.
 *
 * @param folderPath Path under `public/`, no leading slash — e.g. `super-market-navigation/affinity`
 * @param altPrefix Optional prefix for each image's `alt` text (e.g. "Affinity diagram")
 */
export function getPublicFolderGalleryImages(
  folderPath: string,
  altPrefix?: string,
): PublicFolderGalleryImage[] {
  const normalized = normalizeFolderPath(folderPath);
  if (!isSafePublicSubpath(normalized)) return [];

  const absDir = path.join(process.cwd(), 'public', ...normalized.split('/'));
  if (!fs.existsSync(absDir) || !fs.statSync(absDir).isDirectory()) {
    return [];
  }

  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  return files.map((filename) => {
    const human = humanizeFilenameForAlt(filename);
    const alt = altPrefix ? `${altPrefix}: ${human}` : human;
    return {
      src: `/${normalized}/${filename}`.replace(/\/+/g, '/'),
      alt,
    };
  });
}
