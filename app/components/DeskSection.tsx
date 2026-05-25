'use client';

import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { SuedeLogoMarquee } from '../suede/components/SuedeLogoMarquee';
import { useDraggable } from '../hooks/useDraggable';
import { DESK_ITEMS, type DeskItem } from '../lib/deskData';
import { SUEDE_DESK_MARQUEE_LOGOS } from '../lib/deskSuedeLogos';
import KoiPond from './KoiPond';

function deskItemHref(item: DeskItem) {
  return item.internalRoute ?? item.link;
}

const MOBILE_MAX = 640;
const OPEN_DELAY_MS = 200;
const CLOSE_DELAY_MS = 300;

function DeskItemIcon({ icon, label }: { icon: string; label: string }) {
  const [failed, setFailed] = useState(false);
  const initial = label.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="desk-item__icon-wrap" aria-hidden="true">
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="desk-item__icon"
          src={icon}
          alt=""
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="desk-item__icon-fallback">{initial}</span>
      )}
    </div>
  );
}

function DeskKoiExpand({
  item,
  isMobile,
}: {
  item: DeskItem;
  isMobile: boolean;
}) {
  const href = deskItemHref(item);

  return (
    <div className="desk-expand-card desk-expand-card--pond" role="region" aria-label={item.label}>
      <div className="desk-expand-card__pond" data-desk-interactive="true">
        <KoiPond />
      </div>
      <ul className="desk-expand-card__instructions" aria-label="Pond controls">
        {isMobile ? (
          <>
            <li>Move your finger over the water to create ripples</li>
            <li>Tap to make a big ripple</li>
            <li>
              Hold to drop food — but don&apos;t feed them too much or they&apos;ll get fat
            </li>
          </>
        ) : (
          <>
            <li>Move your mouse to create ripples</li>
            <li>Click to make a big ripple</li>
            <li>
              Hold click to drop food — but don&apos;t feed them too much or they&apos;ll get fat
            </li>
          </>
        )}
      </ul>
      {href && (
        <p className="desk-expand-card__hint">Click the icon or panel again to open project</p>
      )}
    </div>
  );
}

function DeskSuedeExpand({
  item,
  titleId,
}: {
  item: DeskItem;
  titleId: string;
}) {
  return (
    <div
      className="desk-expand-card desk-expand-card--suede"
      role="region"
      aria-labelledby={titleId}
    >
      <h3 id={titleId} className="desk-expand-card__title">
        {item.label}
      </h3>
      {item.description && (
        <p className="desk-expand-card__body">{item.description}</p>
      )}
      <div className="desk-expand-card__suede-marquee" data-desk-interactive="true">
        <SuedeLogoMarquee logos={SUEDE_DESK_MARQUEE_LOGOS} />
      </div>
      {deskItemHref(item) && (
        <p className="desk-expand-card__hint">Click the icon or panel again to open project</p>
      )}
    </div>
  );
}

function DeskTextExpand({
  item,
  titleId,
}: {
  item: DeskItem;
  titleId: string;
}) {
  const href = deskItemHref(item);

  return (
    <div className="desk-expand-card" role="region" aria-labelledby={titleId}>
      <h3 id={titleId} className="desk-expand-card__title">
        {item.label}
      </h3>
      {item.description && (
        <p className="desk-expand-card__body">{item.description}</p>
      )}
      {href && (
        <p className="desk-expand-card__hint">Click the icon or panel again to open project</p>
      )}
    </div>
  );
}

