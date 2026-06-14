export type TrackId = string;

export interface Track {
  id: TrackId;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  durationSec: number;
  audioUrl: string;
  tags?: string[];
  speed?: string;
  licenseUrl?: string;
}
