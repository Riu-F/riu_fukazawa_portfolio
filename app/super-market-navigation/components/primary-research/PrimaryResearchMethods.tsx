import { getPublicFolderGalleryImages } from '@/lib/publicFolderGallery';

import { PrimaryResearchMethodsClient } from './PrimaryResearchMethodsClient';

export function PrimaryResearchMethods() {
  const observationImages = getPublicFolderGalleryImages(
    'super-market-navigation/research/observations',
    'Observation',
  );
  const interviewImages = getPublicFolderGalleryImages(
    'super-market-navigation/research/interviews',
    'Interview transcript',
  );
  const surveyImages = getPublicFolderGalleryImages(
    'super-market-navigation/research/surveys',
    'Survey result',
  );

  return (
    <PrimaryResearchMethodsClient
      observationImages={observationImages}
      interviewImages={interviewImages}
      surveyImages={surveyImages}
    />
  );
}

