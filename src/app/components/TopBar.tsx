import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { musicPlatformStore } from '@/store/store';

export const TopBar = observer(function TopBar() {
  const navigate = useNavigate();
  const goToAdmin = () => navigate('/admin');

  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">В приложении</p>
        <h1 className="topbar-title">Добрый вечер</h1>
      </div>
      <button type="button" className="role-chip role-chip-button" onClick={goToAdmin}>
        {musicPlatformStore.roleChipLabel}
      </button>
    </header>
  );
});
