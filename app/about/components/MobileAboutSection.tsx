"use client";

import type { BoardItem } from "../types";
import type { MobileSection } from "../lib/groupAboutItemsForMobile";
import MobileAboutItem from "./MobileAboutItem";

export default function MobileAboutSection(params: {
  section: MobileSection;
  onItemOpen: (id: string) => void;
  overlayItemId: string | null;
}) {
  const { section, onItemOpen, overlayItemId } = params;

  return (
    <section className="mobile-about-section" aria-labelledby={`mobile-sec-${section.category}`}>
      <h2 id={`mobile-sec-${section.category}`} className="mobile-about-section__title">
        {section.label}
      </h2>
      <div className="mobile-about-section__items">
        {section.items.map((item: BoardItem) => (
          <MobileAboutItem
            key={item.id}
            item={item}
            onOpen={onItemOpen}
            overlayOpen={overlayItemId != null}
            isSourceOfOpenOverlay={overlayItemId === item.id}
          />
        ))}
      </div>
    </section>
  );
}
