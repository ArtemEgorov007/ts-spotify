import { observer } from 'mobx-react-lite';
import { musicPlatformStore } from '@/store/store';
import {
  PauseIcon,
  PlayIcon,
  PrevIcon,
  NextIcon,
  ShuffleIcon,
  RepeatIcon,
  VolumeIcon,
  HeartIcon,
} from '@/shared/icons/Icons';

export const PlayerBar = observer(function PlayerBar() {
  const track = musicPlatformStore.currentTrack;
  const volumePercent = Math.round(musicPlatformStore.volume * 100);
  const setSliderVolume = (value: string) => {
    musicPlatformStore.setVolume(Number(value) / 100);
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
          </>
        ) : (
          <span className="player-no-track">Выбери трек для начала воспроизведения</span>
        )}
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button type="button" className="player-icon-btn player-control-btn" aria-label="Перемешать">
            <ShuffleIcon />
          </button>
          <button type="button" className="player-icon-btn player-control-btn" aria-label="Предыдущий">
            <PrevIcon />
          </button>
          <button
            type="button"
            className="player-toggle"
            onClick={() => musicPlatformStore.togglePlayback()}
            aria-label={musicPlatformStore.isPlaying ? 'Пауза' : 'Воспроизвести'}
          >
            {musicPlatformStore.isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" className="player-icon-btn player-control-btn" aria-label="Следующий">
            <NextIcon />
          </button>
          <button type="button" className="player-icon-btn player-control-btn" aria-label="Повтор">
            <RepeatIcon />
          </button>
        </div>
        <div className="player-progress">
          <span className="player-time">0:00</span>
          <div className="player-progress-bar">
            <div className="player-progress-fill" style={{ width: '30%' }} />
            <div className="player-progress-handle" />
          </div>
          <span className="player-time">{track ? `${Math.floor(track.durationSec / 60)}:${String(track.durationSec % 60).padStart(2, '0')}` : '0:00'}</span>
        </div>
      </div>

      <div className="player-right">
        <button type="button" className="player-icon-btn" aria-label="Громкость">
          <VolumeIcon />
        </button>
        <div className="player-volume">
          <input
            className="volume-slider"
            type="range"
            min={0}
            max={100}
            value={volumePercent}
            style={{
              background: `linear-gradient(to right, var(--slider-fill) 0%, var(--slider-fill) ${volumePercent}%, var(--slider-track) ${volumePercent}%, var(--slider-track) 100%)`,
            }}
            onInput={(event) => setSliderVolume((event.target as HTMLInputElement).value)}
            onChange={(event) => setSliderVolume(event.target.value)}
          />
        </div>
        <button type="button" className="player-icon-btn player-mobile-play" onClick={() => musicPlatformStore.togglePlayback()} aria-label={musicPlatformStore.isPlaying ? 'Пауза' : 'Воспроизвести'}>
          {musicPlatformStore.isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button type="button" className="player-icon-btn" aria-label="Нравится">
          <HeartIcon />
        </button>
      </div>
    </footer>
  );
});
