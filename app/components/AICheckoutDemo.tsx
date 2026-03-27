'use client';

/*
  AICheckoutDemo
  ─────────────
  Interactive visualisation for "AI at Checkout: Personalising the
  Post-Purchase Experience" — renders inside the AI project card of
  ProjectDeck.

  Architecture:
  • Self-contained: owns its own IntersectionObserver and auto-loop
  • All imperative state (timers, active index) via refs to avoid
    stale closures in setInterval callbacks
  • React state used only for render-triggering (active index, pulse keys)
  • CSS classes for pseudo-states and keyframe animations (globals.css)
  • Inline styles for all layout / structural values
*/

import { useState, useEffect, useRef, useCallback } from 'react';

/* ── Timing ─────────────────────────────────────────────────────── */
const CYCLE     = 2800;
const HOVER_DLY = 1800;
const CLICK_DLY = 2500;
const KB_DLY    = 4000;

/* ── Data ───────────────────────────────────────────────────────── */
const PERSONAS = [
  { name: 'Solo Explorer',    traits: 'Flexible · Adventure-led' },
  { name: 'Budget Traveller', traits: 'Cost-conscious · Efficient' },
  { name: 'Luxury Couple',    traits: 'Comfort · Premium' },
] as const;

interface RecCard { label: string; desc: string; tag: string; icon: string }
interface State   { heading: string; sub: string; travellers: string; cards: RecCard[] }

const STATES: State[] = [
  {
    heading:    'Your booking is confirmed',
    sub:        "Here's everything you need to start exploring Tokyo.",
    travellers: '1 Guest',
    cards: [
      { label: 'Explore Nearby',     desc: 'Hidden gems and local favourites within walking distance.', tag: 'Discovery', icon: 'map'   },
      { label: 'Flexible Transport', desc: 'IC cards, day passes, and routes that adapt to your plans.', tag: 'Flexible',  icon: 'train' },
      { label: 'Local Picks',        desc: "Curated by locals — street food, temples, nightlife.",       tag: 'Adventure', icon: 'bell'  },
    ],
  },
  {
    heading:    'Purchase complete',
    sub:        "We've prioritised the most useful next steps to help you save.",
    travellers: '1 Guest',
    cards: [
      { label: 'Best Value Transport',    desc: 'Cheapest Narita transfer: bus, train, shuttle compared.',  tag: 'Save ¥2,400', icon: 'coins' },
      { label: 'Cheap Eats Nearby',       desc: 'Top-rated budget spots and konbini guides near your hotel.', tag: 'Under ¥800', icon: 'food'  },
      { label: 'Budget-Friendly Add-ons', desc: 'Free tours, discount museum passes, and low-cost day trips.', tag: 'Best value', icon: 'heart' },
    ],
  },
  {
    heading:    "You're all set",
    sub:        'Your post-booking experience has been tailored for comfort and ease.',
    travellers: '2 Guests',
    cards: [
      { label: 'Private Transfer',     desc: 'Luxury sedan from Haneda to your hotel. Driver confirmed.',  tag: 'Premium',   icon: 'car'  },
      { label: 'Premium Stay Details', desc: 'Suite upgrades, spa reservations, and late checkout.',       tag: 'Top-rated', icon: 'home' },
      { label: 'Curated Experiences',  desc: 'Private tea ceremonies, Michelin dining, exclusive access.', tag: 'Reserved',  icon: 'star' },
    ],
  },
];

