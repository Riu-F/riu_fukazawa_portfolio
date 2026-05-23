import { getPublicFolderGalleryImages } from '@/lib/publicFolderGallery';

import AiProblemClient from './AiProblemClient';

export default function AiProblem() {
  const bookingScreenshots = getPublicFolderGalleryImages(
    'Ai-Design/old-booking-sysyems',
    'Booking confirmation screenshot',
  );

  return <AiProblemClient bookingScreenshots={bookingScreenshots} />;
}
