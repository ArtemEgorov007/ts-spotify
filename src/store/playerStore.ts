import { makeAutoObservable, runInAction } from 'mobx';
import { Track } from '@/types/music.types';
import { Playlist } from '@/types/playlist.types';
import { mockPlaylists } from '@/shared/mock/media';

class PlayerStore {
  queue: Track[] = [];
  currentIndex = -1;
  isPlaying = false;
  volume = 0.8;
  isMuted = false;
  previousVolume = 0.8;
  isShuffle = false;
  isRepeat = false;
  isFavorite = false;
  currentTime = 0;
  duration = 0;
  playlists: Playlist[] = [...mockPlaylists];
  showCreatePlaylistModal = false;

  private audio: HTMLAudioElement | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get currentTrack(): Track | null {
    if (this.currentIndex < 0 || this.currentIndex >= this.queue.length) {
      return null;
    }
    return this.queue[this.currentIndex];
  }

  setQueue(tracks: Track[], startIndex = 0) {
    this.queue = tracks;
    this.currentIndex = startIndex;
    this.currentTime = 0;
    this.duration = 0;
    this.isFavorite = false;

    if (tracks.length > 0 && startIndex >= 0) {
      this.loadTrack(tracks[startIndex]);
    }
  }

  play(track?: Track) {
    if (track) {
      const idx = this.queue.findIndex((t) => t.id === track.id);
      if (idx !== -1) {
        this.currentIndex = idx;
      } else {
        this.queue = [track, ...this.queue];
        this.currentIndex = 0;
      }
      this.loadTrack(track);
    }

    if (this.currentTrack) {
      this.audio?.play().catch(() => {});
      this.isPlaying = true;
    }
  }

  pause() {
    this.audio?.pause();
    this.isPlaying = false;
  }

  togglePlayback() {
    if (!this.currentTrack && this.queue.length > 0) {
      this.currentIndex = 0;
      this.loadTrack(this.queue[0]);
    }

    if (this.currentTrack) {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }
  }

  next() {
    if (this.queue.length === 0) return;

    if (this.isRepeat && this.audio) {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {});
      return;
    }

    let nextIndex: number;
    if (this.isShuffle) {
      nextIndex = Math.floor(Math.random() * this.queue.length);
      if (this.queue.length > 1) {
        while (nextIndex === this.currentIndex) {
          nextIndex = Math.floor(Math.random() * this.queue.length);
        }
      }
    } else {
      nextIndex = (this.currentIndex + 1) % this.queue.length;
    }

    this.currentIndex = nextIndex;
    this.loadTrack(this.queue[nextIndex]);
    this.play();
  }

  prev() {
    if (this.queue.length === 0) return;

    // If more than 3 seconds in, restart current track
    if (this.currentTime > 3) {
      if (this.audio) {
        this.audio.currentTime = 0;
      }
      this.currentTime = 0;
      return;
    }

    let prevIndex: number;
    if (this.isShuffle) {
      prevIndex = Math.floor(Math.random() * this.queue.length);
      if (this.queue.length > 1) {
        while (prevIndex === this.currentIndex) {
          prevIndex = Math.floor(Math.random() * this.queue.length);
        }
      }
    } else {
      prevIndex = (this.currentIndex - 1 + this.queue.length) % this.queue.length;
    }

    this.currentIndex = prevIndex;
    this.loadTrack(this.queue[prevIndex]);
    this.play();
  }

  setVolume(volume: number) {
    this.volume = Math.min(1, Math.max(0, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    if (this.volume > 0) {
      this.isMuted = false;
    }
  }

  toggleMute() {
    if (this.isMuted) {
      this.isMuted = false;
      this.volume = this.previousVolume;
      if (this.audio) {
        this.audio.volume = this.volume;
      }
    } else {
      this.isMuted = true;
      this.previousVolume = this.volume;
      this.volume = 0;
      if (this.audio) {
        this.audio.volume = 0;
      }
    }
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  openCreatePlaylistModal() {
    this.showCreatePlaylistModal = true;
  }

  closeCreatePlaylistModal() {
    this.showCreatePlaylistModal = false;
  }

  createPlaylist(title: string, description: string) {
    const newPlaylist: Playlist = {
      id: `p${Date.now()}`,
      title,
      description,
      tracks: [],
    };
    this.playlists = [...this.playlists, newPlaylist];
    this.showCreatePlaylistModal = false;
  }

  deletePlaylist(id: string) {
    this.playlists = this.playlists.filter((p) => p.id !== id);
  }

  seekTo(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
    this.currentTime = time;
  }

  private loadTrack(track: Track) {
    this.currentTime = 0;
    this.duration = track.durationSec;
    this.isFavorite = false;

    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
      this.audio.removeEventListener('ended', this.onEnded);
      this.audio.removeEventListener('loadedmetadata', this.onLoadedMetadata);
      this.audio.removeEventListener('error', this.onError);
      const simInterval = (this.audio as any)._simInterval;
      if (simInterval) clearInterval(simInterval);
    }

    this.audio = new Audio(track.audioUrl);
    this.audio.volume = this.isMuted ? 0 : this.volume;

    this.audio.addEventListener('timeupdate', this.onTimeUpdate);
    this.audio.addEventListener('ended', this.onEnded);
    this.audio.addEventListener('loadedmetadata', this.onLoadedMetadata);
    this.audio.addEventListener('error', this.onError);

    this.audio.play().catch(() => {
      // If playback fails (e.g. no user gesture), just set state
      this.isPlaying = true;
    });
  }

  private onTimeUpdate = () => {
    if (this.audio && !isNaN(this.audio.currentTime)) {
      runInAction(() => {
        this.currentTime = this.audio.currentTime;
      });
    }
  };

  private onEnded = () => {
    this.next();
  };

  private onLoadedMetadata = () => {
    if (this.audio) {
      runInAction(() => {
        this.duration = this.audio.duration;
      });
    }
  };

  private onError = () => {
    // Audio failed to load — pause and reset
    this.pause();
    this.currentTime = 0;
  };

  destroy() {
    if (this.audio) {
      const simInterval = (this.audio as any)._simInterval;
      if (simInterval) {
        clearInterval(simInterval);
      }
      this.audio.pause();
      this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
      this.audio.removeEventListener('ended', this.onEnded);
      this.audio.removeEventListener('loadedmetadata', this.onLoadedMetadata);
      this.audio.removeEventListener('error', this.onError);
      this.audio = null;
    }
  }
}

export const playerStore = new PlayerStore();
