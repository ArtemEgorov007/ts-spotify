import { mockTracks } from '@/shared/mock/media';
import { formatDuration } from '@/shared/lib/format';

export function SearchPage() {
  return (
    <section>
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
            <span>{formatDuration(track.durationSec)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
