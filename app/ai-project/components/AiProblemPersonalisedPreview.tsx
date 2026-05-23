'use client';

import CheckoutOutput from './CheckoutOutput';
import { getMockCheckout } from './ai-checkout-mock';
import { getBannerForPersona } from '../lib/checkout-banners';

/** Static Dewi checkout preview for the problem section solution block. */
export default function AiProblemPersonalisedPreview() {
  return (
    <CheckoutOutput
      checkout={getMockCheckout('dewi')}
      bannerSrc={getBannerForPersona('dewi')}
    />
  );
}
