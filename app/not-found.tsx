'use client';

import Link from 'next/link';
import KoiPond from './components/KoiPond';

const TEXT_SHADOW = '0 1px 6px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 0, 0, 0.4)';

export default function NotFound() {
  return (
    <main
      style={{
        position: 'relative',
        width:    '100vw',
        height:   '100vh',
        overflow: 'hidden',
        margin:   0,
        padding:  0,
      }}
    >
      <KoiPond
        baseHeight={480}
        style={{
          position: 'fixed',
          inset:    0,
          width:    '100vw',
          height:   '100vh',
          zIndex:   0,
        }}
      />

      <div
        style={{
          position:       'relative',
          zIndex:         1,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          width:          '100vw',
          height:         '100vh',
          pointerEvents:  'none',
        }}
      >
        <div
          style={{
            textAlign:     'center',
            pointerEvents: 'none',
            maxWidth:      420,
            margin:        '0 1.25rem',
          }}
        >
          <p
            style={{
              fontFamily:    "'DM Mono', monospace",
              fontSize:      'clamp(48px, 12vw, 72px)',
              fontWeight:    500,
              lineHeight:    1,
              color:         'rgba(255, 255, 255, 0.9)',
              margin:        '0 0 1rem',
              letterSpacing: '-0.02em',
              textShadow:    TEXT_SHADOW,
            }}
          >
            404
          </p>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize:   'clamp(18px, 4vw, 22px)',
              fontWeight: 400,
              lineHeight: 1.4,
              color:      'rgba(255, 255, 255, 0.8)',
              margin:     '0 0 1.5rem',
              textShadow: TEXT_SHADOW,
            }}
          >
            This page drifted away.
          </p>
          <Link
            href="/"
            style={{
              display:             'inline-block',
              fontFamily:          "'Inter', sans-serif",
              fontSize:            'clamp(14px, 3.2vw, 16px)',
              fontWeight:          400,
              color:               'rgba(255, 255, 255, 0.7)',
              textDecoration:      'underline',
              textUnderlineOffset: '0.2em',
              pointerEvents:       'auto',
              textShadow:          TEXT_SHADOW,
              transition:          'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
