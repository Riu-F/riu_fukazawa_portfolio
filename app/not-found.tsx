'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import KoiPond from './components/KoiPond';

const RES_DESKTOP = { width: 720, height: 480 };
const RES_MOBILE  = { width: 480, height: 320 };

export default function NotFound() {
  const [resolution, setResolution] = useState(RES_DESKTOP);

  useEffect(() => {
    const pick = () => {
      setResolution(window.innerWidth < 768 ? RES_MOBILE : RES_DESKTOP);
    };
    pick();
    window.addEventListener('resize', pick);
    return () => window.removeEventListener('resize', pick);
  }, []);

  return (
    <main
      style={{
        position:   'relative',
        width:      '100vw',
        height:     '100vh',
        overflow:   'hidden',
        margin:     0,
        padding:    0,
      }}
    >
      <KoiPond
        resolution={resolution}
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
            background:             'rgba(0, 0, 0, 0.3)',
            backdropFilter:         'blur(10px)',
            WebkitBackdropFilter:   'blur(10px)',
            borderRadius:           16,
            padding:                'clamp(24px, 5vw, 40px) clamp(32px, 6vw, 48px)',
            textAlign:              'center',
            pointerEvents:          'none',
            maxWidth:               420,
            margin:                 '0 1.25rem',
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
              margin:     '0 0 1.25rem',
            }}
          >
            This page drifted away.
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize:   'clamp(14px, 3.2vw, 16px)',
              fontWeight: 300,
              fontStyle:  'italic',
              lineHeight: 1.5,
              color:      'rgba(255, 255, 255, 0.6)',
              margin:     '0 0 1.5rem',
            }}
          >
            Click anywhere to make ripples while you&apos;re here.
          </p>
          <Link
            href="/"
            style={{
              display:        'inline-block',
              fontFamily:     "'Inter', sans-serif",
              fontSize:       'clamp(14px, 3.2vw, 16px)',
              fontWeight:     400,
              color:          'rgba(255, 255, 255, 0.7)',
              textDecoration: 'underline',
              textUnderlineOffset: '0.2em',
              pointerEvents:  'auto',
              transition:     'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; }}
          >
            ← Back to Shore
          </Link>
        </div>
      </div>
    </main>
  );
}
