import { observer } from 'mobx-react-lite';
import { musicPlatformStore } from '@/store/store';
import { PauseIcon, PlayIcon } from '@/shared/icons/Icons';

export const PlayerBar = observer(function PlayerBar() {
  const track = musicPlatformStore.currentTrack;
  const volumePercent = Math.round(musicPlatformStore.volume * 100);
  const setSliderVolume = (value: string) => {
    musicPlatformStore.setVolume(Number(value) / 100);
  };

  return (
    <footer className="player-bar">
      <div className="player-track">
        {track ? (
          <>
            <img src={track.coverUrl} alt={track.title} />
            <div>
              <strong>{track.title}</strong>
              <span>{track.artist}</span>
            </div>
          </>
        ) : (
          <span>Выбери трек для начала воспроизведения</span>
        )}
      </div>

      <button type="button" className="player-toggle" onClick={() => musicPlatformStore.togglePlayback()}>
        {musicPlatformStore.isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <label className="volume-control">
        <span>Громкость {volumePercent}%</span>
        <input
          className="volume-slider"
          type="range"
          min={0}
          max={100}
          value={volumePercent}
          style={{
            background: `linear-gradient(to right, #fff 0%, #fff ${volumePercent}%, #3a3a3a ${volumePercent}%, #3a3a3a 100%)`,
          }}
          onInput={(event) => setSliderVolume((event.target as HTMLInputElement).value)}
          onChange={(event) => setSliderVolume(event.target.value)}
        />
      </label>
    </footer>
  );
});
