import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '@/store/store';
import { ThemeToggle } from '@/app/components/ThemeToggle';

export const TopBar = observer(function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const goToAdmin = () => navigate('/admin');
  const roleLabel = authStore.roleChipLabel;
  const roleInitial = (roleLabel.trim().charAt(0) || 'Г').toUpperCase();
  const sectionTitle = useMemo(() => {
    if (location.pathname.startsWith('/app/search')) {
      return 'Поиск';
    }

    if (location.pathname.startsWith('/app/library')) {
      return 'Медиатека';
    }

    return 'Главная';
  }, [location.pathname]);

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
        <button type="button" className="role-chip role-chip-button" onClick={goToAdmin}>
          <span className="role-chip-full">{roleLabel}</span>
          <span className="role-chip-mobile">{roleInitial}</span>
        </button>
      </div>
    </header>
  );
});
