import { makeAutoObservable } from 'mobx';
import { Track } from '@/types/music.types';

class PlayerStore {
  queue: Track[] = [];
  currentTrack: Track | null = null;
  isPlaying = false;
  volume = 0.8;

  constructor() {
    makeAutoObservable(this);
  }

  setQueue(tracks: Track[]) {
    this.queue = tracks;

    if (!this.currentTrack && tracks.length > 0) {
      this.currentTrack = tracks[0];
    }
  }

  play(track?: Track) {
    if (track) {
      this.currentTrack = track;
    }

    if (this.currentTrack) {
      this.isPlaying = true;
    }
  }

  pause() {
    this.isPlaying = false;
  }

  togglePlayback() {
    if (!this.currentTrack && this.queue.length > 0) {
      this.currentTrack = this.queue[0];
    }

    if (this.currentTrack) {
      this.isPlaying = !this.isPlaying;
    }
  }

  setVolume(volume: number) {
    this.volume = Math.min(1, Math.max(0, volume));
  }
}

export const playerStore = new PlayerStore();