/* ── SVG helpers ─────────────────────────────────────────────────── */
function Svg({ children, size = 16, stroke = 'currentColor' }: {
  children: React.ReactNode; size?: number; stroke?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size}
      fill="none" stroke={stroke}
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function Icon({ name, size = 15, stroke = '#666' }: { name: string; size?: number; stroke?: string }) {
  switch (name) {
    case 'compass': return <Svg size={size} stroke={stroke}><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></Svg>;
    case 'card':    return <Svg size={size} stroke={stroke}><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></Svg>;
    case 'star':    return <Svg size={size} stroke={stroke}><path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 16.7l-6.2 4.3 2.4-7.3L2 9.2h7.6z"/></Svg>;
    case 'map':     return <Svg size={size} stroke={stroke}><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z"/></Svg>;
    case 'train':   return <Svg size={size} stroke={stroke}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 12h20"/></Svg>;
    case 'bell':    return <Svg size={size} stroke={stroke}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></Svg>;
    case 'coins':   return <Svg size={size} stroke={stroke}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></Svg>;
    case 'food':    return <Svg size={size} stroke={stroke}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><path d="M6 1v3m4-3v3m4-3v3"/></Svg>;
    case 'heart':   return <Svg size={size} stroke={stroke}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></Svg>;
    case 'car':     return <Svg size={size} stroke={stroke}><path d="M5 17H3a2 2 0 0 1-2-2v-3l2.5-7h13l2.5 7v3a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></Svg>;
    case 'home':    return <Svg size={size} stroke={stroke}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Svg>;
    case 'check':   return <Svg size={size} stroke={stroke}><polyline points="20 6 9 17 4 12"/></Svg>;
    default:        return <Svg size={size} stroke={stroke}><circle cx="12" cy="12" r="5"/></Svg>;
  }
}

/* Persona icons — distinct glyph per archetype */
function PersonaIcon({ index, active }: { index: number; active: boolean }) {
  const iconNames = ['compass', 'card', 'star'];
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background:  active ? '#2a2a2a' : '#f0f0f0',
      transition:  'background 220ms ease-out',
    }}>
      <Icon name={iconNames[index]} size={15} stroke={active ? '#fff' : '#777'} />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
interface Props {
  show:        boolean;
  hideHeader?: boolean;  /* omit the title/description block when using split layout */
}

