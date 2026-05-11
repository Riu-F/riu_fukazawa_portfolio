'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';

const FOODHUB_DECK_SRC = '/super-market-navigation/foodhub/index.html?embed=deck';

/** Layout footprint of the device chrome at 1:1 (matches deck CSS bezel + 720 screen). */
const FH_INTRINSIC_W = 378;
const FH_INTRINSIC_H = 800;

function postToFoodHubIframe(win: Window | null | undefined, data: object) {
  if (!win) return;
  try {
    win.postMessage(data, '*');
  } catch {
    /* ignore */
  }
}

export default function DeckFoodHubMini({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const ioVisibleRef = useRef(false);
  const interruptedRef = useRef(false);
  const [userInterrupted, setUserInterrupted] = useState(false);
  const [showTryHint, setShowTryHint] = useState(false);
  const [scale, setScale] = useState(compact ? 0.42 : 0.62);

  const syncVisibleToIframe = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    postToFoodHubIframe(win, {
      type: 'foodhub-demo-visible',
      visible: ioVisibleRef.current,
    });
  }, []);

  const interruptFromChrome = useCallback(() => {
    if (interruptedRef.current) return;
    interruptedRef.current = true;
    setUserInterrupted(true);
    postToFoodHubIframe(iframeRef.current?.contentWindow, { type: 'foodhub-demo-interrupt' });
    setShowTryHint(true);
    window.setTimeout(() => setShowTryHint(false), 2000);
  }, []);

  const measureScale = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    /* Centred panel: symmetric horizontal inset for scale calculation. */
    const padX = compact ? 14 : 20;
    const padTop = compact ? 12 : 10;
    const padBottom = compact ? 10 : 10;
    const hintReserve = compact ? 34 : 38;
    const { width, height } = el.getBoundingClientRect();
    const usableW = width - padX * 2;
    const heightFrac = compact ? 0.82 : 0.875;
    const maxPhoneH = height * heightFrac - hintReserve - padTop - padBottom;
    if (usableW < 56 || maxPhoneH < 100) return;
    const s = Math.min(usableW / FH_INTRINSIC_W, maxPhoneH / FH_INTRINSIC_H) * 0.99;
    setScale(Math.max(0.28, Math.min(s, 1)));
  }, [compact]);

  useLayoutEffect(() => {
    measureScale();
  }, [measureScale]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => {
      measureScale();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [measureScale]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === 'foodhub-demo-interrupted') {
        if (interruptedRef.current) return;
        interruptedRef.current = true;
        setUserInterrupted(true);
        setShowTryHint(true);
        window.setTimeout(() => setShowTryHint(false), 2000);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        const ratio = entries[0]?.intersectionRatio ?? 0;
        ioVisibleRef.current = ratio >= 0.5;
        syncVisibleToIframe();
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [syncVisibleToIframe]);

  const hintText = compact ? 'Tap to try it' : 'Tap to interact';
  const slotW = FH_INTRINSIC_W * scale;
  const slotH = FH_INTRINSIC_H * scale;

  return (
    <div ref={rootRef} className={`deck-foodhub-mini${compact ? ' deck-foodhub-mini--compact' : ''}`}>
      <div ref={viewportRef} className="deck-foodhub-mini__viewport">
        <div className="deck-foodhub-mini__phone-area">
          <div
            className="deck-foodhub-mini__slot"
            style={{ width: slotW, height: slotH }}
          >
            <div
              className="deck-foodhub-mini__scale-inner"
              style={{
                width:            FH_INTRINSIC_W,
                height:           FH_INTRINSIC_H,
                transform:        `scale(${scale})`,
                transformOrigin:  'top left',
              }}
              onPointerDownCapture={interruptFromChrome}
              onMouseEnter={interruptFromChrome}
            >
              <div className="deck-foodhub-mini__frame">
                <div className="deck-foodhub-mini__bezel">
                  <div className="deck-foodhub-mini__island" aria-hidden="true" />
                  <div className="deck-foodhub-mini__screen">
                    <iframe
                      key={pathname ?? '/'}
                      ref={iframeRef}
                      className="deck-foodhub-mini__iframe"
                      src={FOODHUB_DECK_SRC}
                      title="FoodHub — interactive prototype"
                      width={390}
                      height={720}
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      onLoad={syncVisibleToIframe}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p
          className={`deck-foodhub-mini__hint${userInterrupted ? ' deck-foodhub-mini__hint--out' : ''}`}
          aria-live="polite"
        >
          <span className="deck-foodhub-mini__hint-icon" aria-hidden="true">
            👆
          </span>
          {hintText}
        </p>
      </div>

      {showTryHint ? (
        <div className="deck-foodhub-mini__try-label" role="status">
          Try it yourself
        </div>
      ) : null}
    </div>
  );
}
