import { NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  HomeIcon,
  LibraryIcon,
  LogoutIcon,
  SearchIcon,
  SidebarModeIcon,
  PlusIcon,
} from '@/shared/icons/Icons';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { logoutUser } from '@/modules/auth/authService';
import { APP_ROUTES } from '@/app/config/routes';
import './Sidebar.css';

type SidebarProps = {
  collapsed: boolean;
  onToggleMode: () => void;
};

type SidebarLinkItem = {
  label: string;
  to: string;
  Icon: typeof HomeIcon;
  end?: boolean;
};

const primaryNavItems: SidebarLinkItem[] = [
  { label: 'Главная', to: APP_ROUTES.app, Icon: HomeIcon, end: true },
  { label: 'Поиск', to: APP_ROUTES.search, Icon: SearchIcon },
];

const libraryNavItems: SidebarLinkItem[] = [
  { label: 'Медиатека', to: APP_ROUTES.library, Icon: LibraryIcon },
];

function SidebarNavLinks({ items }: { items: SidebarLinkItem[] }) {
  return (
    <>
      {items.map(({ label, to, Icon, end = false }) => (
        <NavLink key={to} to={to} end={end} className="sidebar-link">
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </>
  );
}

export const Sidebar = observer(function Sidebar({ collapsed, onToggleMode }: SidebarProps) {
  const navigate = useNavigate();

  const onLogout = () => logoutUser(navigate);

  return (
    <aside className={`sidebar${collapsed ? ' sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand" aria-label="ts-music">
          <div className="sidebar-brand-logo">
            <svg viewBox="0 0 24 24" className="music-logo" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
              />
            </svg>
          </div>
          {!collapsed && <h2>ts-music</h2>}
        </div>
        <button
          type="button"
          className="sidebar-mode-toggle"
          onClick={onToggleMode}
          aria-label={collapsed ? 'Развернуть боковую панель' : 'Свернуть боковую панель'}
          title={collapsed ? 'Развернуть' : 'Свернуть'}
        >
          <SidebarModeIcon />
        </button>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav-section">
          {!collapsed && <h3 className="sidebar-section-title">Навигация</h3>}
          <div className="sidebar-nav-links">
            <SidebarNavLinks items={primaryNavItems} />
          </div>
        </nav>

        <nav className="sidebar-nav-section">
          {!collapsed && <h3 className="sidebar-section-title">Ваша медиатека</h3>}
          <div className="sidebar-nav-links">
            <SidebarNavLinks items={libraryNavItems} />
            <button type="button" className="sidebar-link sidebar-link-action">
              <PlusIcon />
              <span>Создать плейлист</span>
            </button>
          </div>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-row">
          <ThemeToggle compact />
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={onLogout}
            aria-label="Выйти"
            title="Выйти"
          >
            <LogoutIcon />
            {!collapsed && <span>Выйти</span>}
          </button>
        </div>
      </div>
    </aside>
  );
});
