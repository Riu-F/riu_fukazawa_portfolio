/*
  Desk section — side projects as objects on the workspace surface.
  Add PNGs under public/desk-items/ and reference them via `icon`.
*/

export interface DeskItem {
  id: string;
  label: string;
  category: string;
  /** Path under public/, e.g. /desk-items/koi-pond/koi-fish-pixel.png */
  icon: string;
  position: { x: number; y: number };
  rotation: number;
  description?: string;
  link?: string;
  internalRoute?: string;
  /** Expanded panel shows interactive pond instead of text. */
  expandPond?: boolean;
  mobileOffset?: { x: number; rotate: number };
}

export const DESK_ITEMS: DeskItem[] = [
  {
    id:             'koi-pond',
    label:          'Koi Pond',
    category:       'art',
    icon:           '/desk-items/koi-pond/koi-fish-pixel.png',
    position:       { x: 50, y: 48 },
    rotation:       -4,
    description:
      'A pixel-art koi pond rebuilt as an interactive canvas — click the water, feed the fish, watch them scatter.',
    internalRoute:  '/404',
    expandPond:     true,
    mobileOffset:   { x: 0, rotate: -3 },
  },
];
