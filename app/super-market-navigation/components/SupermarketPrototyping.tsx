import { getPublicFolderGalleryImages } from '@/lib/publicFolderGallery';

import {
  PrototypingSectionClient,
  type PrototypingGalleryBundle,
} from './prototyping/PrototypingSectionClient';

function loadPrototypingGalleries(): PrototypingGalleryBundle {
  return {
    sketches: getPublicFolderGalleryImages(
      'super-market-navigation/prototyping/digital/sketches',
      'Digital sketch',
    ),
    wireframes: getPublicFolderGalleryImages(
      'super-market-navigation/prototyping/digital/wireframes',
      'Wireframe',
    ),
    mockups: getPublicFolderGalleryImages(
      'super-market-navigation/prototyping/digital/mockups',
      'Mockup',
    ),
    hifi: getPublicFolderGalleryImages(
      'super-market-navigation/prototyping/digital/hifi',
      'Hi-fi screen',
    ),
    spatial: getPublicFolderGalleryImages(
      'super-market-navigation/prototyping/spatial',
      'Spatial prototype',
    ),
    physical: getPublicFolderGalleryImages(
      'super-market-navigation/prototyping/physical',
      'Physical prototype',
    ),
  };
}

export default function SupermarketPrototyping() {
  const galleries = loadPrototypingGalleries();

  return (
    <section id="smp-section-prototyping" className="default-section">
      <div className="default-container w-container">
        <div className="grid---left-flex-horizontal h3-headings" />
        <h2 className="h2">Prototyping</h2>
        <p className="paragraph-new">
          We developed prototypes across three spaces: digital, spatial, and physical. Each one tested
          different aspects of the concept, from screen-level interaction design through to how someone would
          physically move through a store with the app guiding them.
        </p>
        <PrototypingSectionClient galleries={galleries} />
      </div>
    </section>
  );
}
