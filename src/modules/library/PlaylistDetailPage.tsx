import { observer } from 'mobx-react-lite';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Trash2 } from 'lucide-react';
import { WipSection } from '@/app/components/WipSection';
import { APP_ROUTES } from '@/app/config/routes';
import { playerStore } from '@/store/store';
import { formatDuration, formatTracksCount } from '@/shared/lib/format';

export const PlaylistDetailPage = observer(function PlaylistDetailPage() {
  const { playlistId = '' } = useParams();
  const playlist = playerStore.getPlaylistById(playlistId);

  if (!playlist) {
    return <Navigate to={APP_ROUTES.library} replace />;
  }

  const coverTracks = playlist.tracks.slice(0, 4);

  return (
    <section className="playlist-detail">
      <WipSection>
        <Link to={APP_ROUTES.library} className="playlist-back-link" tabIndex={-1}>
          <ArrowLeft aria-hidden="true" />
          Медиатека
        </Link>

        <div className="playlist-detail-hero">
          <div className="playlist-detail-cover" aria-hidden="true">
            {coverTracks.length > 0 ? (
              <div
                className={`playlist-detail-cover-grid playlist-detail-cover-grid-${Math.min(coverTracks.length, 4)}`}
              >
                {coverTracks.map((track) => (
                  <img key={track.id} src={track.coverUrl} alt="" loading="lazy" />
                ))}
              </div>
            ) : (
              <div className="playlist-detail-cover-empty" />
            )}
          </div>

          <div className="playlist-detail-info">
            <p className="playlist-detail-type">Плейлист</p>
            <h2 className="playlist-detail-title">{playlist.title}</h2>
            {playlist.description && (
              <p className="playlist-detail-description">{playlist.description}</p>
            )}
            <p className="playlist-detail-meta">{formatTracksCount(playlist.tracks.length)}</p>

            <div className="playlist-detail-actions">
              <button type="button" className="playlist-detail-play-btn" tabIndex={-1}>
                <Play aria-hidden="true" />
                Слушать
              </button>
              <button type="button" className="playlist-detail-delete-btn" tabIndex={-1}>
                <Trash2 aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <ol className="playlist-track-list">
          {playlist.tracks.map((track, index) => (
            <li key={track.id}>
              <button type="button" className="playlist-track-item" tabIndex={-1}>
                <span className="playlist-track-index">{index + 1}</span>
                <img src={track.coverUrl} alt="" loading="lazy" />
                <span className="playlist-track-info">
                  <strong>{track.title}</strong>
                  <span>{track.artist}</span>
                </span>
                <span className="playlist-track-duration">{formatDuration(track.durationSec)}</span>
                <span className="playlist-track-play" aria-hidden="true">
                  <Play />
                </span>
              </button>
            </li>
          ))}
        </ol>
      </WipSection>
    </section>
  );
});
