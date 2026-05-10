import { PublicFolderLightboxGallery } from '@/app/components/gallery';

export default function SupermarketAffinityDiagramming() {
  return (
    <section id="smp-section-affinity-diagramming" className="default-section">
      <div className="default-container w-container">
        <h2 className="h2">Affinity Diagramming</h2>
        <p className="paragraph-new">
          By the end of our research phase, we had three weeks&apos; worth of data from four team members
          running interviews, surveys, observations, and ethnographic analysis in parallel. That&apos;s a lot of
          raw material. We needed a way to make sense of it all and turn it into something we could actually
          design from.
        </p>
        <p className="paragraph-new">
          Our tool of choice was affinity diagramming. We started at a whiteboard and turned each piece of
          primary research into an individual data point: a finding, a quote, a behaviour, an observation.
          Then we grouped those points by similarity, iterating until roughly eight themes emerged. These
          themes centred around pain points, disability-specific experiences, and behavioural patterns our
          participants had described. The three insights that follow were distilled directly from these
          themes.
        </p>
        <PublicFolderLightboxGallery
          folder="super-market-navigation/affinity"
          groupAriaLabel="Affinity diagram thumbnails"
          lightboxAriaLabel="Affinity diagram photo"
          imageAltPrefix="Affinity diagram"
        />
      </div>
    </section>
  );
}
