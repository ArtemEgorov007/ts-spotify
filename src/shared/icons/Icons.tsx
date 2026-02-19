import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon(props: IconProps) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props} />;
}

export function HomeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M3 11.5L12 4l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-8.5z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
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

export function SunIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
    </BaseIcon>
  );
}

export function PrevIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M19 20L9 12l10-10v20z" fill="currentColor" />
      <rect x="5" y="4" width="4" height="16" fill="currentColor" />
    </BaseIcon>
  );
}

export function NextIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 4l10 8-10 8V4z" fill="currentColor" />
      <rect x="15" y="4" width="4" height="16" fill="currentColor" />
    </BaseIcon>
  );
}

export function ShuffleIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </BaseIcon>
  );
}

export function RepeatIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M17 1l4 4-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M3 11V9a4 4 0 014-4h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M7 23l-4-4 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M21 13v2a4 4 0 01-4 4H3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </BaseIcon>
  );
}

export function VolumeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
      <path
        d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </BaseIcon>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </BaseIcon>
  );
}
