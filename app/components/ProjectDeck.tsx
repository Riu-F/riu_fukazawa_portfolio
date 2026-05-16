'use client';

/*
  ProjectDeck — scroll-progress driven sticky deck.

  Architecture (Webflow-style "Scroller Grid"):
  • Outer section: (N + 1) × 100vh tall — creates the scroll runway
  • Sticky shell: position: sticky; top: 0; height: 100vh — stays in viewport
    while the outer section scrolls beneath it
  • Active card: derived from scroll progress through the outer section
    — each project occupies exactly one viewport-height of scroll travel
  • Tab click + keyboard: also supported for direct / accessible navigation

  Scroll math:
    scrollOffset = -(section.getBoundingClientRect().top)
    targetId     = floor(scrollOffset / innerHeight)  → clamped [0, N-1]

  This replaces the old wheel-delta accumulation approach entirely.
  Projects change at deliberate, scroll-anchored breakpoints rather than
  on sensitive wheel gestures.

  Session additions retained:
  • Per-card tab colour themes (rainbow / deep purple / bright green)
  • Larger tabs (TAB_H 42, font 13, padding 18)
  • Real project content with CTA buttons
  • AI card: CTA button linking to /ai-project
*/

import { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import { DECK_CARDS, type DeckCard, type DeckTag } from '../lib/deckData';
import AICheckoutDemo from './AICheckoutDemo';
import DeckFoodHubMini from './DeckFoodHubMini';
import KoiPond from './KoiPond';

/* ── Tag chips — GitHub-style pills mirroring the supermarket case study ── */

const TAG_CONFIG: Record<DeckTag, { emoji: string; label: string; bg: string; color: string }> = {
  navigation:   { emoji: '🧭', label: 'Navigation',   bg: '#3b82f6', color: '#fff' },
  distraction:  { emoji: '🧠', label: 'Distraction',  bg: '#ec4899', color: '#fff' },
  communication: { emoji: '💬', label: 'Communication', bg: '#7c4dbd', color: '#fff' },
};

function TagChips({ tags, size = 'md' }: { tags: DeckTag[]; size?: 'sm' | 'md' }) {
  const fontSize = size === 'sm' ? 11 : 12;
  return (
    <div
      style={{
        display:    'flex',
        flexWrap:   'wrap',
        gap:        6,
        margin:     '0 0 1rem',
      }}
    >
      {tags.map((t) => {
        const c = TAG_CONFIG[t];
        return (
          <span
            key={t}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            4,
              padding:        '2px 8px 3px',
              borderRadius:   999,
              background:     c.bg,
              color:          c.color,
              fontFamily:     "'Inter', sans-serif",
              fontSize,
              fontWeight:     500,
              lineHeight:     1.25,
              letterSpacing:  '0.02em',
              boxShadow:      '0 1px 0 rgba(0,0,0,0.06)',
              whiteSpace:     'nowrap',
            }}
          >
            <span aria-hidden style={{ fontSize: fontSize + 1, lineHeight: 1 }}>{c.emoji}</span>
            <span>{c.label}</span>
          </span>
        );
      })}
    </div>
  );
}

/* ── Constants ─────────────────────────────────────────────────────── */

const N      = 3;
const STRIP  = 54;
const TAB_H  = 42;
/* CARD_H is now dynamic — computed from viewport height in ProjectDeck */

/* Staggered horizontal tab offsets per card id */
const TAB_X = [26, 210, 380];

const DUR  = 440;
const EASE = 'cubic-bezier(0.38, 0, 0.18, 1)';

/* ── Tab colour themes ─────────────────────────────────────────────── */

interface TabTheme {
  activeBg:    string;
  activeColor: string;
  activeBorder: string;
}

const TAB_THEMES: TabTheme[] = [
  /* 0 — FoodHub: solid supermarket purple */
  {
    activeBg:    '#7c4dbd',
    activeColor: '#faf7ff',
    activeBorder: 'transparent',
  },
  /* 1 — AI at Checkout: iridescent rainbow gradient */
  {
    activeBg:    'linear-gradient(120deg, #c084fc 0%, #818cf8 35%, #60a5fa 65%, #34d399 100%)',
    activeColor: '#fff',
    activeBorder: 'transparent',
  },
  /* 2 — Interactive Art: muted forest green → teal (pond palette) */
  {
    activeBg:    'linear-gradient(120deg, #1a3a2a 0%, #2a6060 100%)',
    activeColor: '#e8f2ec',
    activeBorder: 'transparent',
  },
];

