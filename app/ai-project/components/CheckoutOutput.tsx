'use client';

import { useState, useEffect } from 'react';
import type { Card, CheckoutData } from './ai-checkout-types';

export interface CheckoutOutputProps {
  checkout:   CheckoutData | null;
  isLoading?: boolean;
  error?:     string | null;
  onRetry?:   () => void;
}

/* ── Card width logic ────────────────────────────────────────────
   flex-grow ratios:
     0 open  →  1 : 1 : 1   (equal thirds)
     1 open  →  4 : 1 : 1   (~60% : 20% : 20%)
     2 open  →  5 : 5 : 2   (~42% : 42% : 17%)
     3 open  →  1 : 1 : 1   (equal thirds)
──────────────────────────────────────────────────────────────── */
function cardFlexGrow(cardIdx: number, openCards: Set<number>): number {
  const openCount = openCards.size;
  const isOpen    = openCards.has(cardIdx);
  if (openCount === 0 || openCount === 3) return 1;
  if (isOpen) return openCount === 1 ? 4 : 5;
  return openCount === 1 ? 1 : 2;
}

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

export function Icon({ name, size = 15, stroke = '#666' }: { name: string; size?: number; stroke?: string }) {
  switch (name) {
    case 'passport': return <Svg size={size} stroke={stroke}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 7h6m-6 4h6m-6 4h4"/></Svg>;
    case 'park':     return <Svg size={size} stroke={stroke}><path d="M12 2l4 8H8l4-8z"/><path d="M7 10l5 10 5-10M12 20v-6"/></Svg>;
    case 'train':    return <Svg size={size} stroke={stroke}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 12h20M7 20l-2-2M17 20l2-2"/></Svg>;
    case 'map':      return <Svg size={size} stroke={stroke}><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z"/></Svg>;
    case 'compass':  return <Svg size={size} stroke={stroke}><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></Svg>;
    case 'car':      return <Svg size={size} stroke={stroke}><path d="M5 17H3a2 2 0 0 1-2-2v-3l2.5-7h13l2.5 7v3a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></Svg>;
    case 'star':     return <Svg size={size} stroke={stroke}><path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 16.7l-6.2 4.3 2.4-7.3L2 9.2h7.6z"/></Svg>;
    case 'food':     return <Svg size={size} stroke={stroke}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><path d="M6 1v3m4-3v3m4-3v3"/></Svg>;
    case 'family':   return <Svg size={size} stroke={stroke}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
    case 'camera':   return <Svg size={size} stroke={stroke}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></Svg>;
    case 'couple':   return <Svg size={size} stroke={stroke}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
    case 'check':    return <Svg size={size} stroke={stroke}><polyline points="20 6 9 17 4 12"/></Svg>;
    case 'chevron':  return <Svg size={size} stroke={stroke}><polyline points="6 9 12 15 18 9"/></Svg>;
    default:         return <Svg size={size} stroke={stroke}><circle cx="12" cy="12" r="5"/></Svg>;
  }
}

/* ── Loading skeleton ────────────────────────────────────────────── */
function CheckoutSkeleton() {
  const sk = (w: string | number, h: number, extra?: React.CSSProperties) => (
    <div className="aip-proto-skeleton" style={{ width: w, height: h, borderRadius: 4, ...extra }} />
  );
  return (
    <div style={{ padding: '22px 22px 26px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid #f0f0f0' }}>
        <div className="aip-proto-skeleton" style={{ width: 34, height: 34, borderRadius: '50%', margin: '0 auto 12px' }} />
        {sk('55%', 18, { margin: '0 auto 8px' })}
        {sk('40%', 13, { margin: '0 auto' })}
      </div>

      {/* Trip strip */}
      <div style={{
        display: 'flex', background: '#f7f7f7', borderRadius: 8,
        marginBottom: 18, overflow: 'hidden',
      }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            flex: '1 1 auto', padding: '9px 20px', textAlign: 'center',
            borderRight: i < 3 ? '1px solid #ebebeb' : 'none',
          }}>
            {sk('50%', 8,  { margin: '0 auto 6px' })}
            {sk('70%', 12, { margin: '0 auto' })}
          </div>
        ))}
      </div>

      {/* Section label */}
      {sk(140, 8, { marginBottom: 12 })}

      {/* Cards */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ flex: '1 1 0', background: '#f7f7f7', borderRadius: 9, padding: 12 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <div className="aip-proto-skeleton" style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0 }} />
              {sk('60%', 13, { marginTop: 5 })}
            </div>
            {sk('90%', 10, { marginBottom: 6 })}
            {sk('75%', 10, { marginBottom: 10 })}
            {sk('35%', 16, { borderRadius: 4 })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Error state ─────────────────────────────────────────────────── */
function CheckoutError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{
      padding: '44px 22px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: '#fafafa', border: '1px solid #e8e8e8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
      }}>
        ⚠
      </div>
      <p style={{
        fontSize: 13, color: '#666', lineHeight: 1.55,
        maxWidth: 300, margin: 0,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        {message}
      </p>
      <button onClick={onRetry} className="aip-proto-retry-btn">
        Try again
      </button>
    </div>
  );
}

