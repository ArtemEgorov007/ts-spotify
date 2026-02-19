import { mockTracks } from '@/shared/mock/media';

export function SearchPage() {
  return (
    <section>
      <h2 className="section-title">Поиск</h2>
      <p className="section-subtitle">Треки, артисты и плейлисты.</p>
      <div className="search-box">Поле поиска появится на следующем этапе.</div>
      <div className="tag-row">
        <span>Поп</span>
        <span>Чилл</span>
        <span>Фокус</span>
        <span>Бег</span>
        <span>Электро</span>
      </div>

      <div className="results-list">
        {mockTracks.slice(0, 4).map((track) => (
          <div key={track.id} className="result-item">
            <img src={track.coverUrl} alt={track.title} />
            <div>
              <strong>{track.title}</strong>
              <p>{track.artist}</p>
            </div>
            <span>
              {Math.floor(track.durationSec / 60)}:{String(track.durationSec % 60).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
