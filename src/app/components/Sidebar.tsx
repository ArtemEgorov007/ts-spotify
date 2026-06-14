import { NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { House, Library, LogOut, PanelLeftClose, Search, type LucideIcon } from 'lucide-react';
import { BrandLogo } from '@/app/components/BrandLogo';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { logoutUser } from '@/modules/auth/authService';
import { APP_ROUTES } from '@/app/config/routes';
import { useIsMobileShell } from '@/shared/hooks/useMediaQuery';
import './Sidebar.css';

type SidebarProps = {
  collapsed: boolean;
  onToggleMode: () => void;
};

type SidebarLinkItem = {
  label: string;
  to: string;
  Icon: LucideIcon;
  end?: boolean;
};

const primaryNavItems: SidebarLinkItem[] = [
  { label: 'Главная', to: APP_ROUTES.app, Icon: House, end: true },
  { label: 'Поиск', to: APP_ROUTES.search, Icon: Search },
];

const libraryNavItems: SidebarLinkItem[] = [
  { label: 'Медиатека', to: APP_ROUTES.library, Icon: Library },
];

function SidebarNavLinks({ items }: { items: SidebarLinkItem[] }) {
  return (
    <>
      {items.map(({ label, to, Icon, end = false }) => (
        <NavLink key={to} to={to} end={end} className="sidebar-link">
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </>
  );
}

export const Sidebar = observer(function Sidebar({ collapsed, onToggleMode }: SidebarProps) {
  const navigate = useNavigate();
  const isMobileShell = useIsMobileShell();

  const onLogout = () => logoutUser(navigate);

  return (
    <aside
      className={`sidebar${collapsed ? ' sidebar-collapsed' : ''}`}
      aria-label="Основная навигация"
    >
      <div className="sidebar-header">
        <BrandLogo showTitle={!collapsed} className="sidebar-brand" />
        <button
          type="button"
          className="sidebar-mode-toggle"
          onClick={onToggleMode}
          aria-label={collapsed ? 'Развернуть боковую панель' : 'Свернуть боковую панель'}
          title={collapsed ? 'Развернуть' : 'Свернуть'}
        >
          <PanelLeftClose aria-hidden="true" />
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
          {!collapsed && <h3 className="sidebar-section-title">Твоя медиатека</h3>}
          <div className="sidebar-nav-links">
            <SidebarNavLinks items={libraryNavItems} />
          </div>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-row">
          {!isMobileShell ? <ThemeToggle compact /> : null}
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={onLogout}
            aria-label="Выйти"
            title="Выйти"
          >
            <LogOut aria-hidden="true" />
            {!collapsed && <span>Выйти</span>}
          </button>
        </div>
      </div>
    </aside>
  );
});
