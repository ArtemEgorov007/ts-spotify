import { makeAutoObservable, runInAction } from 'mobx';
import { Track } from '@/types/music.types';
import { Playlist } from '@/types/playlist.types';
import { mockPlaylists } from '@/shared/mock/media';

type QueueSource = 'home' | 'search' | 'playlist';

function tracksMatch(left: Track[], right: Track[]) {
  return left.length === right.length && left.every((track, index) => track.id === right[index]?.id);
}

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
  queueSource: QueueSource | null = null;
  queueSourceId: string | null = null;
  playbackError: string | null = null;

  private audio: HTMLAudioElement | null = null;
  private loadedTrackId: string | null = null;
  private loadGeneration = 0;

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
    source: QueueSource | null = null,
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

    const index = Math.min(Math.max(startIndex, 0), tracks.length - 1);
    this.startTrackAt(index, true);
  }

  setHomeFeed(tracks: Track[], moodKey: string, force = false) {
    if (!force && this.homeFeedMoodKey === moodKey && this.homeFeedTracks.length > 0) {
      return;
    }

    this.homeFeedMoodKey = moodKey;
    this.homeFeedTracks = tracks;

    if (this.queueSource === 'home') {
      this.syncQueueWithTracks(tracks);
    }
  }

  playFromHomeFeed(index: number) {
    if (index < 0 || index >= this.homeFeedTracks.length) {
      return;
    }

    if (this.queueSource === 'home' && tracksMatch(this.queue, this.homeFeedTracks)) {
      this.playAt(index);
      return;
    }

    this.setQueue(this.homeFeedTracks, index, true, 'home');
  }

  playFromList(
    tracks: Track[],
    index: number,
    source: 'search' | 'playlist',
    sourceId: string | null = null,
  ) {
    if (index < 0 || index >= tracks.length) {
      return;
    }

    if (
      this.queueSource === source &&
      this.queueSourceId === sourceId &&
      tracksMatch(this.queue, tracks)
    ) {
      this.playAt(index);
      return;
    }

    this.setQueue(tracks, index, true, source, sourceId);
  }

  playAt(index: number) {
    if (index < 0 || index >= this.queue.length) {
      return;
    }

    const track = this.queue[index];

    if (this.canToggleTrack(track, index)) {
      this.togglePlayback();
      return;
    }

    this.startTrackAt(index, true);
  }

  togglePlayback() {
    if (!this.currentTrack && this.queue.length > 0) {
      this.playAt(0);
      return;
    }

    if (!this.currentTrack || !this.audio) {
      return;
    }

    if (this.isPlaying) {
      this.pause();
      return;
    }

    void this.resumePlayback();
  }

  pause() {
    this.audio?.pause();
    this.isPlaying = false;
  }

  next() {
    if (this.queue.length === 0) {
      return;
    }

    if (this.isRepeat && this.audio && this.currentTrack) {
      this.seekTo(0);
      void this.resumePlayback();
      return;
    }

    const activeIndex = this.currentIndex >= 0 ? this.currentIndex : 0;
    let nextIndex = activeIndex;

    if (this.isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * this.queue.length);
      } while (this.queue.length > 1 && nextIndex === activeIndex);
    } else {
      nextIndex = (activeIndex + 1) % this.queue.length;
    }

    this.startTrackAt(nextIndex, true);
  }

  prev() {
    if (this.queue.length === 0) {
      return;
    }

    if (this.currentTime > 3 && this.audio) {
      this.seekTo(0);
      return;
    }

    const activeIndex = this.currentIndex >= 0 ? this.currentIndex : 0;
    let prevIndex = activeIndex;

    if (this.isShuffle) {
      do {
        prevIndex = Math.floor(Math.random() * this.queue.length);
      } while (this.queue.length > 1 && prevIndex === activeIndex);
    } else {
      prevIndex = (activeIndex - 1 + this.queue.length) % this.queue.length;
    }

    this.startTrackAt(prevIndex, true);
  }

  playPlaylist(playlistId: string) {
    const playlist = this.playlists.find((item) => item.id === playlistId);
    if (!playlist || playlist.tracks.length === 0) {
      return;
    }

    if (
      this.queueSource === 'playlist' &&
      this.queueSourceId === playlistId &&
      tracksMatch(this.queue, playlist.tracks)
    ) {
      this.togglePlayback();
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

      return;
    }

    this.isMuted = true;
    this.previousVolume = this.volume;
    this.volume = 0;

    if (this.audio) {
      this.audio.volume = 0;
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
    this.playlists = [
      ...this.playlists,
      {
        id: `p${Date.now()}`,
        title,
        description,
        tracks: [],
      },
    ];
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

    this.playlists = this.playlists.filter((playlist) => playlist.id !== id);
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

  destroy() {
    this.stopAudio();
  }

  private canToggleTrack(track: Track, index: number) {
    return (
      index === this.currentIndex &&
      this.loadedTrackId === track.id &&
      Boolean(this.audio)
    );
  }

  private startTrackAt(index: number, autoplay: boolean) {
    const track = this.queue[index];
    if (!track) {
      return;
    }

    this.currentIndex = index;
    this.loadTrack(track, autoplay);
  }

  private syncQueueWithTracks(tracks: Track[]) {
    const playingTrackId = this.isPlaying ? this.loadedTrackId : this.currentTrack?.id ?? null;
    this.queue = tracks;

    if (!playingTrackId) {
      if (this.currentIndex >= tracks.length) {
        this.currentIndex = -1;
      }
      return;
    }

    const nextIndex = tracks.findIndex((track) => track.id === playingTrackId);

    if (nextIndex >= 0) {
      this.currentIndex = nextIndex;
      return;
    }

    this.stopAudio();
    this.currentIndex = -1;
    this.isPlaying = false;
    this.currentTime = 0;
  }

  private resumePlayback() {
    if (!this.audio) {
      if (this.currentTrack) {
        this.loadTrack(this.currentTrack, true);
      }
      return;
    }

    void this.audio
      .play()
      .then(() => {
        runInAction(() => {
          this.isPlaying = true;
          this.playbackError = null;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isPlaying = false;
        });
      });
  }

  private stopAudio() {
    if (!this.audio) {
      this.loadedTrackId = null;
      return;
    }

    this.audio.pause();
    this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
    this.audio.removeEventListener('ended', this.onEnded);
    this.audio.removeEventListener('loadedmetadata', this.onLoadedMetadata);
    this.audio.removeEventListener('error', this.onError);
    this.audio = null;
    this.loadedTrackId = null;
  }

  private loadTrack(track: Track, autoplay: boolean) {
    if (this.loadedTrackId === track.id && this.audio) {
      if (autoplay) {
        void this.resumePlayback();
      } else {
        this.pause();
      }
      return;
    }

    this.currentTime = 0;
    this.duration = track.durationSec;
    this.isFavorite = false;
    this.playbackError = null;
    this.stopAudio();

    const generation = ++this.loadGeneration;
    const audio = new Audio(track.audioUrl);
    this.audio = audio;
    this.loadedTrackId = track.id;
    audio.volume = this.isMuted ? 0 : this.volume;
    audio.preload = 'metadata';

    audio.addEventListener('timeupdate', this.onTimeUpdate);
    audio.addEventListener('ended', this.onEnded);
    audio.addEventListener('loadedmetadata', this.onLoadedMetadata);
    audio.addEventListener('error', this.onError);

    if (!autoplay) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;

    void audio
      .play()
      .then(() => {
        runInAction(() => {
          if (generation !== this.loadGeneration || this.audio !== audio) {
            return;
          }

          this.isPlaying = true;
          this.playbackError = null;
        });
      })
      .catch(() => {
        runInAction(() => {
          if (generation !== this.loadGeneration || this.audio !== audio) {
            return;
          }

          this.isPlaying = false;
        });
      });
  }

  private onTimeUpdate = () => {
    if (!this.audio || Number.isNaN(this.audio.currentTime)) {
      return;
    }

    const time = this.audio.currentTime;
    runInAction(() => {
      this.currentTime = time;
    });
  };

  private onEnded = () => {
    this.next();
  };

  private onLoadedMetadata = () => {
    if (!this.audio) {
      return;
    }

    const duration = this.audio.duration;
    runInAction(() => {
      this.duration = duration;
    });
  };

  private onError = () => {
    runInAction(() => {
      this.playbackError = 'Не удалось загрузить трек. Попробуй другой.';
      this.pause();
      this.currentTime = 0;
    });
  };
}

export const playerStore = new PlayerStore();
