import { getPublicFolderGalleryImages } from '@/lib/publicFolderGallery';

import { PrimaryResearchMethodsClient } from './PrimaryResearchMethodsClient';

export function PrimaryResearchMethods() {
  const observationImages = getPublicFolderGalleryImages(
    'super-market-navigation/research/observations',
    'Observation',
  );

  return <PrimaryResearchMethodsClient observationImages={observationImages} />;
}

