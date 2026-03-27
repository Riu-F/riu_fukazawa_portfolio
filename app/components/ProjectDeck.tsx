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

import { useState, useEffect, useRef, useCallback } from 'react';
import { DECK_CARDS, type DeckCard } from '../lib/deckData';
import AICheckoutDemo from './AICheckoutDemo';

/* ── Constants ─────────────────────────────────────────────────────── */

const N       = 3;
const STRIP   = 54;
const CARD_H  = 760;
const TAB_H   = 42;
const TOTAL_H = TAB_H + (N - 1) * STRIP + CARD_H;  /* 910 */

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
  /* 0 — AI at Checkout: iridescent rainbow gradient */
  {
    activeBg:    'linear-gradient(120deg, #c084fc 0%, #818cf8 35%, #60a5fa 65%, #34d399 100%)',
    activeColor: '#fff',
    activeBorder: 'transparent',
  },
  /* 1 — Accessible Design: deep purple */
  {
    activeBg:    '#3b0764',
    activeColor: '#ddd6fe',
    activeBorder: '#3b0764',
  },
  /* 2 — Age of AI: bright green */
  {
    activeBg:    '#14532d',
    activeColor: '#bbf7d0',
    activeBorder: '#14532d',
  },
];

/* ── Position helpers ──────────────────────────────────────────────── */

const getTop    = (pos: number) => TAB_H + (N - 1 - pos) * STRIP;
const getZ      = (pos: number) => N + 2 - pos;
const getBg     = (pos: number) => `hsl(0,0%,${(100 - pos * 1.3).toFixed(1)}%)`;
const getBorder = (pos: number) => `hsl(0,0%,${(87  - pos * 0.55).toFixed(1)}%)`;

/* ── Main component ─────────────────────────────────────────────────── */

