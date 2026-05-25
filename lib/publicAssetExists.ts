import 'server-only';

import fs from 'fs';
import path from 'path';

/**
 * Returns true if a file exists under `public/` (path with or without leading slash).
 */
export function publicAssetExists(publicPath: string): boolean {
  const normalized = publicPath.replace(/^\/+/, '').replace(/\\/g, '/');
  if (!normalized || normalized.includes('..')) return false;

  const abs = path.join(process.cwd(), 'public', ...normalized.split('/'));
  try {
    return fs.existsSync(abs) && fs.statSync(abs).isFile();
  } catch {
    return false;
  }
}
