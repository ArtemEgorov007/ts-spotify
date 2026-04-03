import { observer } from 'mobx-react-lite';
import { mockTracks } from '@/shared/mock/media';
import { playerStore } from '@/store/store';
import { Play } from 'lucide-react';

export const HomePage = observer(function HomePage() {
  const handlePlay = (trackId: string) => {
    const idx = mockTracks.findIndex((t) => t.id === trackId);
    playerStore.setQueue(mockTracks, idx);
    playerStore.play();
  };

  return (
    <section>
      <p className="section-subtitle">Короткая подборка на сейчас.</p>
      <div className="track-grid">
        {mockTracks.map((track) => (
          <article className="track-card" key={track.id}>
            <img src={track.coverUrl} alt={track.title} />
            <strong>{track.title}</strong>
            <span>{track.artist}</span>
            <button
              type="button"
              className="track-play-button"
              onClick={() => handlePlay(track.id)}
              aria-label={`Воспроизвести ${track.title}`}
            >
              <Play aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
});
