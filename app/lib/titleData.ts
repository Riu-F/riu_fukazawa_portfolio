/*
  Static data for the cycling title.
  No browser APIs here — safe to import in server or client components.
*/

export interface FontDef {
  family: string;
  style: 'italic' | 'normal';
  weight: number;
}

export const TAGLINES: string[] = [
  'Curious by nature,\nstrategic by design.',
  'Big picture thinker,\ndetail-oriented builder.',
  'Design + Front-End,\nend-to-end thinking.',
  'Designing experiences,\nbuilding them too.',
  'Systems thinker,\nexperience designer.',
];

export const FONTS: FontDef[] = [
  { family: 'Playfair Display',  style: 'italic', weight: 900 },
  { family: 'DM Serif Display',  style: 'italic', weight: 400 },
  { family: 'Libre Baskerville', style: 'italic', weight: 700 },
  { family: 'Merriweather',      style: 'italic', weight: 900 },
  { family: 'Lora',              style: 'italic', weight: 700 },
  { family: 'Zilla Slab',        style: 'italic', weight: 700 },
  { family: 'Fraunces',          style: 'italic', weight: 900 },
  { family: 'DM Sans',           style: 'normal', weight: 700 },
  { family: 'Outfit',            style: 'normal', weight: 700 },
  { family: 'Unbounded',         style: 'normal', weight: 700 },
  { family: 'Syne',              style: 'normal', weight: 700 },
  { family: 'Archivo Black',     style: 'normal', weight: 400 },
];

/*
  Cap-height normalisation constants.
  PROBE_PX  — font-size used for off-screen measurement.
  TARGET_VH — fraction of viewport height the cap-height should fill.
*/
export const PROBE_PX  = 300;
export const TARGET_VH = 0.50; // 50% of viewport height