export default function AICheckoutDemo({ show, hideHeader }: Props) {
  const [active, setActive]           = useState(0);
  const [nodePulsing, setNodePulsing] = useState(false);
  const [upperKey, setUpperKey]       = useState(0);
  const [lowerKey, setLowerKey]       = useState(0);

  /* Refs for imperative loop logic (avoid stale closures) */
  const activeRef   = useRef(0);
  const interacting = useRef(false);
  const inViewRef   = useRef(false);
  const loopRef     = useRef<ReturnType<typeof setInterval>  | null>(null);
  const resumeRef   = useRef<ReturnType<typeof setTimeout>   | null>(null);
  const pulseRef    = useRef<ReturnType<typeof setTimeout>   | null>(null);
  const lowerRef    = useRef<ReturnType<typeof setTimeout>   | null>(null);
  const rootRef     = useRef<HTMLDivElement>(null);
  const rowRef      = useRef<HTMLDivElement>(null);
  const rmRef       = useRef(false);

  useEffect(() => {
    rmRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  /* ── Core activate ───────────────────────────────────────────── */
  const activate = useCallback((idx: number) => {
    if (idx === activeRef.current) return;
    activeRef.current = idx;
    setActive(idx);
    if (rmRef.current) return;
    /* Upper connector pulse */
    setUpperKey(k => k + 1);
    /* Node pulse */
    setNodePulsing(true);
    if (pulseRef.current) clearTimeout(pulseRef.current);
    pulseRef.current = setTimeout(() => setNodePulsing(false), 900);
    /* Lower connector pulse — staggered 200ms */
    if (lowerRef.current) clearTimeout(lowerRef.current);
    lowerRef.current = setTimeout(() => setLowerKey(k => k + 1), 200);
  }, []);

  /* ── Loop ────────────────────────────────────────────────────── */
  const stopLoop = useCallback(() => {
    if (loopRef.current) { clearInterval(loopRef.current); loopRef.current = null; }
  }, []);

  const startLoop = useCallback(() => {
    stopLoop();
    if (rmRef.current || interacting.current || !inViewRef.current) return;
    loopRef.current = setInterval(() => {
      activate((activeRef.current + 1) % 3);
    }, CYCLE);
  }, [stopLoop, activate]);

  const scheduleResume = useCallback((delay: number) => {
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => {
      interacting.current = false;
      startLoop();
    }, delay);
  }, [startLoop]);

  /* ── IntersectionObserver ────────────────────────────────────── */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        inViewRef.current = e.isIntersecting;
        if (e.isIntersecting && !interacting.current && show) startLoop();
        else if (!e.isIntersecting) stopLoop();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, startLoop, stopLoop]);

  /* ── Start/stop loop when card becomes front ─────────────────── */
  useEffect(() => {
    if (show && inViewRef.current) startLoop();
    if (!show) stopLoop();
  }, [show, startLoop, stopLoop]);

  /* ── Cleanup ─────────────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      stopLoop();
      if (resumeRef.current) clearTimeout(resumeRef.current);
      if (pulseRef.current)  clearTimeout(pulseRef.current);
      if (lowerRef.current)  clearTimeout(lowerRef.current);
    };
  }, [stopLoop]);

  /* ── Interaction handlers ────────────────────────────────────── */
  const handleHoverEnter = useCallback((idx: number) => {
    interacting.current = true;
    if (resumeRef.current) clearTimeout(resumeRef.current);
    stopLoop();
    activate(idx);
  }, [stopLoop, activate]);

  const handleRowLeave = useCallback(() => {
    scheduleResume(HOVER_DLY);
  }, [scheduleResume]);

  const handleClick = useCallback((idx: number) => {
    interacting.current = true;
    if (resumeRef.current) clearTimeout(resumeRef.current);
    stopLoop();
    activate(idx);
    scheduleResume(CLICK_DLY);
  }, [stopLoop, activate, scheduleResume]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, idx: number) => {
    const getCards = () =>
      rowRef.current?.querySelectorAll<HTMLButtonElement>('[data-persona-idx]');

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      interacting.current = true;
      if (resumeRef.current) clearTimeout(resumeRef.current);
      stopLoop();
      activate(idx);
      if (!rmRef.current) scheduleResume(KB_DLY);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (idx + 1) % 3;
      getCards()?.[next].focus();
      interacting.current = true;
      if (resumeRef.current) clearTimeout(resumeRef.current);
      stopLoop();
      activate(next);
      if (!rmRef.current) scheduleResume(KB_DLY);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (idx + 2) % 3;
      getCards()?.[prev].focus();
      interacting.current = true;
      if (resumeRef.current) clearTimeout(resumeRef.current);
      stopLoop();
      activate(prev);
      if (!rmRef.current) scheduleResume(KB_DLY);
    }
  }, [stopLoop, activate, scheduleResume]);

  const handleFocus = useCallback(() => {
    if (!interacting.current) { interacting.current = true; stopLoop(); }
  }, [stopLoop]);

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div
      ref={rootRef}
      style={{
        height:        '100%',
        display:       'flex',
        flexDirection: 'column',
        padding:       '14px 24px 14px',
        fontFamily:    "'DM Sans', system-ui, sans-serif",
        WebkitFontSmoothing: 'antialiased',
      }}
    >

      {/* ── Header — hidden in split-layout mode ────────────────── */}
      {!hideHeader && (
        <div style={{ textAlign: 'center', marginBottom: 16, flexShrink: 0 }}>
          <h2 style={{
            fontFamily:    "'Outfit', sans-serif",
            fontSize:      24,
            fontWeight:    500,
            letterSpacing: '-0.4px',
            lineHeight:    1.2,
            color:         '#111',
            marginBottom:  10,
            maxWidth:      520,
            margin:        '0 auto 10px',
          }}>
            AI at Checkout: Personalising the Post-Purchase Experience
          </h2>
          <p style={{
            fontSize:   15,
            fontWeight: 300,
            color:      '#555',
            lineHeight: 1.55,
            maxWidth:   480,
            margin:     '0 auto',
          }}>
            Same booking. Different traveler. A post-purchase interface that adapts the moment checkout is complete.
          </p>
        </div>
      )}

      {/* ── Pipeline ───────────────────────────────────────────── */}
      <div style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        flex:           1,
        minHeight:      0,
      }}>

        {/* ── Persona row ──────────────────────────────────────── */}
        <div
          ref={rowRef}
          role="tablist"
          aria-label="Traveller personas"
          onMouseLeave={handleRowLeave}
          className="ai-persona-row"
          style={{
            display:        'flex',
            justifyContent: 'center',
            gap:            10,
            width:          '100%',
            maxWidth:       680,
            flexShrink:     0,
          }}
        >
          {PERSONAS.map((p, i) => {
            const isActive = active === i;
            return (
              <button
                key={i}
                data-persona-idx={i}
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                className="ai-persona-card"
                data-active={isActive ? 'true' : undefined}
                onMouseEnter={() => handleHoverEnter(i)}
                onClick={() => handleClick(i)}
                onKeyDown={e => handleKeyDown(e, i)}
                onFocus={handleFocus}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            10,
                  padding:        '10px 14px',
                  background:     isActive ? '#fff' : '#fafafa',
                  border:         `1px solid ${isActive ? '#b8b8b8' : '#e4e4e4'}`,
                  borderRadius:   10,
                  cursor:         'pointer',
                  userSelect:     'none',
                  transition:     'border-color 220ms ease-out, background 220ms ease-out, box-shadow 220ms ease-out',
                  /* Monochrome lift + whisper of rainbow on the active card */
                  boxShadow:      isActive
                    ? '0 2px 8px rgba(0,0,0,0.07), 0 0 0 0.5px rgba(0,0,0,0.04), 0 3px 12px rgba(180,140,240,0.11), 0 3px 12px rgba(130,200,220,0.09)'
                    : 'none',
                  outline:        'none',
                  minWidth:       152,
                  flexShrink:     0,
                }}
              >
                <PersonaIcon index={i} active={isActive} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize:   13,
                    fontWeight:  500,
                    color:      '#111',
                    lineHeight:  1.2,
                  }}>
                    {p.name}
                  </span>
                  <span style={{
                    fontSize:   10.5,
                    fontWeight:  400,
                    color:      '#999',
                    letterSpacing: '0.1px',
                  }}>
                    {p.traits}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Upper connector ──────────────────────────────────── */}
        <div style={{ height: 24, display: 'flex', alignItems: 'stretch', flexShrink: 0 }}>
          <div style={{ width: 1, background: '#d8d8d8', position: 'relative' }}>
            {upperKey > 0 && (
              <>
                {/* Line flash — the whole connector briefly glows rainbow */}
                <div key={`uflash${upperKey}`} className="ai-connector-flash" />
                {/* Pulse dot — travels down the line */}
                <div key={`u${upperKey}`} className="ai-connector-pulse" />
              </>
            )}
          </div>
        </div>

        {/* ── AI node ─ rainbow border wrapper ────────────────── */}
        <div
          className="ai-engine-wrapper"
          style={{
            /* Soft rainbow-tinted spread on pulse; fades via transition */
            boxShadow:  nodePulsing
              ? '0 0 14px 4px rgba(180,160,240,0.18), 0 0 14px 4px rgba(130,200,220,0.13)'
              : '0 0 0 0 transparent',
            transition: 'box-shadow 450ms ease-out',
          }}
        >
          <div style={{
            width:          178,
            height:         36,
            borderRadius:   18,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            7,
            background:     '#fff',
          }}>
            {/* Dot — always rainbow (tiny prismatic accent) */}
            <div style={{
              width:           6,
              height:          6,
              borderRadius:    '50%',
              background:      'var(--ai-rainbow)',
              backgroundSize:  '200% 200%',
              flexShrink:      0,
            }} />
            <span style={{
              fontFamily:    "'DM Mono', monospace",
              fontSize:      9.5,
              fontWeight:    500,
              letterSpacing: '0.7px',
              textTransform: 'uppercase',
              color:         nodePulsing ? '#888' : '#aaa',
              transition:    'color 450ms ease-out',
            }}>
              AI Engine
            </span>
          </div>
        </div>

        {/* ── Lower connector ──────────────────────────────────── */}
        <div style={{ height: 24, display: 'flex', alignItems: 'stretch', flexShrink: 0 }}>
          <div style={{ width: 1, background: '#d8d8d8', position: 'relative' }}>
            {lowerKey > 0 && (
              <>
                <div key={`lflash${lowerKey}`} className="ai-connector-flash" />
                <div key={`l${lowerKey}`} className="ai-connector-pulse" />
              </>
            )}
          </div>
        </div>

        {/* ── Output frame ─────────────────────────────────────── */}
        <div style={{
          width:        '100%',
          maxWidth:     840,
          flex:         1,
          minHeight:    0,
          display:      'flex',
          flexDirection: 'column',
          borderRadius: 14,
          border:       '1px solid #e4e4e4',
          boxShadow:    '0 2px 20px rgba(0,0,0,0.05), 0 0 0 0.5px rgba(0,0,0,0.03)',
          overflow:     'hidden',
          background:   '#fff',
        }}>

          {/* Browser toolbar */}
          <div style={{
            height:        32,
            flexShrink:    0,
            background:    '#f5f5f5',
            borderBottom:  '1px solid #e8e8e8',
            display:       'flex',
            alignItems:    'center',
            padding:       '0 14px',
            gap:           5,
          }}>
            {[0,1,2].map(d => (
              <span key={d} style={{ width: 8, height: 8, borderRadius: '50%', background: '#ddd', flexShrink: 0 }} />
            ))}
            <div style={{
              flex:          1,
              height:        20,
              background:    '#fff',
              borderRadius:  4,
              marginLeft:    8,
              display:       'flex',
              alignItems:    'center',
              padding:       '0 10px',
              fontFamily:    "'DM Mono', monospace",
              fontSize:      10,
              color:         '#aaa',
              letterSpacing: '0.2px',
              overflow:      'hidden',
              whiteSpace:    'nowrap',
            }}>
              travel.app/booking/confirmed
            </div>
          </div>

          {/* Rainbow separator — a 2px prism line between toolbar and content */}
          <div className="ai-output-separator" />

          {/* Output body — fixed height, states overlap via absolute */}
          <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {STATES.map((s, i) => (
              <div
                key={i}
                role="tabpanel"
                className={`ai-output-state${active === i ? ' active' : ''}`}
              >
                {/* Success area */}
                <div style={{
                  textAlign:    'center',
                  marginBottom: 12,
                  paddingBottom: 12,
                  borderBottom: '1px solid #f0f0f0',
                  flexShrink:   0,
                }}>
                  <div style={{
                    width:          34,
                    height:         34,
                    borderRadius:   '50%',
                    background:     '#2a2a2a',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    margin:         '0 auto 10px',
                  }}>
                    <Icon name="check" size={15} stroke="#fff" />
                  </div>
                  <h3 style={{
                    fontFamily:    "'Outfit', sans-serif",
                    fontSize:      21,
                    fontWeight:    500,
                    letterSpacing: '-0.3px',
                    marginBottom:  5,
                    color:         '#111',
                  }}>
                    {s.heading}
                  </h3>
                  <p style={{
                    fontSize:   13.5,
                    fontWeight:  300,
                    color:      '#555',
                    lineHeight:  1.5,
                    maxWidth:    360,
                    margin:     '0 auto',
                  }}>
                    {s.sub}
                  </p>
                </div>

                {/* Trip strip */}
                <div style={{
                  display:        'flex',
                  justifyContent: 'center',
                  gap:            24,
                  padding:        '9px 16px',
                  background:     '#f7f7f7',
                  borderRadius:   8,
                  marginBottom:   12,
                  flexShrink:     0,
                }}>
                  {[
                    { label: 'Destination', value: 'Tokyo, Japan' },
                    { label: 'Dates',       value: '14–21 Mar' },
                    { label: 'Travellers',  value: s.travellers },
                  ].map(item => (
                    <div key={item.label} style={{ textAlign: 'center' }}>
                      <div style={{
                        fontFamily:    "'DM Mono', monospace",
                        fontSize:      9.5,
                        fontWeight:    500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.9px',
                        color:         '#aaa',
                        marginBottom:  3,
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize:   14,
                        fontWeight:  500,
                        color:      '#222',
                      }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next steps label */}
                <div style={{
                  fontFamily:    "'DM Mono', monospace",
                  fontSize:      10,
                  fontWeight:    500,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color:         '#aaa',
                  marginBottom:  9,
                  flexShrink:    0,
                }}>
                  Recommended next steps
                </div>

                {/* Rec cards */}
                <div
                  className="ai-rec-grid"
                  style={{
                    display:             'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap:                 10,
                    flex:                1,
                  }}
                >
                  {s.cards.map((card, ci) => (
                    <div
                      key={ci}
                      className="ai-rec-card"
                      style={{
                        background:   '#f7f7f7',
                        borderRadius: 9,
                        padding:      '12px 12px 10px',
                        display:      'flex',
                        flexDirection: 'column',
                        gap:          5,
                      }}
                    >
                      <div style={{
                        width:          26,
                        height:         26,
                        borderRadius:   6,
                        background:     '#fff',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        flexShrink:     0,
                      }}>
                        <Icon name={card.icon} size={13} stroke="#666" />
                      </div>
                      <span style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize:   14,
                        fontWeight:  500,
                        color:      '#111',
                        lineHeight:  1.2,
                      }}>
                        {card.label}
                      </span>
                      <span style={{
                        fontSize:   12.5,
                        fontWeight:  300,
                        color:      '#555',
                        lineHeight:  1.45,
                        flex:        1,
                      }}>
                        {card.desc}
                      </span>
                      <span style={{
                        display:       'inline-block',
                        fontFamily:    "'DM Mono', monospace",
                        fontSize:      9,
                        fontWeight:    500,
                        letterSpacing: '0.4px',
                        textTransform: 'uppercase',
                        color:         '#888',
                        background:    '#ebebeb',
                        padding:       '2px 7px',
                        borderRadius:  4,
                        alignSelf:     'flex-start',
                        marginTop:     2,
                      }}>
                        {card.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
