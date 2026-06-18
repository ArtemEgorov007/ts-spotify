import { createPortal } from 'react-dom';

export function AmbientBackdrop() {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="landing-backdrop" aria-hidden="true">
      <span className="landing-orb landing-orb-1" />
      <span className="landing-orb landing-orb-2" />
      <span className="landing-orb landing-orb-3" />
      <span className="landing-orb landing-orb-4" />
    </div>,
    document.body,
  );
}
