import { observer } from 'mobx-react-lite';
import { Heart, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'lucide-react';
import { playerStore } from '@/store/store';
import { formatDuration } from '@/shared/lib/format';

export const PlayerBar = observer(function PlayerBar() {
  const track = playerStore.currentTrack;
  const volumePercent = Math.round(playerStore.volume * 100);
  const setSliderVolume = (value: string) => {
    playerStore.setVolume(Number(value) / 100);
  };

  const toggleMute = () => {
    if (playerStore.volume > 0) {
      playerStore.setVolume(0);
    } else {
      playerStore.setVolume(0.5);
    }
  };

  const getVolumeIcon = () => {
    if (playerStore.volume === 0) return VolumeX;
    if (playerStore.volume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <footer className="player-bar">
      <div className="player-left">
        {track ? (
          <>
            <img src={track.coverUrl} alt={track.title} className="player-cover" />
            <div className="player-track-info">
              <strong className="player-track-title">{track.title}</strong>
              <span className="player-track-artist">{track.artist}</span>
            </div>
            <button
              type="button"
              className={`player-icon-btn ${playerStore.isFavorite ? 'active' : ''}`}
              aria-label="Нравится"
              onClick={() => playerStore.toggleFavorite()}
            >
              <Heart aria-hidden="true" fill={playerStore.isFavorite ? 'currentColor' : 'none'} />
            </button>
          </>
        ) : (
          <span className="player-no-track">Выбери трек для начала воспроизведения</span>
        )}
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button
            type="button"
            className="player-icon-btn player-control-btn"
            aria-label="Перемешать"
          >
            <Shuffle aria-hidden="true" />
          </button>
          <button
            type="button"
            className="player-icon-btn player-control-btn"
            aria-label="Предыдущий"
          >
            <SkipBack aria-hidden="true" />
          </button>
          <button
            type="button"
            className="player-toggle"
            onClick={() => playerStore.togglePlayback()}
            aria-label={playerStore.isPlaying ? 'Пауза' : 'Воспроизвести'}
          >
            {playerStore.isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="player-icon-btn player-control-btn"
            aria-label="Следующий"
          >
            <SkipForward aria-hidden="true" />
          </button>
          <button type="button" className="player-icon-btn player-control-btn" aria-label="Повтор">
            <Repeat aria-hidden="true" />
          </button>
        </div>
        <div className="player-progress">
          <span className="player-time">0:00</span>
          <div className="player-progress-bar">
            <div className="player-progress-fill" style={{ width: '30%' }} />
            <div className="player-progress-handle" />
          </div>
          <span className="player-time">
            {track ? formatDuration(track.durationSec) : '0:00'}
          </span>
        </div>
      </div>

      <div className="player-right">
        <div className="volume-control">
          <button
            type="button"
            className="player-icon-btn"
            aria-label={playerStore.volume === 0 ? 'Включить звук' : 'Выключить звук'}
            onClick={toggleMute}
          >
            <VolumeIcon aria-hidden="true" />
          </button>
          <div className="volume-slider-container">
            <input
              className="volume-slider"
              type="range"
              min={0}
              max={100}
              value={volumePercent}
              style={{
                background: `linear-gradient(to right, var(--brand-green) 0%, var(--brand-green) ${volumePercent}%, var(--bg-strong) ${volumePercent}%, var(--bg-strong) 100%)`,
              }}
              onInput={(event) => setSliderVolume((event.target as HTMLInputElement).value)}
            />
          </div>
        </div>
      </div>
    </footer>
  );
});
