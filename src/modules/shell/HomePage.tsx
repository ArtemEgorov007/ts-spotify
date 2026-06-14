import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { Play, Loader2, RotateCcw } from 'lucide-react';
import { playerStore } from '@/store/store';
import { fetchTracksByMood, MOOD_PRESETS, type MoodPreset } from '@/shared/api/jamendo';
import { jamendoToTracks } from '@/shared/lib/jamendoMapper';
import { mockTracks } from '@/shared/mock/media';

function getDefaultMood(): MoodPreset {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return MOOD_PRESETS[0];
  if (hour >= 10 && hour < 14) return MOOD_PRESETS[1];
  if (hour >= 14 && hour < 18) return MOOD_PRESETS[3];
  if (hour >= 18 && hour < 22) return MOOD_PRESETS[2];
  return MOOD_PRESETS[4];
}

export const HomePage = observer(function HomePage() {
  const [selectedMood, setSelectedMood] = useState<MoodPreset>(getDefaultMood);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const loadTracks = useCallback(async (mood: MoodPreset, signal: AbortSignal, force = false) => {
    if (!force && playerStore.homeFeedMoodKey === mood.key && playerStore.homeFeedTracks.length > 0) {
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setUsingFallback(false);

    try {
      const tracks = await fetchTracksByMood(mood, 24);
      if (signal.aborted) return;

      if (tracks.length > 0) {
        playerStore.setHomeFeed(jamendoToTracks(tracks), mood.key, force);
        return;
      }

      playerStore.setHomeFeed(mockTracks, mood.key, true);
      setUsingFallback(true);
      setError('Онлайн-подборка пуста. Показали демо-треки.');
    } catch {
      if (signal.aborted) return;
      playerStore.setHomeFeed(mockTracks, mood.key, true);
      setUsingFallback(true);
      setError('Не удалось загрузить треки. Показали демо-подборку.');
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadTracks(selectedMood, controller.signal, reloadToken > 0);
    return () => controller.abort();
  }, [selectedMood, reloadToken, loadTracks]);

  const handlePlay = (index: number) => {
    playerStore.playFromHomeFeed(index);
  };

  const handleRetry = () => {
    setReloadToken((token) => token + 1);
  };

  const currentTrack = playerStore.currentTrack;

  return (
    <section aria-labelledby="home-mood-heading">
      <fieldset className="mood-selector">
        <legend id="home-mood-heading" className="section-subtitle">
          Как ты сейчас?
        </legend>
        <div className="mood-chips" role="group" aria-label="Выбор настроения">
          {MOOD_PRESETS.map((mood) => (
            <button
              key={mood.key}
              type="button"
              className={`mood-chip ${selectedMood.key === mood.key ? 'active' : ''}`}
              onClick={() => setSelectedMood(mood)}
              aria-pressed={selectedMood.key === mood.key}
            >
              <span className="mood-chip-emoji" aria-hidden="true">
                {mood.emoji}
              </span>
              <span className="mood-chip-label">{mood.label}</span>
            </button>
          ))}
        </div>
        <p className="mood-description">{selectedMood.description}</p>
      </fieldset>

      {loading && (
        <div className="loading-state" role="status" aria-live="polite">
          <Loader2 className="loading-spinner" aria-hidden="true" />
          <p>Загружаем музыку для настроения «{selectedMood.label}»…</p>
        </div>
      )}

      {error && !loading && (
        <div
          className={`error-state${usingFallback ? ' error-state-info' : ''}`}
          role={usingFallback ? 'status' : 'alert'}
        >
          <p>{error}</p>
          <button type="button" className="error-retry-btn" onClick={handleRetry}>
            <RotateCcw aria-hidden="true" />
            Попробовать снова
          </button>
        </div>
      )}

      {!loading && playerStore.homeFeedTracks.length > 0 && (
        <div className="track-grid" aria-label="Подборка треков">
          {playerStore.homeFeedTracks.map((track, index) => (
            <button
              type="button"
              className={`track-card${currentTrack?.id === track.id ? ' track-card-active' : ''}`}
              key={track.id}
              onClick={() => handlePlay(index)}
              aria-label={
                currentTrack?.id === track.id && playerStore.isPlaying
                  ? `Пауза ${track.title} — ${track.artist}`
                  : `Воспроизвести ${track.title} — ${track.artist}`
              }
              aria-current={currentTrack?.id === track.id ? 'true' : undefined}
            >
              <img src={track.coverUrl} alt="" loading="lazy" />
              <strong>{track.title}</strong>
              <span className="track-card-artist">{track.artist}</span>
              <span className="track-play-button" aria-hidden="true">
                {currentTrack?.id === track.id && playerStore.isPlaying ? (
                  <span className="now-playing-indicator">
                    <span />
                    <span />
                    <span />
                  </span>
                ) : (
                  <Play aria-hidden="true" />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
});
