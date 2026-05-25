'use client';

import { useState } from 'react';

type SuedeEventCardMediaProps = {
  src: string;
  alt: string;
  placeholderLabel: string;
  /** Server-side check at build; client onError covers dev hot-adds. */
  imageAvailable: boolean;
};

export function SuedeEventCardMedia({
  src,
  alt,
  placeholderLabel,
  imageAvailable,
}: SuedeEventCardMediaProps) {
  const [failed, setFailed] = useState(!imageAvailable);

  if (failed) {
    return (
      <div className="suede-events__media suede-events__media--placeholder">
        <span className="suede-events__media-placeholder-text">{placeholderLabel}</span>
      </div>
    );
  }

  return (
    <div className="suede-events__media">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="suede-events__media-img"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
