import type { MoodKey } from '@/shared/api/jamendo';
import { MOOD_PRESETS } from '@/shared/api/jamendo';
import { MoodIcon } from '@/shared/ui/MoodIcon';
import { mockTracks } from '@/shared/mock/media';

const previewMoods = MOOD_PRESETS.slice(0, 4);
const previewTracks = mockTracks.slice(0, 3);

type LandingPreviewProps = {
  activeMoodKey: MoodKey;
  onSelectMood: (key: MoodKey) => void;
};

export function LandingPreview({ activeMoodKey, onSelectMood }: LandingPreviewProps) {
  return (
    <aside className="landing-preview">
      <div className="landing-preview-shell">
        <div className="landing-preview-panel">
          <p className="landing-preview-kicker">Превью приложения</p>
          <p className="landing-preview-heading">Как ты сейчас?</p>
          <div className="landing-preview-moods" role="group" aria-label="Выбери настроение">
            {previewMoods.map((mood) => (
              <button
                key={mood.key}
                type="button"
                className={`landing-preview-mood${mood.key === activeMoodKey ? ' landing-preview-mood-active' : ''}`}
                aria-pressed={mood.key === activeMoodKey}
                onClick={() => onSelectMood(mood.key)}
              >
                <MoodIcon moodKey={mood.key} active={mood.key === activeMoodKey} size={16} />
                {mood.label}
              </button>
            ))}
          </div>

          <p className="landing-preview-section" aria-hidden="true">
            Сейчас в эфире
          </p>
          <div className="landing-preview-tracks" aria-hidden="true">
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

          <div className="landing-preview-player" aria-hidden="true">
            <img src={previewTracks[0].coverUrl} alt="" className="landing-preview-player-cover" />
            <div className="landing-preview-player-meta">
              <strong>{previewTracks[0].title}</strong>
              <span>{previewTracks[0].artist}</span>
            </div>
            <div className="landing-preview-player-controls">
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
