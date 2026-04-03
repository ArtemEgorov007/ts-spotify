import { observer } from 'mobx-react-lite';
import { Heart, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'lucide-react';
import { playerStore } from '@/store/store';
import { formatDuration } from '@/shared/lib/format';

export const PlayerBar = observer(function PlayerBar() {
  const track = playerStore.currentTrack;
  const volumePercent = Math.round(playerStore.volume * 100);
  const progressPercent = track && track.durationSec > 0
    ? (playerStore.currentTime / track.durationSec) * 100
    : 0;

  const setSliderVolume = (value: string) => {
    playerStore.setVolume(Number(value) / 100);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!track) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    playerStore.seekTo(ratio * track.durationSec);
  };

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
            className={`player-icon-btn player-control-btn ${playerStore.isShuffle ? 'active' : ''}`}
            aria-label="Перемешать"
            onClick={() => playerStore.toggleShuffle()}
          >
            <Shuffle aria-hidden="true" />
          </button>
          <button
            type="button"
            className="player-icon-btn player-control-btn"
            aria-label="Предыдущий"
            onClick={() => playerStore.prev()}
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
            onClick={() => playerStore.next()}
          >
            <SkipForward aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`player-icon-btn player-control-btn ${playerStore.isRepeat ? 'active' : ''}`}
            aria-label="Повтор"
            onClick={() => playerStore.toggleRepeat()}
          >
            <Repeat aria-hidden="true" />
          </button>
        </div>
        <div className="player-progress">
          <span className="player-time">{formatDuration(playerStore.currentTime)}</span>
          <div
            className="player-progress-bar"
            onClick={handleProgressClick}
            role="slider"
            aria-label="Прогресс воспроизведения"
            aria-valuemin={0}
            aria-valuemax={track ? track.durationSec : 0}
            aria-valuenow={Math.round(playerStore.currentTime)}
          >
            <div className="player-progress-fill" style={{ width: `${progressPercent}%` }} />
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
            aria-label={playerStore.isMuted ? 'Включить звук' : 'Выключить звук'}
            onClick={() => playerStore.toggleMute()}
          >
            {playerStore.isMuted ? (
              <VolumeX aria-hidden="true" />
            ) : playerStore.volume < 0.5 ? (
              <Volume1 aria-hidden="true" />
            ) : (
              <Volume2 aria-hidden="true" />
            )}
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
