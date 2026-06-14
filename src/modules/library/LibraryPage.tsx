import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Play, Plus, Trash2 } from 'lucide-react';
import { getPlaylistRoute } from '@/app/config/routes';
import { playerStore } from '@/store/store';
import { formatTracksCount } from '@/shared/lib/format';

export const LibraryPage = observer(function LibraryPage() {
  return (
    <section>
      <div className="library-header">
        <p className="section-subtitle">Твои плейлисты и сохранённые подборки.</p>
        {playerStore.playlists.length > 0 && (
          <button
            type="button"
            className="library-create-btn library-create-btn-inline"
            onClick={() => playerStore.openCreatePlaylistModal()}
          >
            <Plus aria-hidden="true" />
            Создать плейлист
          </button>
        )}
      </div>

      {playerStore.playlists.length === 0 ? (
        <div className="library-empty">
          <p>У тебя пока нет плейлистов.</p>
          <button
            type="button"
            className="library-create-btn"
            onClick={() => playerStore.openCreatePlaylistModal()}
          >
            Создать первый плейлист
          </button>
        </div>
      ) : (
        <div className="playlist-grid">
          {playerStore.playlists.map((playlist) => (
            <article key={playlist.id} className="playlist-card">
              <div className="playlist-card-toolbar">
                <button
                  type="button"
                  className="playlist-quick-play-btn"
                  onClick={() => playerStore.playPlaylist(playlist.id)}
                  disabled={playlist.tracks.length === 0}
                  aria-label={`Слушать ${playlist.title}`}
                >
                  <Play aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="playlist-delete-btn"
                  onClick={() => playerStore.requestDeletePlaylist(playlist.id)}
                  aria-label={`Удалить ${playlist.title}`}
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
              <Link
                className="playlist-card-body"
                to={getPlaylistRoute(playlist.id)}
                aria-label={`Открыть плейлист ${playlist.title}`}
              >
                <h3>{playlist.title}</h3>
                <p>{playlist.description}</p>
                <span>{formatTracksCount(playlist.tracks.length)}</span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
});