/* ── Position helpers ──────────────────────────────────────────────── */

const getTop    = (pos: number) => TAB_H + (N - 1 - pos) * STRIP;
const getZ      = (pos: number) => N + 2 - pos;
const getBg     = (pos: number) => `hsl(0,0%,${(100 - pos * 1.3).toFixed(1)}%)`;
const getBorder = (pos: number) => `hsl(0,0%,${(87  - pos * 0.55).toFixed(1)}%)`;

/* ── Main component ─────────────────────────────────────────────────── */

const ProjectDeck = forwardRef<HTMLDivElement, {}>(function ProjectDeck(_, stickyShellRef) {
  const [isMobile, setIsMobile] = useState(false);
  const [cardH, setCardH] = useState(760);
  const [order, setOrder] = useState(DECK_CARDS.map(c => c.id));
  const busy          = useRef(false);
  const ordRef        = useRef(DECK_CARDS.map(c => c.id));
  const timer         = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deckRef       = useRef<HTMLDivElement>(null);
  const scrollerRef   = useRef<HTMLElement>(null);
  const lastTargetRef = useRef(0);  /* tracks last successfully requested targetId */

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    /*
      Compute card height so the full deck sits inside the viewport with
      ~3% bottom clearance. Sticky shell has ~84px vertical padding total
      (top: clamp(0.25rem,1vh,0.75rem) ≈ 4–12px + bottom: 4.5rem = 72px).
      TOTAL_H = TAB_H + (N-1)*STRIP + cardH → solve for cardH.
      Desktop: taller minimum so the FoodHub phone + hint fit comfortably.
    */
    const computeCardH = () => {
      /* Tighter vertical runway so the deck wraps closer to content (phone drives feel). */
      const available = Math.round(0.92 * (window.innerHeight - 32));
      const minDeck = isMobile ? 400 : 480;
      setCardH(Math.max(minDeck, available - TAB_H - (N - 1) * STRIP));
    };
    computeCardH();
    window.addEventListener('resize', computeCardH);
    return () => window.removeEventListener('resize', computeCardH);
  }, [isMobile]);

  const finishAfter = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { busy.current = false; }, DUR + 24);
  };

  /* Bring card `id` to the front */
  const select = useCallback((id: number) => {
    if (busy.current) return;
    if (ordRef.current[0] === id) return;
    busy.current = true;
    setOrder(prev => {
      const i    = prev.indexOf(id);
      const next = [...prev.slice(i), ...prev.slice(0, i)];
      ordRef.current = next;
      return next;
    });
    finishAfter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Scroll-progress driven card selection ─────────────────────── */
  /*
    Outer section = 300vh. Sticky shell = 100vh.
    scrollRange = 200vh. Each project occupies 100vh of that range:
      0–100vh  → project 0,  100–200vh → project 1,  200vh → project 2.
  */
  useEffect(() => {
    const onScroll = () => {
      const el = scrollerRef.current;
      if (!el) return;

      const rect         = el.getBoundingClientRect();
      const scrollOffset = -rect.top;
      const scrollRange  = rect.height - window.innerHeight;

      /* Outside sticky period — nothing to do */
      if (scrollOffset < 0 || scrollOffset > scrollRange) return;

      const targetId = Math.min(
        Math.floor(scrollOffset / window.innerHeight),
        N - 1,
      );

      if (targetId !== lastTargetRef.current) {
        lastTargetRef.current = targetId;
        select(targetId);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [select]);

  /* ── Keyboard — bounded, no looping ────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const next = Math.min(lastTargetRef.current + 1, N - 1);
        if (next !== lastTargetRef.current) {
          lastTargetRef.current = next;
          select(next);
        }
      }
      if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault();
        const next = Math.max(lastTargetRef.current - 1, 0);
        if (next !== lastTargetRef.current) {
          lastTargetRef.current = next;
          select(next);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [select]);

  /* ── Mobile flat view — clean stacked cards, no scroll section ─── */
  if (isMobile) {
    return (
      <div style={{ padding: '0 1.25rem 4rem' }}>
        {DECK_CARDS.map(card => {
          const theme    = TAB_THEMES[card.id];
          const hasLink  = Boolean(card.href);
          const Wrapper  = (hasLink && card.id !== 0 ? 'a' : 'div') as 'a' | 'div';
          const wrapperProps = hasLink && card.id !== 0 && card.id !== 2
            ? { href: card.href }
            : {};
          return (
            <Wrapper
              key={card.id}
              {...wrapperProps}
              style={{
                display:        'block',
                marginBottom:   '1.25rem',
                borderRadius:   12,
                overflow:       'hidden',
                border:         '1px solid #e5e5e5',
                textDecoration: 'none',
                color:          'inherit',
              }}
            >
              {/* Folder-style tab notch */}
              <div style={{
                background:    theme.activeBg,
                color:         theme.activeColor,
                padding:       '10px 20px',
                fontFamily:    "'DM Mono', monospace",
                fontSize:      11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight:    500,
              }}>
                <span style={{ opacity: 0.55, fontSize: 9, marginRight: 6 }}>{card.num}</span>
                {card.tab}
              </div>

              {/* Card content — title, subtitle, intro paragraph only (no CTA, no demo) */}
              <div style={{ padding: '24px 20px 28px', background: '#fff' }}>
                {/* Label: matches AiIdea .h5 style */}
                <p style={{
                  fontFamily:    "'Inter', sans-serif",
                  fontSize:      '0.875rem',
                  fontWeight:    400,
                  color:         '#888',
                  textTransform: 'capitalize',
                  margin:        '0 0 0.5rem',
                }}>
                  {card.sub}
                </p>
                {/* Heading: matches AiIdea .h2 style, scaled for card */}
                <h2 style={{
                  fontFamily:    "'Montserrat', sans-serif",
                  fontSize:      '1.5rem',
                  fontWeight:    700,
                  lineHeight:    1.275,
                  color:         '#111',
                  margin:        '0 0 1rem',
                  textTransform: 'capitalize',
                }}>
                  {card.heading}
                </h2>
                {/* Optional GitHub-style chips (only on cards that declare tags) */}
                {card.tags && card.tags.length > 0 && (
                  <TagChips tags={card.tags} size="sm" />
                )}
                {/* Body: matches AiIdea .paragraph-new style */}
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize:   '1rem',
                  fontWeight: 400,
                  lineHeight: '1.6em',
                  color:      '#444',
                  margin:     0,
                }}>
                  {card.body}
                </p>

                {card.id === 0 ? (
                  <>
                    <div style={{ marginTop: 18, minHeight: 0 }}>
                      <DeckFoodHubMini compact />
                    </div>
                    {card.href && card.btn ? (
                      <a
                        href={card.href}
                        className={`deck-btn${card.id === 0 ? ' deck-btn--sentence' : ''}`}
                        style={{ marginTop: 18, display: 'inline-block' }}
                      >
                        {card.btn}
                      </a>
                    ) : null}
                  </>
                ) : card.id === 2 ? (
                  <>
                    <div style={{
                      marginTop:    18,
                      width:        '100%',
                      aspectRatio:  '3 / 2',
                      borderRadius: 10,
                      overflow:     'hidden',
                      background:   '#0a1a12',
                      boxShadow:    '0 1px 4px rgba(0,0,0,0.1)',
                    }}>
                      <KoiPond />
                    </div>
                    {card.href && card.btn ? (
                      <a
                        href={card.href}
                        className="deck-btn deck-btn--sentence"
                        style={{ marginTop: 18, display: 'inline-block' }}
                      >
                        {card.btn}
                      </a>
                    ) : null}
                  </>
                ) : null}
              </div>
            </Wrapper>
          );
        })}
      </div>
    );
  }

  return (
    /*
      Outer scroller — 300vh tall.
      This is the scroll runway. As the user moves through it, the sticky
      shell inside stays fixed and the active project changes.
    */
    <section
      ref={scrollerRef}
      style={{ position: 'relative', height: '300vh', marginTop: '-2rem' }}
    >
      {/* Sticky shell — remains in viewport for the full scroll runway */}
      <div
        ref={stickyShellRef}
        style={{
          position:       'sticky',
          top:            0,
          height:         '100vh',
          overflow:       'hidden',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'flex-start',
          padding:        'clamp(0.25rem, 1vh, 0.75rem) clamp(1.5rem, 3vw, 3rem) 1.5rem',
          fontFamily:     "'DM Mono', 'Courier New', monospace",
        }}
      >
        <div
          ref={deckRef}
          tabIndex={0}
          style={{
            position:   'relative',
            width:      'min(100%, 1240px)',
            height:     TAB_H + (N - 1) * STRIP + cardH,
            userSelect: 'none',
            outline:    'none',
          }}
        >
          {DECK_CARDS.map(card => {
            const pos     = order.indexOf(card.id);
            const isFront = pos === 0;
            return (
              <CardPanel
                key={card.id}
                card={card}
                pos={pos}
                isFront={isFront}
                tabX={TAB_X[card.id]}
                theme={TAB_THEMES[card.id]}
                cardH={cardH}
                onPick={() => select(card.id)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default ProjectDeck;

/* ── CardPanel ──────────────────────────────────────────────────────── */

interface CardPanelProps {
  card:    DeckCard;
  pos:     number;
  isFront: boolean;
  tabX:    number;
  theme:   TabTheme;
  cardH:   number;
  onPick:  () => void;
}

function CardPanel({ card, pos, isFront, tabX, theme, cardH, onPick }: CardPanelProps) {
  const [show, setShow] = useState(false);

  /* Content reveal: waits for deck transition to complete */
  useEffect(() => {
    setShow(false);
    if (!isFront) return;
    const t = setTimeout(() => setShow(true), DUR - 30);
    return () => clearTimeout(t);
  }, [isFront]);

  const top    = getTop(pos);
  const zi     = getZ(pos);
  const bg     = getBg(pos);
  const bc     = getBorder(pos);

  const shadow = isFront
    ? '0 32px 80px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.06)'
    : pos === 1
    ? '0 8px 28px rgba(0,0,0,0.04)'
    : 'none';

  const cardBodyShadow = shadow;

  const cardSurfaceClass = [
    'deck-card-surface',
    isFront && card.id === 0 && 'deck-card-surface--accent-foodhub',
    isFront && card.id === 1 && 'deck-card-surface--accent-ai',
    isFront && card.id === 2 && 'deck-card-surface--accent-age',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      style={{
        position:   'absolute',
        left:       0,
        right:      0,
        top,
        height:     cardH,
        zIndex:     zi,
        transition: `top ${DUR}ms ${EASE}`,
        willChange: 'top',
      }}
    >
      {/* ── Tab ── */}
      <div
        className={`deck-tab${isFront ? ' active' : ''}`}
        onClick={isFront ? undefined : onPick}
        style={{
          position:      'absolute',
          top:           -TAB_H,
          left:          tabX,
          height:        TAB_H,
          paddingInline: 18,
          display:       'inline-flex',
          alignItems:    'center',
          gap:           8,
          background:    isFront ? theme.activeBg : bg,
          color:         isFront ? theme.activeColor : '#b0b0b0',
          borderTop:     `1.5px solid ${isFront ? theme.activeBorder : bc}`,
          borderLeft:    `1.5px solid ${isFront ? theme.activeBorder : bc}`,
          borderRight:   `1.5px solid ${isFront ? theme.activeBorder : bc}`,
          borderBottom:  'none',
          borderRadius:  '5px 5px 0 0',
          fontSize:      13,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight:    500,
          fontFamily:    "'DM Mono', monospace",
          cursor:        isFront ? 'default' : 'pointer',
          whiteSpace:    'nowrap',
          transition:    'background 0.18s, color 0.18s, border-color 0.18s',
        }}
      >
        <span style={{ opacity: 0.5, fontSize: 10 }}>{card.num}</span>
        <span>{card.tab}</span>
      </div>

      {/* ── Card body ── */}
      <div
        className={cardSurfaceClass}
        style={{
          position:      'absolute',
          inset:         0,
          background:    bg,
          border:        `1.5px solid ${bc}`,
          borderRadius:  18,
          overflow:      'hidden',
          boxShadow:     cardBodyShadow,
          transition:    'box-shadow 0.4s',
          display:       'flex',
          flexDirection: 'column',
          minHeight:     0,
        }}
      >
        {/* Peek label — only on stacked (non-front) cards; tab already labels the front card */}
        {!isFront ? (
          <div style={{
            flexShrink:    0,
            padding:       '11px 28px 0',
            fontFamily:    "'DM Mono', monospace",
            fontSize:      8,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         '#ccc',
            whiteSpace:    'nowrap',
          }}>
            {card.num} — {card.tab}
          </div>
        ) : null}

        {/* ── Active card content ── */}
        {isFront && (
          card.id === 2 ? (
            <div style={{
              flex:         1,
              minHeight:    0,
              display:      'flex',
              alignItems:   'stretch',
              opacity:      show ? 1 : 0,
              transform:    show ? 'translateY(0)' : 'translateY(9px)',
              transition:   'opacity 0.34s ease, transform 0.34s ease',
              overflow:     'hidden',
            }}>

              <div style={{
                width:          '36%',
                flexShrink:     0,
                alignSelf:      'stretch',
                display:        'flex',
                flexDirection:  'column',
                justifyContent: 'center',
                padding:        '22px 32px 26px 48px',
              }}>
                <p style={{
                  fontFamily:    "'Inter', sans-serif",
                  fontSize:      '1rem',
                  fontWeight:    400,
                  lineHeight:    '1.6em',
                  color:         '#888',
                  textTransform: 'capitalize',
                  margin:        '0 0 0.5rem',
                }}>
                  {card.sub}
                </p>
                <h2 style={{
                  fontFamily:    "'Montserrat', sans-serif",
                  fontSize:      '2rem',
                  fontWeight:    700,
                  lineHeight:    1.275,
                  color:         '#111',
                  textTransform: 'capitalize',
                  margin:        '0 0 1.25rem',
                  paddingBottom: 10,
                  whiteSpace:    'pre-line',
                }}>
                  {card.heading}
                </h2>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize:   '1rem',
                  fontWeight: 400,
                  lineHeight: '1.6em',
                  color:      '#444',
                  margin:     '0 0 1.25rem',
                }}>
                  {card.body}
                </p>
                {card.btn && card.href && (
                  <a href={card.href} className="deck-btn deck-btn--sentence">
                    {card.btn}
                  </a>
                )}
              </div>

              <div style={{
                flex:           1,
                minWidth:       0,
                minHeight:      0,
                display:        'flex',
                padding:        16,
                background:     '#ffffff',
              }}>
                <div style={{
                  flex:         1,
                  minHeight:    0,
                  position:     'relative',
                  overflow:     'hidden',
                  borderRadius: 5,
                  background:   '#0a1a12',
                  boxShadow:    '0 1px 4px rgba(0,0,0,0.1)',
                }}>
                  {show && <KoiPond />}
                </div>
              </div>
            </div>
          ) : card.id === 1 ? (
            /* AI project — two-column split: left text / right demo */
            <div style={{
              flex:         1,
              minHeight:    0,
              display:      'flex',
              alignItems:   'stretch',
              opacity:      show ? 1 : 0,
              transform:    show ? 'translateY(0)' : 'translateY(9px)',
              transition:   'opacity 0.34s ease, transform 0.34s ease',
              overflow:     'hidden',
            }}>

              {/* ── Left: title, subtitle, CTA — AiIdea typography ── */}
              <div style={{
                width:         '36%',
                flexShrink:    0,
                alignSelf:     'stretch',
                display:       'flex',
                flexDirection: 'column',
                justifyContent:'center',
                padding:       '22px 32px 26px 48px',
              }}>
                {/* Label — mirrors AiIdea .h5 style */}
                <p style={{
                  fontFamily:    "'Inter', sans-serif",
                  fontSize:      '1rem',
                  fontWeight:    400,
                  lineHeight:    '1.6em',
                  color:         '#888',
                  textTransform: 'capitalize',
                  margin:        '0 0 0.5rem',
                }}>
                  {card.sub}
                </p>

                {/* Heading — mirrors AiIdea .h2 style, sized for card */}
                <h2 style={{
                  fontFamily:    "'Montserrat', sans-serif",
                  fontSize:      '2rem',
                  fontWeight:    700,
                  lineHeight:    1.275,
                  color:         '#111',
                  textTransform: 'capitalize',
                  margin:        '0 0 1.25rem',
                  paddingBottom: 10,
                  whiteSpace:    'pre-line',
                }}>
                  {card.heading}
                </h2>

                {/* Body — mirrors AiIdea .paragraph-new style */}
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize:   '1rem',
                  fontWeight: 400,
                  lineHeight: '1.6em',
                  color:      '#444',
                  margin:     '0 0 1.25rem',
                }}>
                  {card.body}
                </p>

                {card.btn && (
                  <a href="/ai-project" className="deck-btn deck-btn--ai">
                    {card.btn}
                  </a>
                )}
              </div>

              {/* ── Right: interactive demo (no header — shown on left) ── */}
              <div style={{ flex: 1, minWidth: 0, minHeight: 0, overflow: 'hidden', alignSelf: 'stretch' }}>
                <AICheckoutDemo show={show} hideHeader />
              </div>

            </div>
          ) : (
            /* Other projects — same two-column split as AI card */
            <div style={{
              flex:       1,
              minHeight:  0,
              display:    'flex',
              alignItems: 'stretch',
              opacity:    show ? 1 : 0,
              transform:  show ? 'translateY(0)' : 'translateY(9px)',
              transition: 'opacity 0.34s ease, transform 0.34s ease',
              overflow:   'hidden',
            }}>

              {/* ── Left: title, subtitle, body, CTA — AiIdea typography ── */}
              <div style={{
                width:          '36%',
                flexShrink:     0,
                alignSelf:      'stretch',
                display:        'flex',
                flexDirection:  'column',
                justifyContent: 'center',
                padding:        card.id === 0
                  ? '18px 28px 20px 44px'
                  : '22px 32px 26px 48px',
              }}>
                {/* Label — mirrors AiIdea .h5 style */}
                <p style={{
                  fontFamily:    "'Inter', sans-serif",
                  fontSize:      '1rem',
                  fontWeight:    400,
                  lineHeight:    '1.6em',
                  color:         '#888',
                  textTransform: 'capitalize',
                  margin:        '0 0 0.5rem',
                }}>
                  {card.sub}
                </p>

                {/* Heading — mirrors AiIdea .h2 style, sized for card */}
                <h2 style={{
                  fontFamily:    "'Montserrat', sans-serif",
                  fontSize:      '2rem',
                  fontWeight:    700,
                  lineHeight:    1.275,
                  color:         '#111',
                  textTransform: 'capitalize',
                  margin:        '0 0 1.25rem',
                  paddingBottom: 10,
                  whiteSpace:    'pre-line',
                }}>
                  {card.heading}
                </h2>

                {/* Optional GitHub-style chips between heading and body */}
                {card.tags && card.tags.length > 0 && (
                  <TagChips tags={card.tags} />
                )}

                {/* Body — mirrors AiIdea .paragraph-new style */}
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize:   '1rem',
                  fontWeight: 400,
                  lineHeight: '1.6em',
                  color:      '#444',
                  margin:     '0 0 1.25rem',
                }}>
                  {card.body}
                </p>

                {card.btn && card.href && (
                  <a
                    href={card.href}
                    className={`deck-btn${card.id === 0 ? ' deck-btn--sentence' : ''}`}
                  >
                    {card.btn}
                  </a>
                )}
              </div>

              {/* ── Right: FoodHub mini (card 0) or placeholder ── */}
              {card.id === 0 ? (
                <div className="deck-foodhub-right-panel">
                  <DeckFoodHubMini />
                </div>
              ) : (
                <div style={{
                  flex:            1,
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  background:      'hsl(0,0%,97%)',
                }}>
                  <span style={{
                    fontFamily:    "'DM Mono', monospace",
                    fontSize:      10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color:         '#ccc',
                  }}>
                    {card.num} — Coming soon
                  </span>
                </div>
              )}

            </div>
          )
        )}
      </div>
    </div>
  );
}
