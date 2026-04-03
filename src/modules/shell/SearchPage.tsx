import { observer } from 'mobx-react-lite';
import { useState, useMemo } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { mockTracks } from '@/shared/mock/media';
import { playerStore } from '@/store/store';
import { Play } from 'lucide-react';

const GENRES = ['Поп', 'Чилл', 'Фокус', 'Бег', 'Электро'];

export const SearchPage = observer(function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const filteredTracks = useMemo(() => {
    let tracks = mockTracks;

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      tracks = tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q),
      );
    }

    if (activeGenre) {
      // Simple genre filtering — in production, tracks would have genre tags
      const genreMap: Record<string, string[]> = {
        'Поп': ['Ночной путь', 'Стеклянный горизонт'],
        'Чилл': ['Послесвечение', 'Поздняя станция'],
        'Фокус': ['Городские петли', 'Сигнальные волны'],
        'Бег': ['Сигнальные волны', 'Ночной путь'],
        'Электро': ['Городские петли', 'Стеклянный горизонт'],
      };
      const genreTrackTitles = genreMap[activeGenre] || [];
      tracks = tracks.filter((t) => genreTrackTitles.includes(t.title));
    }

    return tracks;
  }, [query, activeGenre]);

  const handlePlay = (trackId: string) => {
    const idx = filteredTracks.findIndex((t) => t.id === trackId);
    playerStore.setQueue(filteredTracks, idx);
    playerStore.play();
  };

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
          onChange={(e) => setQuery(e.target.value)}
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
        {GENRES.map((genre) => (
          <button
            key={genre}
            type="button"
            className={`genre-tag ${activeGenre === genre ? 'active' : ''}`}
            onClick={() => setActiveGenre(activeGenre === genre ? null : genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      {filteredTracks.length === 0 ? (
        <div className="search-empty">
          <p>Ничего не найдено по запросу «{query}»</p>
        </div>
      ) : (
        <div className="results-list">
          {filteredTracks.map((track) => (
            <div key={track.id} className="result-item">
              <img src={track.coverUrl} alt={track.title} />
              <div className="result-item-info">
                <strong>{track.title}</strong>
                <p>{track.artist}</p>
              </div>
              <button
                type="button"
                className="result-play-btn"
                onClick={() => handlePlay(track.id)}
                aria-label={`Воспроизвести ${track.title}`}
              >
                <Play aria-hidden="true" />
              </button>
              <span className="result-duration">{track.durationSec > 0 ? `${Math.floor(track.durationSec / 60)}:${String(track.durationSec % 60).padStart(2, '0')}` : ''}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
});