function DeskObject({
  item,
  position,
  onPositionChange,
  surfaceRef,
  expanded,
  isMobile,
  onOpen,
  onClose,
  onDragStart,
}: {
  item: DeskItem;
  position: { x: number; y: number };
  onPositionChange: (pos: { x: number; y: number }) => void;
  surfaceRef: React.RefObject<HTMLDivElement | null>;
  expanded: boolean;
  isMobile: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDragStart: () => void;
}) {
  const router = useRouter();
  const href = deskItemHref(item);
  const titleId = `desk-title-${item.id}`;
  const labelId = `desk-label-${item.id}`;
  const zoneRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [panelSide, setPanelSide] = useState<'left' | 'right'>('right');

  const clearOpenTimer = () => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  };

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleOpen = useCallback(() => {
    clearCloseTimer();
    clearOpenTimer();
    openTimer.current = setTimeout(onOpen, OPEN_DELAY_MS);
  }, [onOpen]);

  const scheduleClose = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    closeTimer.current = setTimeout(onClose, CLOSE_DELAY_MS);
  }, [onClose]);

  const handleZoneEnter = () => {
    if (!isMobile) scheduleOpen();
  };

  const handleZoneLeave = () => {
    if (!isMobile) scheduleClose();
  };

  const handleFocus = () => {
    if (!isMobile) scheduleOpen();
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (isMobile) return;
    const next = e.relatedTarget;
    if (next instanceof Node && zoneRef.current?.contains(next)) return;
    scheduleClose();
  };

  const handleDragStartLocal = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    onDragStart();
  }, [onDragStart]);

  const dragRotation = isMobile
    ? item.rotation + (item.mobileOffset?.rotate ?? 0)
    : item.rotation;

  const { suppressClickRef } = useDraggable(zoneRef, {
    containerRef: surfaceRef,
    position,
    onPositionChange,
    onDragStart: handleDragStartLocal,
    enabled: !isMobile,
    rotation: dragRotation,
    syncTransform: !isMobile,
  });

  useLayoutEffect(() => {
    if (!expanded || isMobile) return undefined;

    const updateSide = () => {
      const el = zoneRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      setPanelSide(cx < window.innerWidth / 2 ? 'right' : 'left');
    };

    updateSide();
    window.addEventListener('resize', updateSide);
    return () => window.removeEventListener('resize', updateSide);
  }, [expanded, isMobile, position.x, position.y]);

  useEffect(() => () => {
    clearOpenTimer();
    clearCloseTimer();
  }, []);

  const mobile = item.mobileOffset ?? { x: 0, rotate: 0 };

  const style = isMobile
    ? {
        ['--desk-mobile-rot' as string]: `${item.rotation + mobile.rotate}deg`,
      }
    : {
        left:      `${position.x}%`,
        top:       `${position.y}%`,
        ['--desk-item-rot' as string]: `${item.rotation}deg`,
      };

  const panelClass = [
    isMobile ? 'desk-item__panel' : `desk-item__panel desk-item__panel--side desk-item__panel--side-${panelSide}`,
    expanded && href ? 'desk-item__panel--navigable' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const navigateToProject = useCallback(() => {
    if (href) router.push(href);
  }, [href, router]);

  const handleTriggerClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (isMobile) {
      if (href) navigateToProject();
      return;
    }
    if (expanded && href) {
      navigateToProject();
      return;
    }
    if (!expanded) {
      clearOpenTimer();
      clearCloseTimer();
      onOpen();
    }
  };

  const handlePanelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!expanded || !href) return;
    if ((e.target as Element).closest('[data-desk-interactive]')) return;
    navigateToProject();
  };

  const soloClass = DESK_ITEMS.length === 1 ? ' desk-item--solo' : '';

  return (
    <div
      ref={zoneRef}
      className={`desk-item${soloClass}${expanded ? ' desk-item--expanded' : ''}${isMobile ? ' desk-item--mobile' : ''}`}
      style={style}
      onMouseEnter={handleZoneEnter}
      onMouseLeave={handleZoneLeave}
    >
      <button
        type="button"
        className="desk-item__trigger"
        onClick={handleTriggerClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-expanded={expanded}
        aria-controls={`desk-panel-${item.id}`}
        aria-labelledby={labelId}
      >
        <DeskItemIcon icon={item.icon} label={item.label} />
        <span className="desk-item__meta">
          <span className="desk-item__category">{item.category}</span>
          <span id={labelId} className="desk-item__label">
            {item.label}
          </span>
        </span>
      </button>

      {expanded && !isMobile && (
        <div
          id={`desk-panel-${item.id}`}
          className={panelClass}
          onClick={handlePanelClick}
        >
          {item.expandPond ? (
            <DeskKoiExpand item={item} isMobile={isMobile} />
          ) : item.expandSuede ? (
            <DeskSuedeExpand item={item} titleId={titleId} />
          ) : (
            <DeskTextExpand item={item} titleId={titleId} />
          )}
        </div>
      )}
    </div>
  );
}

