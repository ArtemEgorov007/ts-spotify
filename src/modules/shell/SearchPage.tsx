import { mockTracks } from '@/shared/mock/media';

export function SearchPage() {
  return (
    <section>
      <h2 className="section-title">Поиск</h2>
      <div className="search-box">Заглушка поиска: треки, альбомы, артисты, подкасты...</div>
      <div className="tag-row">
        <span>Поп</span>
        <span>Чилл</span>
        <span>Фокус</span>
        <span>Тренировка</span>
        <span>Электроника</span>
      </div>

      <div className="results-list">
        {mockTracks.slice(0, 4).map((track) => (
          <div key={track.id} className="result-item">
            <img src={track.coverUrl} alt={track.title} />
            <div>
              <strong>{track.title}</strong>
              <p>{track.artist}</p>
            </div>
            <span>{Math.floor(track.durationSec / 60)}:{String(track.durationSec % 60).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
