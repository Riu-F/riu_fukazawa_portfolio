'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Expandable bento row — behaviour matches the original Webflow script:
 * one expanded panel at a time, outside click collapses, Enter/Space when focused.
 */
export default function ProjectBentoRow({ children }: { children: ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const boxes = Array.from(row.querySelectorAll<HTMLElement>('.bento-box'));
    if (boxes.length === 0) return;

    const collapseAll = (except?: HTMLElement) => {
      for (const b of boxes) {
        if (b !== except && b.classList.contains('expanded')) {
          b.classList.remove('expanded');
          b.setAttribute('aria-expanded', 'false');
        }
      }
    };

    const toggleBox = (target: HTMLElement) => {
      if (target.classList.contains('expanded')) return;
      collapseAll(target);
      target.classList.add('expanded');
      target.setAttribute('aria-expanded', 'true');
    };

    boxes.forEach((box) => {
      if (!box.hasAttribute('tabindex')) box.setAttribute('tabindex', '0');
      box.setAttribute('role', 'button');
      box.setAttribute('aria-expanded', 'false');
    });

    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!boxes.some((b) => b.contains(t))) collapseAll();
    };

    const cleanups: Array<() => void> = [];

    boxes.forEach((box) => {
      const onClick = (e: MouseEvent) => {
        const el = e.target as HTMLElement;
        if (el.closest('button, input, select, textarea, details, summary, [data-no-toggle]')) {
          return;
        }
        const link = el.closest('a');
        if (link) e.preventDefault();
        toggleBox(box);
        e.stopPropagation();
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.target !== box) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleBox(box);
        }
      };
      box.addEventListener('click', onClick);
      box.addEventListener('keydown', onKey);
      cleanups.push(() => {
        box.removeEventListener('click', onClick);
        box.removeEventListener('keydown', onKey);
      });
    });

    document.addEventListener('click', onDocClick);
    cleanups.push(() => document.removeEventListener('click', onDocClick));

    return () => {
      for (const u of cleanups) u();
    };
  }, []);

  return (
    <div className="bento-row" ref={rowRef}>
      {children}
    </div>
  );
}
