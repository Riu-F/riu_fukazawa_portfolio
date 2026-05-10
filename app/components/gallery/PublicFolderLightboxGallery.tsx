import { getPublicFolderGalleryImages } from '@/lib/publicFolderGallery';

import {
  PublicFolderLightboxGalleryClient,
  type PublicFolderLightboxGalleryClientProps,
} from './PublicFolderLightboxGalleryClient';

export type PublicFolderLightboxGalleryProps = {
  /**
   * Path under `public/` without leading slash, e.g. `super-market-navigation/affinity`.
   * All image files in that folder are shown; add/remove/replace files on disk only.
   */
  folder: string;
  groupAriaLabel: PublicFolderLightboxGalleryClientProps['groupAriaLabel'];
  lightboxAriaLabel?: PublicFolderLightboxGalleryClientProps['lightboxAriaLabel'];
  /** Prepended to each image alt for context (e.g. "Affinity diagram"). */
  imageAltPrefix?: string;
};

/**
 * Server component: reads `public/<folder>/` at render time and passes file list to the client lightbox.
 * Supported extensions: .png, .jpg, .jpeg, .svg, .webp. Other files are ignored.
 */
export function PublicFolderLightboxGallery({
  folder,
  groupAriaLabel,
  lightboxAriaLabel,
  imageAltPrefix,
}: PublicFolderLightboxGalleryProps) {
  const images = getPublicFolderGalleryImages(folder, imageAltPrefix);

  return (
    <PublicFolderLightboxGalleryClient
      images={images}
      groupAriaLabel={groupAriaLabel}
      lightboxAriaLabel={lightboxAriaLabel}
    />
  );
}
