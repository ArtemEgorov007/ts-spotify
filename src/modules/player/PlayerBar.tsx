import { observer } from 'mobx-react-lite';
import {
  Heart,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { playerStore } from '@/store/store';
import { formatDuration } from '@/shared/lib/format';

export const PlayerBar = observer(function PlayerBar() {
  const track = playerStore.currentTrack;
  const volumePercent = Math.round(playerStore.volume * 100);
  const progressMax = playerStore.duration > 0 ? playerStore.duration : (track?.durationSec ?? 0);

  const setSliderVolume = (value: string) => {
    playerStore.setVolume(Number(value) / 100);
  };

  const handleProgressChange = (value: string) => {
    playerStore.seekTo(Number(value));
  };

  return (
    <footer className="player-bar" aria-label="Плеер">
      <div className="player-left">
        {track ? (
          <>
            <img src={track.coverUrl} alt="" className="player-cover" />
            <div className="player-track-info">
              <p className="player-track-title">{track.title}</p>
              <p className="player-track-artist">{track.artist}</p>
            </div>
            <button
              type="button"
              className={`player-icon-btn ${playerStore.isFavorite ? 'active' : ''}`}
              aria-label={playerStore.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
              aria-pressed={playerStore.isFavorite}
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
        <div className="player-controls" aria-label="Управление воспроизведением">
          <button
            type="button"
            className={`player-icon-btn player-control-btn ${playerStore.isShuffle ? 'active' : ''}`}
            aria-label="Перемешать"
            aria-pressed={playerStore.isShuffle}
            onClick={() => playerStore.toggleShuffle()}
          >
            <Shuffle aria-hidden="true" />
          </button>
          <button
            type="button"
            className="player-icon-btn player-control-btn"
            aria-label="Предыдущий трек"
            onClick={() => playerStore.prev()}
            disabled={playerStore.queue.length === 0}
          >
            <SkipBack aria-hidden="true" />
          </button>
          <button
            type="button"
            className="player-toggle"
            onClick={() => playerStore.togglePlayback()}
            aria-label={playerStore.isPlaying ? 'Пауза' : 'Воспроизвести'}
            disabled={!track && playerStore.queue.length === 0}
          >
            {playerStore.isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="player-icon-btn player-control-btn"
            aria-label="Следующий трек"
            onClick={() => playerStore.next()}
            disabled={playerStore.queue.length === 0}
          >
            <SkipForward aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`player-icon-btn player-control-btn ${playerStore.isRepeat ? 'active' : ''}`}
            aria-label="Повтор"
            aria-pressed={playerStore.isRepeat}
            onClick={() => playerStore.toggleRepeat()}
          >
            <Repeat aria-hidden="true" />
          </button>
        </div>
        <div className="player-progress">
          <span className="player-time" aria-hidden="true">
            {formatDuration(playerStore.currentTime)}
          </span>
          <label className="visually-hidden" htmlFor="player-progress">
            Прогресс воспроизведения
          </label>
          <input
            id="player-progress"
            className="player-progress-bar"
            type="range"
            min={0}
            max={progressMax}
            step={1}
            value={Math.min(playerStore.currentTime, progressMax)}
            onChange={(event) => handleProgressChange(event.target.value)}
            disabled={!track}
            style={
              progressMax > 0
                ? ({
                    '--progress': `${(playerStore.currentTime / progressMax) * 100}%`,
                  } as React.CSSProperties)
                : undefined
            }
            aria-valuetext={`${formatDuration(playerStore.currentTime)} из ${formatDuration(progressMax)}`}
          />
          <span className="player-time" aria-hidden="true">
            {track ? formatDuration(progressMax) : '0:00'}
          </span>
        </div>
        {playerStore.playbackError && (
          <p className="player-error" role="alert">
            {playerStore.playbackError}
          </p>
        )}
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
            <label className="visually-hidden" htmlFor="player-volume">
              Громкость
            </label>
            <input
              id="player-volume"
              className="volume-slider"
              type="range"
              min={0}
              max={100}
              value={volumePercent}
              aria-valuetext={`${volumePercent} процентов`}
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
