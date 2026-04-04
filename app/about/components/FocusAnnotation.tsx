"use client";

import type { CSSProperties, RefObject } from "react";
import type { BoardItem } from "../types";
import {
  AboutDescriptionLead,
  AboutDetailBody,
  FOCUS_ANNOTATION_TEXT_CLASSES,
} from "./aboutSharedContent";

export default function FocusAnnotation(params: {
  item: BoardItem;
  onClose: () => void;
  style?: CSSProperties;
  rootRef?: RefObject<HTMLElement | null>;
}) {
  const { item, onClose, style, rootRef } = params;
  const tc = FOCUS_ANNOTATION_TEXT_CLASSES;

  return (
    <div
      ref={rootRef as RefObject<HTMLDivElement | null>}
      className="about-focus-annotation"
      style={style}
      data-about-focus-annotation="true"
      role="dialog"
      aria-label={`${item.title ?? item.id} — notes`}
      aria-modal="false"
    >
      <button
        type="button"
        className="about-focus-annotation__close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      {item.category && (
        <p className="about-focus-annotation__category">{item.category}</p>
      )}

      <h2 className="about-focus-annotation__title">{item.title ?? item.id}</h2>

      <AboutDescriptionLead
        description={item.description}
        linkClass={tc.link}
        className="about-focus-annotation__lead"
      />

      <AboutDetailBody detailBody={item.detailBody} classNames={tc} />
    </div>
  );
}
