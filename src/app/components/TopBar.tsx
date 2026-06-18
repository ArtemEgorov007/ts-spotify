import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { authStore, playerStore } from '@/store/store';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { logoutUser } from '@/modules/auth/authService';
import { getAppSectionTitle, getPlaylistIdFromPath } from '@/app/config/routes';
import { useIsMobileShell } from '@/shared/hooks/useMediaQuery';
import './TopBar.css';

export const TopBar = observer(function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobileShell = useIsMobileShell();
  const roleLabel = authStore.roleChipLabel;
  const roleInitial = (roleLabel.trim().charAt(0) || 'Г').toUpperCase();
  const playlistId = getPlaylistIdFromPath(location.pathname);
  const playlistTitle = playlistId ? playerStore.getPlaylistById(playlistId)?.title : null;
  const sectionTitle = useMemo(
    () => getAppSectionTitle(location.pathname, playlistTitle),
    [location.pathname, playlistTitle],
  );
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const content = document.getElementById('main-content');
    if (!content) {
      return;
    }

    const updateScrollState = () => {
      setIsScrolled(content.scrollTop > 8);
    };

    updateScrollState();
    content.addEventListener('scroll', updateScrollState, { passive: true });
    return () => content.removeEventListener('scroll', updateScrollState);
  }, [location.pathname]);

  const onLogout = () => logoutUser(navigate);

  return (
    <header className={`topbar${isScrolled ? ' topbar-scrolled' : ''}`}>
      <div className="topbar-main">
        <p className="topbar-label">{playlistTitle ? 'Плейлист' : 'Раздел'}</p>
        <h1 className="topbar-title">{sectionTitle}</h1>
      </div>
      <div className="topbar-controls">
        {isMobileShell ? <ThemeToggle compact className="topbar-action-theme" /> : null}
        {isMobileShell ? (
          <button
            type="button"
            className="topbar-action-btn topbar-logout-btn"
            onClick={onLogout}
            aria-label="Выйти"
            title="Выйти"
          >
            <LogOut aria-hidden="true" />
          </button>
        ) : null}
        <div className="role-chip">
          <span className="role-chip-full">{roleLabel}</span>
          <span className="role-chip-mobile">{roleInitial}</span>
        </div>
      </div>
    </header>
  );
});
