'use client';

import './public-folder-lightbox-gallery.css';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import type { PublicFolderGalleryImage } from '@/lib/publicFolderGallery';

export type PublicFolderLightboxGalleryClientProps = {
  images: PublicFolderGalleryImage[];
  /** e.g. "Affinity diagram thumbnails" */
  groupAriaLabel: string;
  /** e.g. "Affinity diagram photo" */
  lightboxAriaLabel?: string;
  layout?: 'grid' | 'horizontal';
};

export function PublicFolderLightboxGalleryClient({
  images,
  groupAriaLabel,
  lightboxAriaLabel = 'Gallery image',
  layout = 'grid',
}: PublicFolderLightboxGalleryClientProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const goPrev = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null || images.length < 2) return i;
      return (i - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const goNext = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null || images.length < 2) return i;
      return (i + 1) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (images.length > 1) {
        if (e.key === 'ArrowLeft') goPrev();
        if (e.key === 'ArrowRight') goNext();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, goPrev, goNext, images.length]);

  if (images.length === 0) {
    return null;
  }

  const open = openIndex !== null;
  const current = openIndex !== null ? images[openIndex] : null;
  const showNav = images.length > 1;

  return (
    <>
      <div
        className={`pflg-gallery${layout === 'horizontal' ? ' pflg-gallery--horizontal' : ''}`}
        role="group"
        aria-label={groupAriaLabel}
      >
        {images.map((item, index) => (
          <button
            key={item.src}
            type="button"
            className="pflg-gallery__thumb"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open larger view: ${item.alt}`}
          >
            <img
              src={item.src}
              alt=""
              width={320}
              height={200}
              className="pflg-gallery__thumb-img"
              loading="lazy"
              decoding="async"
            />
            <span className="pflg-gallery__thumb-label" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
          </button>
        ))}
      </div>

      {open &&
        current &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="pflg-lightbox-root">
            <div className="pflg-lightbox" role="dialog" aria-modal="true" aria-label={lightboxAriaLabel}>
              <button
                type="button"
                className="pflg-lightbox__backdrop"
                aria-label="Close gallery"
                onClick={close}
              />
              <div className="pflg-lightbox__panel">
                <button type="button" className="pflg-lightbox__close" onClick={close} aria-label="Close">
                  ×
                </button>
                {showNav && (
                  <>
                    <button
                      type="button"
                      className="pflg-lightbox__nav pflg-lightbox__nav--prev"
                      onClick={goPrev}
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="pflg-lightbox__nav pflg-lightbox__nav--next"
                      onClick={goNext}
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}
                <div className="pflg-lightbox__frame">
                  <img src={current.src} alt={current.alt} className="pflg-lightbox__img" />
                </div>
                <p className="pflg-lightbox__caption">
                  {openIndex + 1} / {images.length}
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
