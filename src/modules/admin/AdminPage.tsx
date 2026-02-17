import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { musicPlatformStore } from '@/store/store';

export function AdminPage() {
  const navigate = useNavigate();
  const { logout: logoutAuth0 } = useAuth0();

  const goToApp = () => navigate('/app');
  const handleLogout = () => {
    musicPlatformStore.clearAuthUser();
    logoutAuth0({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <main className="admin-page">
      <header>
        <h1>Админ-панель</h1>
        <p>Заглушка для модерации, аналитики и управления каталогом.</p>
      </header>

      <div className="admin-cards">
        <article><h3>Активные слушатели за день</h3><strong>128,430</strong></article>
        <article><h3>Загруженные треки</h3><strong>9,842</strong></article>
        <article><h3>Ожидают проверки</h3><strong>17</strong></article>
        <article><h3>Новые артисты</h3><strong>32</strong></article>
      </div>

      <section className="admin-table-wrap">
        <h2>Очередь модерации (заглушка)</h2>
        <table>
          <thead>
            <tr>
              <th>Трек</th>
              <th>Причина</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Городские петли</td><td>Проверка прав</td><td>В проверке</td></tr>
            <tr><td>Послесвечение</td><td>Ошибка метаданных</td><td>Ожидает</td></tr>
            <tr><td>Сигнальные волны</td><td>Метка 18+</td><td>Решено</td></tr>
          </tbody>
        </table>
      </section>

      <div className="admin-actions">
        <button type="button" className="btn btn-primary" onClick={goToApp}>Перейти в приложение</button>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>Выйти</button>
      </div>
    </main>
  );
}
