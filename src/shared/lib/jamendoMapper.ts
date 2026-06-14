import { Track } from '@/types/music.types';
import { JamendoTrack } from '@/shared/api/jamendo';

export function jamendoToTrack(jt: JamendoTrack): Track {
  return {
    id: jt.id,
    title: jt.name,
    artist: jt.artist_name,
    album: jt.album_name,
    coverUrl: jt.album_image || '',
    durationSec: jt.duration,
    audioUrl: jt.audio,
    tags: jt.tags,
    speed: jt.speed,
    licenseUrl: jt.license_ccurl,
  };
}

export function jamendoToTracks(tracks: JamendoTrack[]): Track[] {
  return tracks.map(jamendoToTrack);
}
