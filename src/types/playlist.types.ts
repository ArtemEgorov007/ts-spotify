import { Track } from '@/types/music.types';

export interface Playlist {
  id: string;
  title: string;
  description: string;
  tracks: Track[];
}
