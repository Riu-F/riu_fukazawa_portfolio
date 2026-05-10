"use client";

import type { BoardItem } from "../types";
import { firstVisibleImage } from "../lib/mobileAboutHero";
import {
  AboutDescriptionLead,
  AboutDetailBody,
  MOBILE_ABOUT_TEXT_CLASSES,
} from "./aboutSharedContent";

/**
 * Static mobile block: first visible asset only, title, full text. No tap / reveal.
 */
export default function MobileAboutItem({ item }: { item: BoardItem }) {
  const tc = MOBILE_ABOUT_TEXT_CLASSES;
  const title = item.title ?? item.id;
  const hero = firstVisibleImage(item);

  if (item.type === "placeholderObject") {
    const fb = item.boardFallback ?? "emoji";
    const showTitleMedia = fb === "title";
    return (
      <article className="mobile-about-item">
        <div
          className={
            showTitleMedia
              ? "mobile-about-item__media mobile-about-item__media--fallback-title"
              : "mobile-about-item__media mobile-about-item__media--emoji"
          }
          aria-hidden
        >
          {showTitleMedia ? (
            <span className="mobile-about-item__fallback-title">{title}</span>
          ) : (
            <span className="mobile-about-item__emoji-only">{item.placeholderEmoji ?? "◆"}</span>
          )}
        </div>
        <h3 className="mobile-about-item__title">{title}</h3>
        <div className="mobile-about-item__copy">
          <AboutDescriptionLead
            description={item.description}
            linkClass={tc.link}
            className="mobile-about__lead"
          />
          <AboutDetailBody detailBody={item.detailBody} classNames={tc} />
        </div>
      </article>
    );
  }

  if (item.type === "photoStackObject" || item.type === "stickerObject" || item.type === "polaroidObject") {
    return (
      <article className="mobile-about-item">
        {hero ? (
          <div className="mobile-about-item__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.src}
              alt={hero.alt || title}
              className="mobile-about-item__img"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        ) : null}
        <h3 className="mobile-about-item__title">{title}</h3>
        <div className="mobile-about-item__copy">
          <AboutDescriptionLead
            description={item.description}
            linkClass={tc.link}
            className="mobile-about__lead"
          />
          <AboutDetailBody detailBody={item.detailBody} classNames={tc} />
        </div>
      </article>
    );
  }

  return null;
}