/* ── Expandable rec card ─────────────────────────────────────────── */
function ExpandableCard({ card, isExpanded, compact, onToggle }: {
  card:       Card;
  isExpanded: boolean;
  compact:    boolean;
  onToggle:   () => void;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        background:   isExpanded ? '#fff' : '#f7f7f7',
        borderRadius: 9,
        border:       `1px solid ${isExpanded ? '#e0e0e0' : 'transparent'}`,
        cursor:       'pointer',
        height:       '100%',
        boxSizing:    'border-box',
        transition:   'border-color 220ms ease, background 220ms ease, box-shadow 220ms ease',
        boxShadow:    isExpanded ? '0 2px 12px rgba(0,0,0,0.05)' : 'none',
        overflow:     'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '12px 12px 11px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6, flexShrink: 0,
              background:  isExpanded ? '#2a2a2a' : '#fff',
              display:     'flex', alignItems: 'center', justifyContent: 'center',
              transition:  'background 220ms ease',
            }}>
              <Icon name={card.icon} size={13} stroke={isExpanded ? '#fff' : '#666'} />
            </div>
            <span style={{
              fontFamily:      "'Outfit', sans-serif",
              fontSize:        13.5, fontWeight: 500, color: '#111', lineHeight: 1.25,
              overflow:        'hidden',
              display:         '-webkit-box',
              WebkitLineClamp: compact ? 2 : 'unset',
              WebkitBoxOrient: 'vertical',
            }}>
              {card.title}
            </span>
          </div>
          <div style={{
            transform:  isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 260ms ease',
            flexShrink: 0, marginTop: 3,
          }}>
            <Icon name="chevron" size={13} stroke={isExpanded ? '#888' : '#bbb'} />
          </div>
        </div>

        {!isExpanded && !compact && (
          <span style={{ fontSize: 12, fontWeight: 400, color: '#555', lineHeight: 1.5 }}>
            {card.summary}
          </span>
        )}

        <span style={{
          display:       'inline-block',
          fontFamily:    "'DM Mono', monospace",
          fontSize:      9, fontWeight: 500, letterSpacing: '0.5px',
          textTransform: 'uppercase', color: isExpanded ? '#666' : '#888',
          background:    isExpanded ? '#f0f0f0' : '#ebebeb',
          padding:       '2px 8px', borderRadius: 4,
          alignSelf:     'flex-start',
          transition:    'background 220ms ease, color 220ms ease',
        }}>
          {card.tag}
        </span>
      </div>

      {/* Expanded drawer */}
      <div style={{
        display:          'grid',
        gridTemplateRows: isExpanded ? '1fr' : '0fr',
        transition:       'grid-template-rows 280ms ease',
      }}>
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div style={{ padding: '0 12px 16px', borderTop: '1px solid #ebebeb' }}>
            <p style={{
              fontSize: 12.5, fontWeight: 400, color: '#444',
              lineHeight: 1.65, marginTop: 12, marginBottom: 14,
            }}>
              {card.expanded.intro}
            </p>

            {card.expanded.sections.map((section, si) => (
              <div
                key={si}
                style={{
                  paddingTop: si > 0 ? 12 : 0,
                  borderTop:  si > 0 ? '1px solid #f3f3f3' : 'none',
                }}
              >
                <div style={{
                  fontFamily:    "'DM Mono', monospace",
                  fontSize:      9, fontWeight: 500, letterSpacing: '0.8px',
                  textTransform: 'uppercase', color: '#bbb', marginBottom: 7,
                }}>
                  {section.heading}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {section.bullets.map((b, bi) => (
                    <li key={bi} style={{
                      fontSize: 12, lineHeight: 1.6, color: '#3a3a3a',
                      paddingLeft: '1.1rem', position: 'relative',
                      marginBottom: bi < section.bullets.length - 1 ? 5 : 0,
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: '#ccc', userSelect: 'none' }}>–</span>
                      {b}
                    </li>
                  ))}
                </ul>
                {section.tip && (
                  <div style={{
                    marginTop:  9, padding: '8px 11px',
                    background: '#f8f8fc', borderRadius: 6,
                    borderLeft: '2px solid #c8c4e0',
                    fontSize:   11.5, color: '#555', lineHeight: 1.55, fontStyle: 'italic',
                  }}>
                    {section.tip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── CheckoutOutput ──────────────────────────────────────────────── */
export default function CheckoutOutput({ checkout, isLoading = false, error = null, onRetry }: CheckoutOutputProps) {
  const [openCards, setOpenCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    setOpenCards(new Set());
  }, [checkout]);

  function toggleCard(cardIdx: number) {
    setOpenCards(prev => {
      const next = new Set(prev);
      if (next.has(cardIdx)) next.delete(cardIdx); else next.add(cardIdx);
      return next;
    });
  }

  const anyOpen = openCards.size > 0;

  return (
    <div style={{
      borderRadius: 14, border: '1px solid #e4e4e4',
      boxShadow: '0 2px 20px rgba(0,0,0,0.05), 0 0 0 0.5px rgba(0,0,0,0.03)',
      overflow: 'hidden', background: '#fff',
    }}>
      {/* Toolbar */}
      <div style={{
        height: 32, flexShrink: 0, background: '#f5f5f5',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 5,
      }}>
        {[0,1,2].map(d => (
          <span key={d} style={{ width: 8, height: 8, borderRadius: '50%', background: '#ddd', flexShrink: 0 }} />
        ))}
        <div style={{
          flex: 1, height: 20, background: '#fff', borderRadius: 4,
          marginLeft: 8, display: 'flex', alignItems: 'center', padding: '0 10px',
          fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#aaa',
          letterSpacing: '0.2px', overflow: 'hidden', whiteSpace: 'nowrap',
        }}>
          travel.app/booking/confirmed
        </div>
      </div>

      <div className="ai-output-separator" />

      {/* Three mutually exclusive body states */}

      {isLoading && <CheckoutSkeleton />}

      {!isLoading && error && (
        <CheckoutError
          message={error}
          onRetry={onRetry ?? (() => {})}
        />
      )}

      {!isLoading && !error && checkout && (
        <div style={{ padding: '22px 22px 26px' }}>

          {/* Confirmation header */}
          <div style={{
            textAlign: 'center', marginBottom: 18,
            paddingBottom: 18, borderBottom: '1px solid #f0f0f0',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', background: '#2a2a2a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
            }}>
              <Icon name="check" size={15} stroke="#fff" />
            </div>
            <h3 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 20, fontWeight: 500, letterSpacing: '-0.3px',
              marginBottom: 6, color: '#111',
            }}>
              {checkout.title}
            </h3>
            <p style={{
              fontSize: 13.5, fontWeight: 300, color: '#555',
              lineHeight: 1.55, maxWidth: 420, margin: '0 auto',
            }}>
              {checkout.subtitle}
            </p>
          </div>

          {/* Trip strip */}
          <div style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
            background: '#f7f7f7', borderRadius: 8, marginBottom: 18, overflow: 'hidden',
          }}>
            {([
              { label: 'Destination', value: checkout.trip_info.destination },
              { label: 'Dates',       value: checkout.trip_info.dates       },
              { label: 'Travellers',  value: checkout.trip_info.travellers  },
              { label: 'Length',      value: checkout.trip_info.nights      },
            ] as const).map((item, idx, arr) => (
              <div
                key={item.label}
                style={{
                  textAlign: 'center', padding: '9px 20px',
                  borderRight: idx < arr.length - 1 ? '1px solid #ebebeb' : 'none',
                  flex: '1 1 auto',
                }}
              >
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9, fontWeight: 500, textTransform: 'uppercase',
                  letterSpacing: '0.9px', color: '#aaa', marginBottom: 4,
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13.5, fontWeight: 500, color: '#222',
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Section label */}
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9.5, fontWeight: 500, textTransform: 'uppercase',
            letterSpacing: '1px', color: '#bbb', marginBottom: 10,
          }}>
            Recommended next steps
          </div>

          {/* Cards */}
          <div className="aip-proto-cards-row">
            {checkout.cards.map((card, ci) => {
              const isExpanded = openCards.has(ci);
              const compact    = anyOpen && !isExpanded;
              return (
                <div
                  key={card.id}
                  style={{
                    flexGrow:   cardFlexGrow(ci, openCards),
                    flexShrink: 1,
                    flexBasis:  0,
                    minWidth:   0,
                    transition: 'flex-grow 320ms ease',
                  }}
                >
                  <ExpandableCard
                    card={card}
                    isExpanded={isExpanded}
                    compact={compact}
                    onToggle={() => toggleCard(ci)}
                  />
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <p style={{
            marginTop:  18, fontSize: 10.5, color: '#ccc', textAlign: 'center',
            fontFamily: "'DM Mono', monospace", letterSpacing: '0.3px',
          }}>
            Content generated by AI · Based on known traveller data
          </p>
        </div>
      )}
    </div>
  );
}
