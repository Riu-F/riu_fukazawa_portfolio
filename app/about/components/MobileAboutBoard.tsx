"use client";

import type { BoardItem } from "../types";
import { AboutIntroBody, AboutIntroChip, AboutIntroHeading } from "../content/aboutIntroContent";
import { groupItemsForMobileLayout } from "../lib/groupAboutItemsForMobile";
import MobileAboutSection from "./MobileAboutSection";

export default function MobileAboutBoard({ items }: { items: BoardItem[] }) {
  const { sections } = groupItemsForMobileLayout(items);

  return (
    <div className="mobile-about">
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
        <MobileAboutSection key={section.category} section={section} />
      ))}
    </div>
  );
}
