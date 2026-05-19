'use client';

import AiNav from './ai-project/components/AiNav';
import KoiPond from './components/KoiPond';

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
        underwaterText="404"
        baseHeight={480}
        style={{
          position: 'absolute',
          inset:    0,
          width:    '100%',
          height:   '100%',
          zIndex:   0,
        }}
      />

      <AiNav transparent />
    </main>
  );
}
