"use client";

import { mobileStackLayerDeg } from "../lib/mobileBoardPlacement";

type Img = { src: string; alt?: string };

/** Sized for 2-up mobile column (~half of ~36rem content width). */
const STICKER_W = 86;
const POLAROID_W = 100;
const STACK_W = 78;

export default function MobileAboutStackPreview(params: {
  id: string;
  images: Img[];
  presentation?: "stack" | "sticker" | "polaroid";
}) {
  const { id, images, presentation = "stack" } = params;
  if (images.length === 0) return null;

  const baseW = presentation === "sticker" ? STICKER_W : presentation === "polaroid" ? POLAROID_W : STACK_W;
  const dxStep = presentation === "sticker" ? 7 : presentation === "polaroid" ? 8 : 6;
  const liftStep = presentation === "sticker" ? 3 : presentation === "polaroid" ? 4 : 3;

  return (
    <div
      className={`mobile-about-stack-preview mobile-about-stack-preview--${presentation}`}
      style={{ ["--mobile-stack-w" as string]: `${baseW}px` }}
    >
      <div className="mobile-about-stack-preview__inner">
        {images.map((im, i) => {
          const deg = mobileStackLayerDeg(id, i);
          const dx = i * dxStep;
          const dy = -i * liftStep;
          return (
            <div
              key={`${id}-stack-${i}-${im.src}`}
              className="mobile-about-stack-preview__layer"
              style={{
                zIndex: images.length - i,
                width: baseW,
                marginLeft: -baseW / 2,
                left: "50%",
                bottom: 0,
                transform: `translate(${dx}px, ${dy}px) rotate(${deg}deg)`,
                transformOrigin: "50% 100%",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={im.src}
                alt={im.alt ?? ""}
                className="mobile-about-stack-preview__img"
                width={baseW}
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
