import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { Play, Loader2, RotateCcw } from 'lucide-react';
import { playerStore } from '@/store/store';
import {
  fetchTracksByMood,
  getDefaultMood,
  getMoodByKey,
  MOOD_PRESETS,
  type MoodKey,
  type MoodPreset,
} from '@/shared/api/jamendo';
import { jamendoToTracks } from '@/shared/lib/jamendoMapper';
import { mockTracks } from '@/shared/mock/media';

function getInitialMood(): MoodPreset {
  const storedKey = playerStore.selectedHomeMoodKey ?? playerStore.homeFeedMoodKey;
  if (storedKey) {
    const storedMood = getMoodByKey(storedKey as MoodKey);
    if (storedMood) {
      return storedMood;
    }
  }

  return getDefaultMood();
}

function isStaleMoodRequest(mood: MoodPreset) {
  const { selectedHomeMoodKey } = playerStore;
  return selectedHomeMoodKey !== null && selectedHomeMoodKey !== mood.key;
}

export const HomePage = observer(function HomePage() {
  const [selectedMood, setSelectedMood] = useState<MoodPreset>(getInitialMood);
  const [loading, setLoading] = useState(() => playerStore.homeFeedTracks.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const loadTracks = useCallback(async (mood: MoodPreset, force = false) => {
    if (
      !force &&
      playerStore.homeFeedMoodKey === mood.key &&
      playerStore.homeFeedTracks.length > 0
    ) {
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setUsingFallback(false);

    try {
      const tracks = await fetchTracksByMood(mood, 24);

      if (isStaleMoodRequest(mood)) {
        return;
      }

      if (tracks.length > 0) {
        playerStore.setHomeFeed(jamendoToTracks(tracks), mood.key, force);
        return;
      }

      playerStore.setHomeFeed(mockTracks, mood.key, true);
      setUsingFallback(true);
      setError('Онлайн-подборка пуста. Показали демо-треки.');
    } catch {
      if (isStaleMoodRequest(mood)) {
        return;
      }

      playerStore.setHomeFeed(mockTracks, mood.key, true);
      setUsingFallback(true);
      setError('Не удалось загрузить треки. Показали демо-подборку.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!playerStore.selectedHomeMoodKey) {
      playerStore.setSelectedHomeMoodKey(selectedMood.key);
    }

    void loadTracks(selectedMood, reloadToken > 0);
  }, [selectedMood, reloadToken, loadTracks]);

  const handleMoodSelect = (mood: MoodPreset) => {
    playerStore.setSelectedHomeMoodKey(mood.key);
    setSelectedMood(mood);
  };

  const handlePlay = (index: number) => {
    playerStore.playFromHomeFeed(index);
  };

  const handleRetry = () => {
    setReloadToken((token) => token + 1);
  };

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
              onClick={() => handleMoodSelect(mood)}
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
          {playerStore.homeFeedTracks.map((track, index) => {
            const isActive = playerStore.isHomeTrackActive(track.id);

            return (
              <button
                type="button"
                className={`track-card${isActive ? ' track-card-active' : ''}`}
                key={track.id}
                onClick={() => handlePlay(index)}
                aria-label={
                  isActive && playerStore.isPlaying
                    ? `Пауза ${track.title} — ${track.artist}`
                    : `Воспроизвести ${track.title} — ${track.artist}`
                }
                aria-current={isActive ? 'true' : undefined}
              >
                <img src={track.coverUrl} alt="" loading="lazy" />
                <strong>{track.title}</strong>
                <span className="track-card-artist">{track.artist}</span>
                <span className="track-play-button" aria-hidden="true">
                  {isActive && playerStore.isPlaying ? (
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
            );
          })}
        </div>
      )}
    </section>
  );
});
