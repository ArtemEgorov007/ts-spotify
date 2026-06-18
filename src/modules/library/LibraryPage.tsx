import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Play, Trash2 } from 'lucide-react';
import { WipSection } from '@/app/components/WipSection';
import { getPlaylistRoute } from '@/app/config/routes';
import { playerStore } from '@/store/store';
import { formatTracksCount } from '@/shared/lib/format';

export const LibraryPage = observer(function LibraryPage() {
  return (
    <section className="library-page">
      <WipSection>
        <div className="library-header">
          <p className="section-subtitle">Твои плейлисты и сохранённые подборки.</p>
        </div>

        <div className="playlist-grid">
          {playerStore.playlists.map((playlist) => (
            <article key={playlist.id} className="playlist-card">
              <div className="playlist-card-toolbar">
                <button type="button" className="playlist-quick-play-btn" tabIndex={-1}>
                  <Play aria-hidden="true" />
                </button>
                <button type="button" className="playlist-delete-btn" tabIndex={-1}>
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
              <Link className="playlist-card-body" to={getPlaylistRoute(playlist.id)} tabIndex={-1}>
                <h3>{playlist.title}</h3>
                <p>{playlist.description}</p>
                <span>{formatTracksCount(playlist.tracks.length)}</span>
              </Link>
            </article>
          ))}
        </div>
      </WipSection>
    </section>
  );
});
