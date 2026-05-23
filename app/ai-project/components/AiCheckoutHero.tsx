'use client';

import { useState, useRef }            from 'react';
import { PERSONAS, getMockCheckout }   from './ai-checkout-mock';
import type { CheckoutData }           from './ai-checkout-types';
import CheckoutOutput, { Icon }        from './CheckoutOutput';
import { getBannerForPersona }         from '../lib/checkout-banners';

/* ── Persona icon ────────────────────────────────────────────────── */
function PersonaIcon({ iconName, active }: { iconName: string; active: boolean }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: active ? '#2a2a2a' : '#f0f0f0',
      transition: 'background 220ms ease-out',
    }}>
      <Icon name={iconName} size={15} stroke={active ? '#fff' : '#777'} />
    </div>
  );
}

function scrollToGenerator() {
  document.getElementById('try-it-yourself')?.scrollIntoView({ behavior: 'smooth' });
}

/* ── AiCheckoutHero ─────────────────────────────────────────────── */
export default function AiCheckoutHero() {
  const [activeIdx,    setActiveIdx]    = useState(0);
  const [checkout,     setCheckout]     = useState<CheckoutData>(() => getMockCheckout(PERSONAS[0].id));
  const [isShimmering, setIsShimmering] = useState(false);

  const shimmerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handlePersonaChange(idx: number) {
    if (idx === activeIdx) return;
    if (shimmerTimer.current) clearTimeout(shimmerTimer.current);
    setIsShimmering(true);
    shimmerTimer.current = setTimeout(() => {
      setActiveIdx(idx);
      setCheckout(getMockCheckout(PERSONAS[idx].id));
      setIsShimmering(false);
    }, 150);
  }

  return (
    <section className="aip-hero">
      <div className="aip-hero__inner">
        <div className="aip-hero__layout">

          {/* ── Left: copy + persona selector ─────────────────── */}
          <div className="aip-hero__copy">
            <div className="aip-hero__accent-bar" />
            <span className="aip-hero__eyebrow">Post-Purchase Personalisation</span>

            <h2 className="aip-hero__title">AI at Checkout</h2>

            <p className="aip-hero__subtitle">
              A post-purchase travel experience that turns booking data
              into tailored next steps for each traveller.
            </p>

            <div className="aip-hero__interaction">
              <span className="aip-hero__interaction-label">Choose a traveller</span>
              <p className="aip-hero__interaction-hint">
                Same booking system. Different traveller needs. Different checkout output.
              </p>

              <div
                role="tablist"
                aria-label="Traveller personas"
                className="aip-hero__personas"
              >
                {PERSONAS.map((p, i) => {
                  const isActive = activeIdx === i;
                  return (
                    <button
                      key={p.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handlePersonaChange(i)}
                      className="aip-hero__persona-btn"
                    >
                      <PersonaIcon iconName={p.iconName} active={isActive} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 13, fontWeight: 500, color: '#111', lineHeight: 1.2,
                        }}>
                          {p.name}
                        </span>
                        <span style={{ fontSize: 10.5, fontWeight: 400, color: '#999', letterSpacing: '0.1px' }}>
                          {p.traits}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button className="aip-hero__cta" onClick={scrollToGenerator}>
              Try your own checkout
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </button>

            <span className="aip-hero__demo-badge">
              Preloaded demo · Live generator below
            </span>
          </div>

          {/* ── Right: browser-framed output with glow ─────────── */}
          <div className="aip-hero__visual-frame">
            <CheckoutOutput
              checkout={isShimmering ? null : checkout}
              isLoading={isShimmering}
              bannerSrc={getBannerForPersona(PERSONAS[activeIdx].id)}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
