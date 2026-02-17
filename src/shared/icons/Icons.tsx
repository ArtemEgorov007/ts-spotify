import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon(props: IconProps) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props} />;
}

export function HomeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 11.5L12 4l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-8.5z" stroke="currentColor" strokeWidth="1.8" />
    </BaseIcon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.8" />
    </BaseIcon>
  );
}

export function LibraryIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="4" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="10" y="4" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 4v16" stroke="currentColor" strokeWidth="1.8" />
    </BaseIcon>
  );
}

export function AdminIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 4l7 4v8l-7 4-7-4V8l7-4z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </BaseIcon>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M8 6l10 6-10 6V6z" fill="currentColor" />
    </BaseIcon>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="7" y="6" width="3.5" height="12" fill="currentColor" />
      <rect x="13.5" y="6" width="3.5" height="12" fill="currentColor" />
    </BaseIcon>
  );
}
