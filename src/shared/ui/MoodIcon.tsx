import type { LucideIcon } from 'lucide-react';
import { Crosshair, Leaf, Moon, Sunrise, Zap } from 'lucide-react';
import type { MoodKey } from '@/shared/api/jamendo';

const MOOD_ICON_MAP: Record<MoodKey, LucideIcon> = {
  morning: Sunrise,
  energy: Zap,
  relax: Leaf,
  focus: Crosshair,
  night: Moon,
};

type MoodIconProps = {
  moodKey: MoodKey;
  active?: boolean;
  size?: number;
  className?: string;
};

export function MoodIcon({ moodKey, active = false, size = 18, className = '' }: MoodIconProps) {
  const Icon = MOOD_ICON_MAP[moodKey];

  return (
    <span
      className={`mood-icon${active ? ' mood-icon-active' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <Icon size={size} strokeWidth={2.25} />
    </span>
  );
}
