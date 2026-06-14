import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { playerStore } from '@/store/store';
import { fetchTracksByMood, MOOD_PRESETS, type MoodPreset } from '@/shared/api/jamendo';
import { jamendoToTracks } from '@/shared/lib/jamendoMapper';

function getDefaultMood(): MoodPreset {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return MOOD_PRESETS[0]; // morning
  if (hour >= 10 && hour < 14) return MOOD_PRESETS[1]; // energy
  if (hour >= 14 && hour < 18) return MOOD_PRESETS[3]; // focus
  if (hour >= 18 && hour < 22) return MOOD_PRESETS[2]; // relax
  return MOOD_PRESETS[4]; // night
}

export const HomePage = observer(function HomePage() {
  const [selectedMood, setSelectedMood] = useState<MoodPreset>(getDefaultMood);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchTracksByMood(selectedMood, 24)
      .then((tracks) => {
        if (!cancelled && tracks.length > 0) {
          playerStore.setQueue(jamendoToTracks(tracks), 0);
        } else if (!cancelled) {
          setError('Треки не найдены. Попробуй другое настроение.');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Не удалось загрузить треки. Проверь интернет.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedMood]);

  const handlePlay = (index: number) => {
    playerStore.setQueue(playerStore.queue, index);
    playerStore.play();
  };

  const currentTrack = playerStore.currentTrack;

  return (
    <section>
      {/* Mood Journey Selector */}
      <div className="mood-selector">
        <p className="section-subtitle">Как ты сейчас?</p>
        <div className="mood-chips">
          {MOOD_PRESETS.map((mood) => (
            <button
              key={mood.key}
              type="button"
              className={`mood-chip ${selectedMood.key === mood.key ? 'active' : ''}`}
              onClick={() => setSelectedMood(mood)}
            >
              <span className="mood-chip-emoji">{mood.emoji}</span>
              <span className="mood-chip-label">{mood.label}</span>
            </button>
          ))}
        </div>
        <p className="mood-description">{selectedMood.description}</p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="loading-state">
          <Loader2 className="loading-spinner" aria-hidden="true" />
          <p>Загружаем музыку для настроения «{selectedMood.label}»…</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="error-state">
          <p>{error}</p>
        </div>
      )}

      {/* Track grid */}
      {!loading && !error && playerStore.queue.length > 0 && (
        <div className="track-grid">
          {playerStore.queue.map((track, index) => (
            <article className="track-card" key={track.id}>
              <img src={track.coverUrl} alt={track.title} loading="lazy" />
              <strong>{track.title}</strong>
              <span>{track.artist}</span>
              <button
                type="button"
                className="track-play-button"
                onClick={() => handlePlay(index)}
                aria-label={`Воспроизвести ${track.title}`}
              >
                {currentTrack?.id === track.id && playerStore.isPlaying ? (
                  <div className="now-playing-indicator">
                    <span />
                    <span />
                    <span />
                  </div>
                ) : (
                  <Play aria-hidden="true" />
                )}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
});
