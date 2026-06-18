import { observer } from 'mobx-react-lite';
import { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, Loader2, Play } from 'lucide-react';
import {
  searchTracks,
  fetchTracksByMood,
  MOOD_PRESETS,
  type MoodPreset,
} from '@/shared/api/jamendo';
import { jamendoToTracks } from '@/shared/lib/jamendoMapper';
import { MoodIcon } from '@/shared/ui/MoodIcon';
import { playerStore } from '@/store/store';
import { formatDuration } from '@/shared/lib/format';
import type { Track } from '@/types/music.types';

export const SearchPage = observer(function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState<MoodPreset | null>(null);
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      setError(null);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      setSearched(true);
      setError(null);
      searchTracks(query.trim(), 20)
        .then((tracks) => {
          setResults(jamendoToTracks(tracks));
        })
        .catch(() => {
          setResults([]);
          setError('Не удалось выполнить поиск. Проверь соединение и попробуй снова.');
        })
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!activeGenre) {
      return;
    }

    setLoading(true);
    setSearched(true);
    setError(null);
    fetchTracksByMood(activeGenre, 20)
      .then((tracks) => {
        setResults(jamendoToTracks(tracks));
      })
      .catch(() => {
        setResults([]);
        setError('Не удалось загрузить подборку. Попробуй ещё раз.');
      })
      .finally(() => setLoading(false));
  }, [activeGenre]);

  const handlePlay = useCallback(
    (index: number) => {
      playerStore.playFromList(results, index, 'search');
    },
    [results],
  );

  const displayTracks = searched ? results : [];

  return (
    <section className="search-page" aria-labelledby="search-heading">
      <h2 id="search-heading" className="visually-hidden">
        Поиск музыки
      </h2>
      <p className="section-subtitle">Треки, артисты и плейлисты.</p>

      <form className="search-form" role="search" onSubmit={(event) => event.preventDefault()}>
        <div className="search-input-wrapper">
          <label className="visually-hidden" htmlFor="search-query">
            Поиск треков
          </label>
          <SearchIcon className="search-input-icon" aria-hidden="true" />
          <input
            id="search-query"
            type="search"
            className="search-input"
            placeholder="Что хочешь послушать?"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveGenre(null);
            }}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setQuery('')}
              aria-label="Очистить поиск"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      <div className="tag-row" role="group" aria-label="Фильтр по настроению">
        {MOOD_PRESETS.map((mood) => (
          <button
            key={mood.key}
            type="button"
            className={`genre-tag ${activeGenre?.key === mood.key ? 'active' : ''}`}
            onClick={() => {
              setActiveGenre(activeGenre?.key === mood.key ? null : mood);
              setQuery('');
            }}
            aria-pressed={activeGenre?.key === mood.key}
          >
            <MoodIcon moodKey={mood.key} active={activeGenre?.key === mood.key} size={16} />
            {mood.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading-state" role="status" aria-live="polite">
          <Loader2 className="loading-spinner" aria-hidden="true" />
          <p>Ищем музыку…</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-state" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && displayTracks.length === 0 && searched && (
        <div className="search-empty">
          <p>Ничего не найдено{query ? ` по запросу «${query}»` : ''}</p>
        </div>
      )}

      {!loading && !searched && (
        <div className="search-empty">
          <p>Начни с поиска или выбери настроение — покажем подборку треков.</p>
        </div>
      )}

      {!loading && displayTracks.length > 0 && (
        <div className="results-list">
          {displayTracks.map((track, index) => {
            const isActive = playerStore.isQueueTrackActive(track.id, 'search');

            return (
              <button
                type="button"
                key={track.id}
                className={`result-item${isActive ? ' result-item-active' : ''}`}
                onClick={() => handlePlay(index)}
                aria-label={
                  isActive && playerStore.isPlaying
                    ? `Пауза ${track.title} — ${track.artist}`
                    : `Воспроизвести ${track.title} — ${track.artist}`
                }
                aria-current={isActive ? 'true' : undefined}
              >
                <img src={track.coverUrl} alt="" loading="lazy" />
                <div className="result-item-info">
                  <strong>{track.title}</strong>
                  <p>{track.artist}</p>
                </div>
                <span className="result-play-btn" aria-hidden="true">
                  {isActive && playerStore.isPlaying ? (
                    <span className="now-playing-indicator">
                      <span />
                      <span />
                      <span />
                    </span>
                  ) : (
                    <Play />
                  )}
                </span>
                <span className="result-duration">{formatDuration(track.durationSec)}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
});
