import { useEffect, useRef } from 'react';
import type { MoodKey } from '@/shared/api/jamendo';

type MoodColors = { a: string; b: string };

export const MOOD_AMBIENT: Record<MoodKey, MoodColors> = {
  morning: { a: '255, 184, 140', b: '255, 122, 89' },
  energy: { a: '255, 95, 109', b: '255, 195, 113' },
  relax: { a: '132, 250, 176', b: '143, 211, 244' },
  focus: { a: '0, 198, 255', b: '0, 114, 255' },
  night: { a: '102, 126, 234', b: '118, 75, 162' },
};

function parseTriplet(value: string): [number, number, number] {
  const [r, g, b] = value.split(',').map((part) => Number.parseFloat(part));
  return [r, g, b];
}

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function lerpTriplet(from: [number, number, number], to: [number, number, number], t: number) {
  return [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  ]
    .map((channel) => Math.round(channel))
    .join(', ');
}

function applyMoodVars(colors: MoodColors, node: HTMLElement | null) {
  document.documentElement.style.setProperty('--mood-a', colors.a);
  document.documentElement.style.setProperty('--mood-b', colors.b);

  if (node) {
    node.style.setProperty('--mood-a', colors.a);
    node.style.setProperty('--mood-b', colors.b);
  }
}

const TRANSITION_MS = 720;

export function useMoodAmbient(moodKey: MoodKey, targetRef: React.RefObject<HTMLElement | null>) {
  const frameRef = useRef<number | null>(null);
  const currentRef = useRef<MoodColors>(MOOD_AMBIENT[moodKey]);

  useEffect(() => {
    applyMoodVars(currentRef.current, targetRef.current);
  }, [targetRef]);

  useEffect(() => {
    const node = targetRef.current;
    if (!node) {
      return;
    }

    const next = MOOD_AMBIENT[moodKey];
    const from = currentRef.current;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      applyMoodVars(next, node);
      currentRef.current = next;
      return;
    }

    const fromA = parseTriplet(from.a);
    const fromB = parseTriplet(from.b);
    const toA = parseTriplet(next.a);
    const toB = parseTriplet(next.b);
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / TRANSITION_MS);
      const eased = easeOutExpo(t);
      const colors = {
        a: lerpTriplet(fromA, toA, eased),
        b: lerpTriplet(fromB, toB, eased),
      };

      applyMoodVars(colors, node);

      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        currentRef.current = next;
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [moodKey, targetRef]);
}
