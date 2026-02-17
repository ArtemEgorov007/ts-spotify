import { observer } from 'mobx-react-lite';
import { mockTracks } from '@/shared/mock/media';
import { musicPlatformStore } from '@/store/store';
import { PlayIcon } from '@/shared/icons/Icons';

export const HomePage = observer(function HomePage() {
  return (
    <section>
      <h2 className="section-title">Рекомендованные треки</h2>
      <div className="track-grid">
        {mockTracks.map((track) => (
          <article className="track-card" key={track.id}>
            <img src={track.coverUrl} alt={track.title} />
            <strong>{track.title}</strong>
            <span>{track.artist}</span>
            <button type="button" onClick={() => musicPlatformStore.play(track)}>
              <PlayIcon /> Слушать
            </button>
          </article>
        ))}
      </div>
    </section>
  );
});
