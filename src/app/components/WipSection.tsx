import type { ReactNode } from 'react';

type WipSectionProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export function WipSection({
  children,
  title = 'В разработке',
  description = 'Медиатека скоро будет доступна — работаем над плейлистами и сохранёнными подборками.',
}: WipSectionProps) {
  return (
    <div className="wip-section">
      <div className="wip-section-content" aria-hidden="true">
        {children}
      </div>
      <div className="wip-section-overlay" role="status">
        <p className="wip-section-title">{title}</p>
        <p className="wip-section-description">{description}</p>
      </div>
    </div>
  );
}
