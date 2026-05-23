/** Destination banner images under public/Ai-Design/banners/ */
export const CHECKOUT_BANNERS = {
  tokyo:   '/Ai-Design/banners/tokyo.png',
  kyoto:   '/Ai-Design/banners/kyoto.png',
  paris:   '/Ai-Design/banners/paris.png',
  japan:   '/Ai-Design/banners/japan.png',
  generic: '/Ai-Design/banners/generic.png',
} as const;

export function getBannerForDestination(destination: string): string {
  const dest = destination.toLowerCase();
  if (dest.includes('tokyo')) return CHECKOUT_BANNERS.tokyo;
  if (dest.includes('kyoto')) return CHECKOUT_BANNERS.kyoto;
  if (dest.includes('paris')) return CHECKOUT_BANNERS.paris;
  if (dest.includes('japan')) return CHECKOUT_BANNERS.japan;
  return CHECKOUT_BANNERS.generic;
}

export function getBannerForPersona(personaId: string): string {
  switch (personaId) {
    case 'dewi':
      return CHECKOUT_BANNERS.tokyo;
    case 'jordan':
      return CHECKOUT_BANNERS.kyoto;
    case 'harold':
      return CHECKOUT_BANNERS.paris;
    default:
      return CHECKOUT_BANNERS.generic;
  }
}
