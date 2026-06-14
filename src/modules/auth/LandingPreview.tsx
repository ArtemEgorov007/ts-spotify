import { MOOD_PRESETS } from '@/shared/api/jamendo';
import { mockTracks } from '@/shared/mock/media';

const previewMoods = MOOD_PRESETS.slice(0, 4);
const previewTracks = mockTracks.slice(0, 3);

export function LandingPreview() {
  return (
    <aside className="landing-preview" aria-hidden="true">
      <div className="landing-preview-shell">
        <div className="landing-preview-panel">
          <p className="landing-preview-kicker">Превью приложения</p>
          <p className="landing-preview-heading">Как ты сейчас?</p>
          <div className="landing-preview-moods">
            {previewMoods.map((mood, index) => (
              <span
                key={mood.key}
                className={`landing-preview-mood${index === 1 ? ' landing-preview-mood-active' : ''}`}
              >
                <span aria-hidden="true">{mood.emoji}</span>
                {mood.label}
              </span>
            ))}
          </div>

          <p className="landing-preview-section">Сейчас в эфире</p>
          <div className="landing-preview-tracks">
            {previewTracks.map((track, index) => (
              <article
                key={track.id}
                className={`landing-preview-track${index === 0 ? ' landing-preview-track-active' : ''}`}
              >
                <img src={track.coverUrl} alt="" loading="lazy" decoding="async" />
                <div className="landing-preview-track-meta">
                  <strong>{track.title}</strong>
                  <span>{track.artist}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="landing-preview-player">
            <img src={previewTracks[0].coverUrl} alt="" className="landing-preview-player-cover" />
            <div className="landing-preview-player-meta">
              <strong>{previewTracks[0].title}</strong>
              <span>{previewTracks[0].artist}</span>
            </div>
            <div className="landing-preview-player-controls" aria-hidden="true">
              <span />
              <span className="landing-preview-player-play" />
              <span />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
