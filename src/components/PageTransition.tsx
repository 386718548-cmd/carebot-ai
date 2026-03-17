'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.animation = 'none';
    void el.offsetHeight; // force reflow
    el.style.animation = 'page-enter 0.35s cubic-bezier(0.22, 1, 0.36, 1) both';
  }, [pathname]);

  return (
    <div ref={ref} className="page-enter flex-1">
      {children}
    </div>
  );
}
