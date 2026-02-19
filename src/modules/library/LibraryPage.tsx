import { mockPlaylists } from '@/shared/mock/media';

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

export function LibraryPage() {
  return (
    <section>
      <p className="section-subtitle">Твои плейлисты и сохранённые подборки.</p>
      <div className="playlist-grid">
        {mockPlaylists.map((playlist) => (
          <article key={playlist.id} className="playlist-card">
            <h3>{playlist.title}</h3>
            <p>{playlist.description}</p>
            <span>{formatTracksCount(playlist.tracks.length)}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
