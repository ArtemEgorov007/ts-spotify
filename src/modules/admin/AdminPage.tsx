import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/modules/auth/authService';
import { APP_ROUTES } from '@/app/config/routes';
import {
  BarChart3,
  Music2,
  ClipboardCheck,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Server,
  Search,
  Upload,
  ArrowRight,
  LogOut,
  Play,
} from 'lucide-react';

const stats = [
  {
    label: 'Активные слушатели',
    value: '128 430',
    note: 'за сутки',
    icon: Users,
    trend: '+12%',
    trendUp: true,
  },
  {
    label: 'Загружено треков',
    value: '9 842',
    note: 'в каталоге',
    icon: Music2,
    trend: '+5%',
    trendUp: true,
  },
  {
    label: 'На модерации',
    value: '17',
    note: 'требуют проверки',
    icon: ClipboardCheck,
    trend: '-3%',
    trendUp: true,
  },
  {
    label: 'Новые артисты',
    value: '32',
    note: 'за неделю',
    icon: BarChart3,
    trend: '+8%',
    trendUp: true,
  },
];

const moderationQueue = [
  {
    track: 'Городские петли',
    artist: 'Алексей Волков',
    reason: 'Проверка прав',
    status: 'in-progress',
    statusLabel: 'В работе',
    time: '2 часа назад',
  },
  {
    track: 'Послесвечение',
    artist: 'Maria Nova',
    reason: 'Ошибка метаданных',
    status: 'pending',
    statusLabel: 'Ожидает',
    time: '4 часа назад',
  },
  {
    track: 'Сигнальные волны',
    artist: 'Night Drive',
    reason: 'Метка 18+',
    status: 'approved',
    statusLabel: 'Одобрено',
    time: '1 день назад',
  },
  {
    track: 'Эхо прошлого',
    artist: 'Ретро Группа',
    reason: 'Проверка качества',
    status: 'pending',
    statusLabel: 'Ожидает',
    time: '1 день назад',
  },
];

const systemStatus = [
  { name: 'API каталога', status: 'online', label: 'Онлайн' },
  { name: 'Индексация поиска', status: 'syncing', label: 'Синхронизация' },
  { name: 'Очередь загрузки', status: 'stable', label: 'Стабильно' },
  { name: 'Стриминг сервис', status: 'online', label: 'Онлайн' },
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'online':
      return <CheckCircle2 className="status-icon online" />;
    case 'syncing':
      return <Clock className="status-icon syncing" />;
    case 'stable':
      return <Server className="status-icon stable" />;
    default:
      return <AlertCircle className="status-icon offline" />;
  }
}

function getStatusChip(status: string) {
  const config: Record<string, { icon: JSX.Element; stateClass: string }> = {
    'in-progress': {
      icon: <Clock size={14} />,
      stateClass: 'in-progress',
    },
    pending: {
      icon: <AlertCircle size={14} />,
      stateClass: 'pending',
    },
    approved: {
      icon: <CheckCircle2 size={14} />,
      stateClass: 'approved',
    },
  };
  return config[status] || config.pending;
}

export function AdminPage() {
  const navigate = useNavigate();

  const goToApp = () => navigate(APP_ROUTES.app);
  const handleLogout = () => logoutUser(navigate);

  return (
    <div className="admin-page-wrapper">
      {/* Hero Section */}
      <header className="admin-hero">
        <div className="admin-hero-content">
          <div className="admin-hero-badge">
            <Play size={16} fill="currentColor" />
            <span>Admin Dashboard</span>
          </div>
          <h1>Панель управления</h1>
          <p>
            Контролируйте каталог, управляйте модерацией и отслеживайте
            метрики платформы в реальном времени
          </p>
          <div className="admin-hero-actions">
            <button
              type="button"
              className="btn btn-spotify"
              onClick={goToApp}
            >
              <Play size={18} fill="currentColor" />
              Перейти к приложению
            </button>
            <button
              type="button"
              className="btn btn-admin-outline"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Выйти
            </button>
          </div>
        </div>
        <div className="admin-hero-visual">
          <div className="hero-gradient-orb" />
        </div>
      </header>

      {/* Stats Grid */}
      <section className="admin-stats-section">
        <div className="section-header">
          <h2>Обзор платформы</h2>
        </div>
        <div className="admin-stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article key={stat.label} className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-icon-wrapper">
                    <Icon size={24} />
                  </div>
                  <span
                    className={`stat-trend ${stat.trendUp ? 'trend-up' : 'trend-down'}`}
                  >
                    {stat.trend}
                  </span>
                </div>
                <div className="stat-card-body">
                  <strong className="stat-value">{stat.value}</strong>
                  <h3 className="stat-label">{stat.label}</h3>
                  <p className="stat-note">{stat.note}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="admin-content-grid">
        {/* Moderation Queue */}
        <article className="admin-panel moderation-panel">
          <div className="panel-header">
            <div className="panel-title-wrapper">
              <ClipboardCheck size={24} className="panel-icon" />
              <h2>Очередь модерации</h2>
            </div>
            <button type="button" className="panel-action-btn">
              <Search size={20} />
              <span>Поиск</span>
            </button>
          </div>

          <div className="moderation-queue">
            {moderationQueue.map((item, index) => {
              const statusChip = getStatusChip(item.status);
              return (
                <div
                  key={item.track}
                  className="moderation-item"
                  style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
                >
                  <div className="moderation-cover">
                    <Music2 size={24} />
                  </div>
                  <div className="moderation-info">
                    <div className="moderation-track-row">
                      <strong className="track-name">{item.track}</strong>
                      <span className="artist-name">{item.artist}</span>
                    </div>
                    <div className="moderation-meta">
                      <span className="reason">{item.reason}</span>
                      <span className="time">{item.time}</span>
                    </div>
                  </div>
                  <div className={`status-chip ${statusChip.stateClass}`}>
                    {statusChip.icon}
                    <span>{item.statusLabel}</span>
                  </div>
                  <button
                    type="button"
                    className="moderation-action-btn"
                    aria-label="Действия"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              );
            })}
          </div>

          <button type="button" className="view-all-btn">
            Показать все заявки
            <ArrowRight size={18} />
          </button>
        </article>

        {/* System Status */}
        <article className="admin-panel status-panel">
          <div className="panel-header">
            <div className="panel-title-wrapper">
              <Server size={24} className="panel-icon" />
              <h2>Системный статус</h2>
            </div>
          </div>

          <div className="system-status-list">
            {systemStatus.map((system) => (
              <div key={system.name} className="system-status-item">
                <div className="system-info">
                  {getStatusIcon(system.status)}
                  <div className="system-details">
                    <span className="system-name">{system.name}</span>
                    <span className="system-status">{system.label}</span>
                  </div>
                </div>
                <div className="system-indicator">
                  <span
                    className={`indicator-dot ${system.status}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className="quick-actions-grid">
              <button type="button" className="quick-action-btn">
                <Upload size={20} />
                <span>Загрузить трек</span>
              </button>
              <button type="button" className="quick-action-btn">
                <Search size={20} />
                <span>Поиск треков</span>
              </button>
              <button type="button" className="quick-action-btn">
                <Users size={20} />
                <span>Артисты</span>
              </button>
              <button type="button" className="quick-action-btn">
                <BarChart3 size={20} />
                <span>Аналитика</span>
              </button>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
