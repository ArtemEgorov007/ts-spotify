import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { authStore } from '@/store/store';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { getAppSectionTitle } from '@/app/config/routes';
import './TopBar.css';

export const TopBar = observer(function TopBar() {
  const location = useLocation();
  const roleLabel = authStore.roleChipLabel;
  const roleInitial = (roleLabel.trim().charAt(0) || 'Г').toUpperCase();
  const sectionTitle = useMemo(() => getAppSectionTitle(location.pathname), [location.pathname]);

  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">Раздел</p>
        <h1 className="topbar-title">{sectionTitle}</h1>
      </div>
      <div className="topbar-controls">
        <div className="topbar-mobile-theme">
          <ThemeToggle compact />
        </div>
        <div className="role-chip">
          <span className="role-chip-full">{roleLabel}</span>
          <span className="role-chip-mobile">{roleInitial}</span>
        </div>
      </div>
    </header>
  );
});
