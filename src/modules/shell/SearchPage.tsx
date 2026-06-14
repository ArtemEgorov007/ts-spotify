import { observer } from 'mobx-react-lite';
import { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, Loader2, Play } from 'lucide-react';
import { searchTracks, fetchTracksByMood, MOOD_PRESETS, type MoodPreset } from '@/shared/api/jamendo';
import { jamendoToTracks } from '@/shared/lib/jamendoMapper';
import { playerStore } from '@/store/store';
import { formatDuration } from '@/shared/lib/format';

export const SearchPage = observer(function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState<MoodPreset | null>(null);
  const [results, setResults] = useState(playerStore.queue);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(playerStore.queue);
      setSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      setSearched(true);
      searchTracks(query.trim(), 20)
        .then((tracks) => {
          setResults(jamendoToTracks(tracks));
        })
        .catch(() => {
          setResults([]);
        })
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Genre filter
  useEffect(() => {
    if (!activeGenre) return;
    setLoading(true);
    fetchTracksByMood(activeGenre, 20)
      .then((tracks) => {
        setResults(jamendoToTracks(tracks));
        setSearched(true);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [activeGenre]);

  const handlePlay = useCallback(
    (index: number) => {
      playerStore.setQueue(results, index);
      playerStore.play();
    },
    [results],
  );

  const displayTracks = activeGenre || query.trim() ? results : playerStore.queue;

  return (
    <section>
      <p className="section-subtitle">Треки, артисты и плейлисты.</p>

      <div className="search-input-wrapper">
        <SearchIcon className="search-input-icon" aria-hidden="true" />
        <input
          type="text"
          className="search-input"
          placeholder="Что хочешь послушать?"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveGenre(null);
          }}
          autoFocus
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

      <div className="tag-row">
        {MOOD_PRESETS.map((mood) => (
          <button
            key={mood.key}
            type="button"
            className={`genre-tag ${activeGenre?.key === mood.key ? 'active' : ''}`}
            onClick={() => {
              setActiveGenre(activeGenre?.key === mood.key ? null : mood);
              setQuery('');
            }}
          >
            {mood.emoji} {mood.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading-state">
          <Loader2 className="loading-spinner" aria-hidden="true" />
          <p>Ищем музыку…</p>
        </div>
      )}

      {!loading && displayTracks.length === 0 && searched && (
        <div className="search-empty">
          <p>Ничего не найдено{query ? ` по запросу «${query}»` : ''}</p>
        </div>
      )}

      {!loading && displayTracks.length > 0 && (
        <div className="results-list">
          {displayTracks.map((track, index) => (
            <div key={track.id} className="result-item">
              <img src={track.coverUrl} alt={track.title} loading="lazy" />
              <div className="result-item-info">
                <strong>{track.title}</strong>
                <p>{track.artist}</p>
              </div>
              <button
                type="button"
                className="result-play-btn"
                onClick={() => handlePlay(index)}
                aria-label={`Воспроизвести ${track.title}`}
              >
                <Play aria-hidden="true" />
              </button>
              <span className="result-duration">{formatDuration(track.durationSec)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
});
