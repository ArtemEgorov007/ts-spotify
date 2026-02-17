import { NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuth0 } from '@auth0/auth0-react';
import { musicPlatformStore } from '@/store/store';
import { AdminIcon, HomeIcon, LibraryIcon, SearchIcon } from '@/shared/icons/Icons';
import { clearVkSession } from '@/modules/auth/vkSession';

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
          <HomeIcon /> Главная
        </NavLink>
        <NavLink to="/app/search" className="sidebar-link">
          <SearchIcon /> Поиск
        </NavLink>
        <NavLink to="/app/library" className="sidebar-link">
          <LibraryIcon /> Моя медиатека
        </NavLink>
        <NavLink to="/admin" className="sidebar-link">
          <AdminIcon /> Админ
        </NavLink>
      </nav>

      <button type="button" className="btn btn-ghost" onClick={onLogout}>
        Выйти
      </button>
    </aside>
  );
});
