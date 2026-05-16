'use client';

import { useState, useRef } from 'react';
import { PERSONAS, getMockCheckout } from './ai-checkout-mock';
import type { CheckoutData }          from './ai-checkout-types';
import CheckoutOutput, { Icon }       from './CheckoutOutput';

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

/* ── AiCheckoutPreview ───────────────────────────────────────────── */
export default function AiCheckoutPreview() {
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
    }, 120);
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      padding: '20px 24px 24px',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      gap: 14,
    }}>

      {/* Persona selector */}
      <div
        role="tablist"
        aria-label="Traveller personas"
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {PERSONAS.map((p, i) => {
          const isActive = activeIdx === i;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handlePersonaChange(i)}
              className="aip-proto-persona-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                background:   isActive ? '#fff' : '#fafafa',
                border:       `1px solid ${isActive ? '#b8b8b8' : '#e4e4e4'}`,
                borderRadius: 10, cursor: 'pointer',
                userSelect:   'none',
                transition:   'border-color 200ms ease, background 200ms ease, box-shadow 200ms ease',
                boxShadow:    isActive
                  ? '0 2px 8px rgba(0,0,0,0.07), 0 0 0 0.5px rgba(0,0,0,0.04), 0 3px 12px rgba(180,140,240,0.11)'
                  : 'none',
                outline: 'none',
              }}
            >
              <PersonaIcon iconName={p.iconName} active={isActive} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
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

      <CheckoutOutput
        checkout={isShimmering ? null : checkout}
        isLoading={isShimmering}
      />
    </div>
  );
}
