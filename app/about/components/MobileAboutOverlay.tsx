"use client";

import { useEffect } from "react";
import type { BoardItem } from "../types";
import {
  AboutDescriptionLead,
  AboutDetailBody,
  MOBILE_ABOUT_TEXT_CLASSES,
} from "./aboutSharedContent";
import { categorySectionLabel } from "../lib/groupAboutItemsForMobile";

export default function MobileAboutOverlay(params: {
  item: BoardItem;
  onClose: () => void;
}) {
  const { item, onClose } = params;
  const tc = MOBILE_ABOUT_TEXT_CLASSES;
  const title = item.title ?? item.id;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="mobile-about-overlay" role="dialog" aria-modal="true" aria-labelledby="mobile-about-overlay-title">
      <button type="button" className="mobile-about-overlay__backdrop" aria-label="Dismiss" onClick={onClose} />
      <div className="mobile-about-overlay__panel">
        <button type="button" className="mobile-about-overlay__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {item.category ? (
          <p className="mobile-about-overlay__category">
            {item.category === "_other" ? "More" : categorySectionLabel(item.category)}
          </p>
        ) : null}
        <h2 id="mobile-about-overlay-title" className="mobile-about-overlay__title">
          {title}
        </h2>
        <div className="mobile-about-overlay__scroll">
          <AboutDescriptionLead
            description={item.description}
            linkClass={tc.link}
            className="mobile-about__lead"
          />
          <AboutDetailBody detailBody={item.detailBody} classNames={tc} />
        </div>
      </div>
    </div>
  );
}
