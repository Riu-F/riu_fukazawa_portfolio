import { getPublicFolderGalleryImages } from '@/lib/publicFolderGallery';

import { InsightTag } from './InsightTag';
import { UserTestingSectionClient } from './user-testing/UserTestingSectionClient';

export default function SupermarketUserTesting() {
  const galleries = {
    round1: getPublicFolderGalleryImages(
      'super-market-navigation/user-testing/r1',
      'Round 1 testing',
    ),
    round2: getPublicFolderGalleryImages(
      'super-market-navigation/user-testing/r2',
      'Round 2 testing',
    ),
    round3Gallery: getPublicFolderGalleryImages(
      'super-market-navigation/user-testing/r3/gallery',
      'Round 3 testing',
    ),
  };

  return (
    <section className="default-section ut-section">
      <div className="default-container w-container">
        <div className="grid---left-flex-horizontal h3-headings" />
        <h2 className="h2">User Testing</h2>
        <p className="paragraph-new ut-section__intro">
          We ran three rounds of user testing, each building on the last. Every round was measured against
          our three core insights so we could track whether the design was actually solving the problems
          we&apos;d identified, not just whether it was usable.{' '}
          <InsightTag insight="navigation" />
          <InsightTag insight="communication" />
          <InsightTag insight="distraction" />
        </p>
        <UserTestingSectionClient galleries={galleries} />
      </div>
    </section>
  );
}
