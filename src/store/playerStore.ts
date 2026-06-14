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
  deletePlaylistTargetId: string | null = null;
  homeFeedMoodKey: string | null = null;
  homeFeedTracks: Track[] = [];
  queueSource: 'home' | 'search' | 'playlist' | null = null;
  queueSourceId: string | null = null;
  playbackError: string | null = null;

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

  get deletePlaylistTarget(): Playlist | null {
    if (!this.deletePlaylistTargetId) {
      return null;
    }

    return this.playlists.find((playlist) => playlist.id === this.deletePlaylistTargetId) ?? null;
  }

  getPlaylistById(id: string): Playlist | undefined {
    return this.playlists.find((playlist) => playlist.id === id);
  }

  setQueue(
    tracks: Track[],
    startIndex = 0,
    autoplay = false,
    source: 'home' | 'search' | 'playlist' | null = null,
    sourceId: string | null = null,
  ) {
    this.queue = tracks;
    this.currentTime = 0;
    this.duration = 0;
    this.isFavorite = false;
    this.playbackError = null;

    if (source) {
      this.queueSource = source;
      this.queueSourceId = sourceId;
    }

    if (tracks.length === 0 || !autoplay) {
      this.currentIndex = -1;
      this.stopAudio();
      this.isPlaying = false;
      return;
    }

    this.currentIndex = Math.min(Math.max(startIndex, 0), tracks.length - 1);
    this.loadTrack(tracks[this.currentIndex], true);
  }

  setHomeFeed(tracks: Track[], moodKey: string, force = false) {
    if (!force && this.homeFeedMoodKey === moodKey && this.homeFeedTracks.length > 0) {
      return;
    }

    this.homeFeedMoodKey = moodKey;
    this.homeFeedTracks = tracks;
  }

  playAt(index: number) {
    if (index < 0 || index >= this.queue.length) {
      return;
    }

    if (index === this.currentIndex && this.currentTrack && this.audio) {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
      return;
    }

    this.currentIndex = index;
    this.loadTrack(this.queue[index], true);
  }

  playFromHomeFeed(index: number) {
    if (index < 0 || index >= this.homeFeedTracks.length) {
      return;
    }

    const sameHomeQueue =
      this.queueSource === 'home' &&
      this.queue.length === this.homeFeedTracks.length &&
      this.queue.every((track, trackIndex) => track.id === this.homeFeedTracks[trackIndex]?.id);

    if (sameHomeQueue) {
      this.playAt(index);
      return;
    }

    this.setQueue(this.homeFeedTracks, index, true, 'home');
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
      this.loadTrack(track, true);
      return;
    }

    if (!this.currentTrack) {
      return;
    }

    if (!this.audio) {
      this.loadTrack(this.currentTrack, true);
      return;
    }

    this.audio.play().catch(() => {});
    this.isPlaying = true;
  }

  pause() {
    this.audio?.pause();
    this.isPlaying = false;
  }

  togglePlayback() {
    if (!this.currentTrack && this.queue.length > 0) {
      this.playAt(0);
      return;
    }

    if (!this.currentTrack) {
      return;
    }

    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
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
    this.loadTrack(this.queue[nextIndex], true);
  }

  prev() {
    if (this.queue.length === 0) return;

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
    this.loadTrack(this.queue[prevIndex], true);
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
    if (this.queueSource === 'playlist' && this.queueSourceId === id) {
      this.stopAudio();
      this.queue = [];
      this.currentIndex = -1;
      this.isPlaying = false;
      this.queueSource = null;
      this.queueSourceId = null;
    }

    this.playlists = this.playlists.filter((p) => p.id !== id);
  }

  requestDeletePlaylist(id: string) {
    this.deletePlaylistTargetId = id;
  }

  cancelDeletePlaylist() {
    this.deletePlaylistTargetId = null;
  }

  confirmDeletePlaylist(): string | null {
    if (!this.deletePlaylistTargetId) {
      return null;
    }

    const deletedId = this.deletePlaylistTargetId;
    this.deletePlaylist(deletedId);
    this.deletePlaylistTargetId = null;
    return deletedId;
  }

  playPlaylist(playlistId: string) {
    const playlist = this.playlists.find((p) => p.id === playlistId);
    if (!playlist || playlist.tracks.length === 0) {
      return;
    }

    this.setQueue(playlist.tracks, 0, true, 'playlist', playlistId);
  }

  seekTo(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
    this.currentTime = time;
  }

  private stopAudio() {
    if (!this.audio) {
      return;
    }

    this.audio.pause();
    this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
    this.audio.removeEventListener('ended', this.onEnded);
    this.audio.removeEventListener('loadedmetadata', this.onLoadedMetadata);
    this.audio.removeEventListener('error', this.onError);
    this.audio = null;
  }

  private loadTrack(track: Track, autoplay: boolean) {
    const sameTrackLoaded = this.currentTrack?.id === track.id && this.audio;

    if (sameTrackLoaded) {
      if (autoplay) {
        this.audio?.play().catch(() => {});
        this.isPlaying = true;
      }
      return;
    }

    this.currentTime = 0;
    this.duration = track.durationSec;
    this.isFavorite = false;
    this.playbackError = null;
    this.stopAudio();

    this.audio = new Audio(track.audioUrl);
    this.audio.volume = this.isMuted ? 0 : this.volume;
    this.audio.preload = 'metadata';

    this.audio.addEventListener('timeupdate', this.onTimeUpdate);
    this.audio.addEventListener('ended', this.onEnded);
    this.audio.addEventListener('loadedmetadata', this.onLoadedMetadata);
    this.audio.addEventListener('error', this.onError);

    if (autoplay) {
      this.audio.play().catch(() => {
        runInAction(() => {
          this.isPlaying = false;
        });
      });
      this.isPlaying = true;
    } else {
      this.isPlaying = false;
    }
  }

  private onTimeUpdate = () => {
    if (this.audio && !isNaN(this.audio.currentTime)) {
      const time = this.audio.currentTime;
      runInAction(() => {
        this.currentTime = time;
      });
    }
  };

  private onEnded = () => {
    this.next();
  };

  private onLoadedMetadata = () => {
    if (this.audio) {
      const duration = this.audio.duration;
      runInAction(() => {
        this.duration = duration;
      });
    }
  };

  private onError = () => {
    this.playbackError = 'Не удалось загрузить трек. Попробуй другой.';
    this.pause();
    this.currentTime = 0;
  };

  destroy() {
    this.stopAudio();
  }
}

export const playerStore = new PlayerStore();
