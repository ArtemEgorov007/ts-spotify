import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { authStore } from '@/store/store';
import { ThemeToggle } from '@/app/components/ThemeToggle';

export const TopBar = observer(function TopBar() {
  const navigate = useNavigate();
  const goToAdmin = () => navigate('/admin');
  const roleLabel = authStore.roleChipLabel;
  const roleInitial = (roleLabel.trim().charAt(0) || 'Г').toUpperCase();

  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">Раздел</p>
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
