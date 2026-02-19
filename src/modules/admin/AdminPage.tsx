import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/modules/auth/authService';

const stats = [
  { label: 'Активные слушатели', value: '128 430', note: 'за сутки' },
  { label: 'Загружено треков', value: '9 842', note: 'в каталоге' },
  { label: 'На модерации', value: '17', note: 'требуют проверки' },
  { label: 'Новые артисты', value: '32', note: 'за неделю' },
];

const moderationQueue = [
  { track: 'Городские петли', reason: 'Проверка прав', status: 'В работе' },
  { track: 'Послесвечение', reason: 'Ошибка метаданных', status: 'Ожидает' },
  { track: 'Сигнальные волны', reason: 'Метка 18+', status: 'Готово' },
];

export function AdminPage() {
  const navigate = useNavigate();

  const goToApp = () => navigate('/app');
  const handleLogout = () => logoutUser(navigate);

  return (
    <main className="admin-page">
      <header className="admin-header">
        <p className="admin-kicker">Панель управления</p>
        <h1>Админ-панель</h1>
        <p>Контроль каталога, модерации и статуса сервисов.</p>
      </header>

      <div className="admin-cards">
        {stats.map((item) => (
          <article key={item.label}>
            <h3>{item.label}</h3>
            <strong>{item.value}</strong>
            <p>{item.note}</p>
          </article>
        ))}
      </div>

      <section className="admin-workspace">
        <article className="admin-panel">
          <h2>Очередь модерации</h2>
          <ul className="moderation-list">
            {moderationQueue.map((item) => (
              <li key={item.track} className="moderation-item">
                <div className="moderation-main">
                  <strong>{item.track}</strong>
                  <p>{item.reason}</p>
                </div>
                <span className="admin-status-chip">{item.status}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="admin-panel">
          <h2>Системный статус</h2>
          <ul className="admin-meta-list">
            <li>
              <span>API каталога</span>
              <strong>Онлайн</strong>
            </li>
            <li>
              <span>Индексация поиска</span>
              <strong>Синхронизируется</strong>
            </li>
            <li>
              <span>Очередь загрузки</span>
              <strong>Стабильно</strong>
            </li>
          </ul>
        </article>
      </section>

      <div className="admin-actions">
        <button type="button" className="btn btn-primary" onClick={goToApp}>
          К приложению
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </main>
  );
}
