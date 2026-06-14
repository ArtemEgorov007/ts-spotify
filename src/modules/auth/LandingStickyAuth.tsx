import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useIsMobileShell } from '@/shared/hooks/useMediaQuery';

type LandingStickyAuthProps = {
  children: ReactNode;
};

const DOCK_BOTTOM_OFFSET = 12;

function readSafeAreaBottom() {
  const probe = document.createElement('div');
  probe.style.paddingBottom = 'env(safe-area-inset-bottom)';
  document.body.appendChild(probe);
  const value = Number.parseFloat(getComputedStyle(probe).paddingBottom);
  document.body.removeChild(probe);
  return Number.isFinite(value) ? value : 0;
}

export function LandingStickyAuth({ children }: LandingStickyAuthProps) {
  const isMobileShell = useIsMobileShell();
  const slotRef = useRef<HTMLDivElement>(null);
  const [isFloating, setIsFloating] = useState(true);

  useEffect(() => {
    if (!isMobileShell) {
      return;
    }

    const slot = slotRef.current;
    if (!slot) {
      return;
    }

    const update = () => {
      const rect = slot.getBoundingClientRect();
      const settleLine =
        window.innerHeight - rect.height - DOCK_BOTTOM_OFFSET - readSafeAreaBottom();
      setIsFloating(rect.top > settleLine);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isMobileShell]);

  if (!isMobileShell) {
    return <div className="landing-actions">{children}</div>;
  }

  return (
    <div
      ref={slotRef}
      className={`landing-cta-slot${isFloating ? '' : ' landing-cta-slot--settled'}`}
    >
      <div className={`landing-cta-dock${isFloating ? ' landing-cta-dock--float' : ''}`}>
        <div className="landing-actions landing-actions--dock">{children}</div>
      </div>
    </div>
  );
}