export default function ProjectDeck() {
  const [order, setOrder] = useState(DECK_CARDS.map(c => c.id));
  const busy          = useRef(false);
  const ordRef        = useRef(DECK_CARDS.map(c => c.id));
  const timer         = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deckRef       = useRef<HTMLDivElement>(null);
  const scrollerRef   = useRef<HTMLElement>(null);
  const lastTargetRef = useRef(0);  /* tracks last successfully requested targetId */

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

  return (
    /*
      Outer scroller — (N+1) viewports tall.
      This is the scroll runway. As the user moves through it, the sticky
      shell inside stays fixed and the active project changes.
    */
    <section
      ref={scrollerRef}
      style={{ position: 'relative', height: '300vh' }}
    >
      {/* Sticky shell — remains in viewport for the full scroll runway */}
      <div
        style={{
          position:       'sticky',
          top:            0,
          height:         '100vh',
          overflow:       'hidden',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'flex-start',
          padding:        'clamp(0.25rem, 1vh, 0.75rem) clamp(1.5rem, 3vw, 3rem) 4.5rem',
          fontFamily:     "'DM Mono', 'Courier New', monospace",
        }}
      >
        <div
          ref={deckRef}
          tabIndex={0}
          style={{
            position:   'relative',
            width:      'min(100%, 1240px)',
            height:     TOTAL_H,
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
                onPick={() => select(card.id)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── CardPanel ──────────────────────────────────────────────────────── */

interface CardPanelProps {
  card:    DeckCard;
  pos:     number;
  isFront: boolean;
  tabX:    number;
  theme:   TabTheme;
  onPick:  () => void;
}

function CardPanel({ card, pos, isFront, tabX, theme, onPick }: CardPanelProps) {
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

  return (
    <div
      style={{
        position:   'absolute',
        left:       0,
        right:      0,
        top,
        height:     CARD_H,
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
        {card.tab}
      </div>

      {/* ── Card body ── */}
      <div
        style={{
          position:     'absolute',
          inset:        0,
          background:   bg,
          border:       `1.5px solid ${bc}`,
          borderRadius: 18,
          overflow:     'hidden',
          boxShadow:    shadow,
          transition:   'box-shadow 0.4s',
        }}
      >
        {/* Peek label — visible in the exposed strip of each hidden card */}
        <div style={{
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

        {/* ── Active card content ── */}
        {isFront && (
          card.id === 0 ? (
            /* AI project — two-column split: left text / right demo */
            <div style={{
              position:   'absolute',
              inset:      0,
              paddingTop: 22,          /* clear peek label */
              display:    'flex',
              opacity:    show ? 1 : 0,
              transform:  show ? 'translateY(0)' : 'translateY(9px)',
              transition: 'opacity 0.34s ease, transform 0.34s ease',
              overflow:   'hidden',
            }}>

              {/* ── Left: title, subtitle, CTA ── */}
              <div style={{
                width:         '36%',
                flexShrink:    0,
                display:       'flex',
                flexDirection: 'column',
                justifyContent:'center',
                padding:       '28px 36px 40px 52px',
                borderRight:   '1px solid #ebebeb',
              }}>
                <h2 style={{
                  fontFamily:    "'Montserrat', sans-serif",
                  fontSize:      34,
                  fontWeight:    700,
                  lineHeight:    1.1,
                  color:         '#111',
                  letterSpacing: '-0.02em',
                  marginBottom:  10,
                  whiteSpace:    'pre-line',
                }}>
                  {card.heading}
                </h2>

                <p style={{
                  fontFamily:    "'DM Mono', monospace",
                  fontSize:      9.5,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  color:         '#aaa',
                  marginBottom:  20,
                }}>
                  {card.sub}
                </p>

                <div style={{ width: 28, height: 1, background: '#e0e0e0', marginBottom: 18 }} />

                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize:   12.5,
                  lineHeight: 1.80,
                  color:      '#777',
                }}>
                  {card.body}
                </p>

                {card.btn && (
                  <a
                    href="/ai-project"
                    style={{
                      display:        'inline-block',
                      marginTop:      28,
                      fontFamily:     "'DM Mono', monospace",
                      fontSize:       9.5,
                      letterSpacing:  '0.13em',
                      textTransform:  'uppercase',
                      color:          '#111',
                      textDecoration: 'none',
                      borderBottom:   '1px solid #111',
                      paddingBottom:  2,
                    }}
                  >
                    {card.btn}
                  </a>
                )}
              </div>

              {/* ── Right: interactive demo (no header — shown on left) ── */}
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <AICheckoutDemo show={show} hideHeader />
              </div>

            </div>
          ) : (
            /* Other projects — standard heading / body layout */
            <div style={{
              padding:    '12px 52px 44px',
              opacity:    show ? 1 : 0,
              transform:  show ? 'translateY(0px)' : 'translateY(9px)',
              transition: 'opacity 0.34s ease, transform 0.34s ease',
            }}>
              {/* Large heading */}
              <h2 style={{
                fontFamily:    "'Montserrat', sans-serif",
                fontSize:      44,
                fontWeight:    700,
                lineHeight:    1.07,
                color:         '#111',
                letterSpacing: '-0.02em',
                marginBottom:  10,
                whiteSpace:    'pre-line',
              }}>
                {card.heading}
              </h2>

              {/* Sub */}
              <p style={{
                fontFamily:    "'DM Mono', monospace",
                fontSize:      9.5,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color:         '#aaa',
                marginBottom:  22,
              }}>
                {card.sub}
              </p>

              {/* Rule */}
              <div style={{ width: 28, height: 1, background: '#e0e0e0', marginBottom: 20 }} />

              {/* Body text */}
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize:   12.5,
                lineHeight: 1.80,
                color:      '#777',
                maxWidth:   480,
              }}>
                {card.body}
              </p>

              {/* CTA button */}
              {card.btn && (
                <a
                  href="#"
                  style={{
                    display:        'inline-block',
                    marginTop:      24,
                    fontFamily:     "'DM Mono', monospace",
                    fontSize:       9.5,
                    letterSpacing:  '0.13em',
                    textTransform:  'uppercase',
                    color:          '#111',
                    textDecoration: 'none',
                    borderBottom:   '1px solid #111',
                    paddingBottom:  2,
                    opacity:        show ? 1 : 0,
                    transition:     'opacity 0.34s ease 0.1s',
                  }}
                >
                  {card.btn}
                </a>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
