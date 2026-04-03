import { observer } from 'mobx-react-lite';
import { Trash2 } from 'lucide-react';
import { playerStore } from '@/store/store';

function formatTracksCount(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} трек`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} трека`;
  }

  return `${count} треков`;
}

export const LibraryPage = observer(function LibraryPage() {
  return (
    <section>
      <p className="section-subtitle">Твои плейлисты и сохранённые подборки.</p>
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
              <div className="playlist-card-header">
                <h3>{playlist.title}</h3>
                <button
                  type="button"
                  className="playlist-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Удалить плейлист "${playlist.title}"?`)) {
                      playerStore.deletePlaylist(playlist.id);
                    }
                  }}
                  aria-label={`Удалить ${playlist.title}`}
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
              <p>{playlist.description}</p>
              <span>{formatTracksCount(playlist.tracks.length)}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
});
