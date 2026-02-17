import { NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuth0 } from '@auth0/auth0-react';
import { musicPlatformStore } from '@/store/store';
import { HomeIcon, LibraryIcon, SearchIcon } from '@/shared/icons/Icons';
import { clearVkSession } from '@/modules/auth/vkSession';
import { ThemeToggle } from '@/app/components/ThemeToggle';

export const Sidebar = observer(function Sidebar() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth0();

  const onLogout = () => {
    musicPlatformStore.clearAuthUser();
    clearVkSession();

    if (isAuthenticated) {
      logout({ logoutParams: { returnTo: window.location.origin } });
      return;
    }

    navigate('/');
  };

  return (
    <aside className="sidebar">
      <h2>ts-spotify</h2>
      <nav>
        <NavLink to="/app" end className="sidebar-link">
          <HomeIcon />
          <span>Главная</span>
        </NavLink>
        <NavLink to="/app/search" className="sidebar-link">
          <SearchIcon />
          <span>Поиск</span>
        </NavLink>
        <NavLink to="/app/library" className="sidebar-link">
          <LibraryIcon />
          <span>Моя медиатека</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-theme-row">
          <ThemeToggle compact />
        </div>

        <button type="button" className="btn btn-ghost sidebar-logout" onClick={onLogout}>
          Выйти
        </button>
      </div>
    </aside>
  );
});
