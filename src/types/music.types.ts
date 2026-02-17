export type TrackId = string;

export interface Track {
  id: TrackId;
  title: string;
  artist: string;
  coverUrl: string;
  durationSec: number;
  audioUrl: string;
}