export default function DeskSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isMobile, setIsMobile]     = useState(false);
  const [positions, setPositions]   = useState<Record<string, { x: number; y: number }>>(() =>
    Object.fromEntries(DESK_ITEMS.map((i) => [i.id, { ...i.position }])),
  );
  const sectionRef = useRef<HTMLElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const titleTapeRef = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const labelId    = useId();
  const [isTitleFixed, setIsTitleFixed]   = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [titleHeight, setTitleHeight]     = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_MAX);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const updateTitleMode = useCallback(() => {
    if (window.innerWidth < MOBILE_MAX) {
      setIsTitleFixed(false);
      setIsTitleVisible(false);
      return;
    }

    const section = sectionRef.current;
    const tape = titleTapeRef.current;
    if (!section || !tape) return;

    const th = tape.offsetHeight;
    if (th > 0) setTitleHeight(th);

    const sectionTop = section.getBoundingClientRect().top;
    const releaseY = window.innerHeight - th;
    const shouldFix = sectionTop > releaseY;

    const deckScroller = document.querySelector('.deck-scroller');
    const deckTop = deckScroller?.getBoundingClientRect().top ?? Infinity;
    const deckActive = deckTop <= 0;

    setIsTitleFixed(shouldFix);
    setIsTitleVisible(shouldFix && deckActive);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsTitleFixed(false);
      setIsTitleVisible(false);
      return undefined;
    }

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateTitleMode);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [isMobile, updateTitleMode]);

  const close = useCallback(() => setExpandedId(null), []);

  const open = useCallback((id: string) => {
    setExpandedId(id);
  }, []);

  const handleDragStart = useCallback(() => {
    setExpandedId(null);
  }, []);

  const handlePositionChange = useCallback((id: string, pos: { x: number; y: number }) => {
    setPositions((prev) => ({ ...prev, [id]: pos }));
  }, []);

  useEffect(() => {
    if (!expandedId || !isMobile) return undefined;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (!sectionRef.current?.contains(target)) {
        close();
        return;
      }
      if (target instanceof Element) {
        if (target.closest('.desk-item')) return;
      }
      close();
    };

    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [expandedId, isMobile, close]);

  return (
    <section
      ref={sectionRef}
      className="desk-section"
      aria-labelledby={labelId}
    >
      <div
        className="desk-section__title-slot"
        style={titleHeight > 0 ? { minHeight: titleHeight } : undefined}
      >
        <div
          ref={titleTapeRef}
          className={[
            'desk-title-tape',
            isTitleFixed && 'desk-title-tape--fixed',
            isTitleFixed && !isTitleVisible && 'desk-title-tape--hidden',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <h2 ref={titleRef} id={labelId} className="desk-section__title">
            Passion Projects
          </h2>
        </div>
      </div>

      <div
        ref={surfaceRef}
        className={`desk-surface${DESK_ITEMS.length === 1 ? ' desk-surface--solo' : ''}${isMobile ? ' desk-surface--mobile' : ''}`}
      >
        {DESK_ITEMS.map((item) => (
          <DeskObject
            key={item.id}
            item={item}
            position={positions[item.id] ?? item.position}
            onPositionChange={(pos) => handlePositionChange(item.id, pos)}
            surfaceRef={surfaceRef}
            expanded={expandedId === item.id}
            isMobile={isMobile}
            onOpen={() => open(item.id)}
            onClose={close}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </section>
  );
}
