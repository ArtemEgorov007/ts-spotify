import { NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { HomeIcon, LibraryIcon, SearchIcon } from '@/shared/icons/Icons';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { logoutUser } from '@/modules/auth/authService';

export const Sidebar = observer(function Sidebar() {
  const navigate = useNavigate();

  const onLogout = () => logoutUser(navigate);

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
