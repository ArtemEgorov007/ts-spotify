type BrandLogoProps = {
  showTitle?: boolean;
  className?: string;
};

export function BrandLogo({ showTitle = true, className = '' }: BrandLogoProps) {
  return (
    <div className={`brand-logo${className ? ` ${className}` : ''}`} aria-label="ts-music">
      <div className="brand-logo-mark">
        <svg viewBox="0 0 24 24" className="music-logo" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
          />
        </svg>
      </div>
      {showTitle ? <span className="brand-logo-title">ts-music</span> : null}
    </div>
  );
}
