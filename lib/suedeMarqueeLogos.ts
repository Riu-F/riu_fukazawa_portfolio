import {
  getPublicFolderGalleryImages,
  type PublicFolderGalleryImage,
} from './publicFolderGallery';

/** Preferred marquee order when filenames match (extras sort after, alphabetically). */
const SUEDE_LOGO_ORDER_KEYWORDS = [
  'microsoft',
  'atlassian',
  'macquarie',
  'deloitte',
  'ey',
  'ibm',
  'frog',
  'figma',
  'canva',
] as const;

function marqueeSortKey(src: string): number {
  const lower = src.toLowerCase();
  for (let i = 0; i < SUEDE_LOGO_ORDER_KEYWORDS.length; i++) {
    if (lower.includes(SUEDE_LOGO_ORDER_KEYWORDS[i])) return i;
  }
  return SUEDE_LOGO_ORDER_KEYWORDS.length;
}

/**
 * Partner logos from `public/desk-items/suede/logos/`, ordered for the intro marquee.
 * Missing files are skipped; new files appear after the known set in filename order.
 */
export function getSuedeMarqueeLogos(): PublicFolderGalleryImage[] {
  const images = getPublicFolderGalleryImages(
    'desk-items/suede/logos',
    'Partner logo',
  );

  return [...images].sort((a, b) => {
    const ka = marqueeSortKey(a.src);
    const kb = marqueeSortKey(b.src);
    if (ka !== kb) return ka - kb;
    return a.src.localeCompare(b.src, undefined, { numeric: true, sensitivity: 'base' });
  });
}
