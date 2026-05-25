'use client';

import { useState } from 'react';

type SuedeDesignathonHeroProps = {
  src: string;
  imageAvailable: boolean;
};

export function SuedeDesignathonHero({ src, imageAvailable }: SuedeDesignathonHeroProps) {
  const [failed, setFailed] = useState(!imageAvailable);

  return (
    <div
      className={`suede-designathon__hero${failed ? ' suede-designathon__hero--placeholder' : ''}`}
    >
      {!failed ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="SUEDE Designathon 2025"
            className="suede-designathon__hero-img"
            loading="eager"
            decoding="async"
            onError={() => setFailed(true)}
          />
          <div className="suede-designathon__hero-overlay" aria-hidden="true" />
        </>
      ) : (
        <span className="suede-designathon__hero-placeholder-text">Designathon</span>
      )}
    </div>
  );
}
