"use client";

import { useMemo, useState } from "react";
import type { BoardItem } from "../types";
import { AboutIntroBody, AboutIntroChip, AboutIntroHeading } from "../content/aboutIntroContent";
import { groupItemsForMobileLayout } from "../lib/groupAboutItemsForMobile";
import MobileAboutOverlay from "./MobileAboutOverlay";
import MobileAboutSection from "./MobileAboutSection";

export default function MobileAboutBoard({ items }: { items: BoardItem[] }) {
  const { sections } = groupItemsForMobileLayout(items);
  const [overlayItemId, setOverlayItemId] = useState<string | null>(null);

  const overlayItem = useMemo(
    () => (overlayItemId ? items.find((i) => i.id === overlayItemId) ?? null : null),
    [items, overlayItemId],
  );

  return (
    <div className={`mobile-about${overlayItemId ? " mobile-about--overlay-open" : ""}`}>
      <header className="mobile-about__intro">
        <p className="mobile-about__chip">
          <AboutIntroChip />
        </p>
        <h1 className="mobile-about__h1">
          <AboutIntroHeading />
        </h1>
        <p className="mobile-about__intro-p">
          <AboutIntroBody />
        </p>
      </header>

      {sections.map((section) => (
        <MobileAboutSection
          key={section.category}
          section={section}
          onItemOpen={setOverlayItemId}
          overlayItemId={overlayItemId}
        />
      ))}

      {overlayItem ? <MobileAboutOverlay item={overlayItem} onClose={() => setOverlayItemId(null)} /> : null}
    </div>
  );
}
