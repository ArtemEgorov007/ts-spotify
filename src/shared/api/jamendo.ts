const JAMENDO_BASE = 'https://api.jamendo.com/v3.0';
const CLIENT_ID = '4351c25f';

export interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  album_image: string;
  duration: number; // seconds
  audio: string;
  audiodownload: string;
  tags: string[];
  speed: string;
  acousticelectric: string;
  license_ccurl: string;
}

export interface JamendoSearchResponse {
  headers: {
    status: string;
    code: number;
  };
  results: JamendoTrack[];
}

export type MoodKey = 'morning' | 'energy' | 'relax' | 'focus' | 'night';

export interface MoodPreset {
  key: MoodKey;
  emoji: string;
  label: string;
  description: string;
  tags: string;
  speed: string;
  acousticelectric: string;
}

export const MOOD_PRESETS: MoodPreset[] = [
  {
    key: 'morning',
    emoji: '🌅',
    label: 'Утро',
    description: 'Спокойный старт дня',
    tags: 'chill',
    speed: 'low',
    acousticelectric: '',
  },
  {
    key: 'energy',
    emoji: '⚡',
    label: 'Энергия',
    description: 'Бодрый ритм для активности',
    tags: 'rock,pop',
    speed: 'high',
    acousticelectric: '',
  },
  {
    key: 'relax',
    label: 'Расслабление',
    description: 'Спокойная музыка для отдыха',
    emoji: '😌',
    tags: 'ambient,chill',
    speed: 'verylow',
    acousticelectric: '',
  },
  {
    key: 'focus',
    emoji: '🎯',
    label: 'Фокус',
    description: 'Концентрация без отвлечений',
    tags: 'instrumental',
    speed: 'medium',
    acousticelectric: '',
  },
  {
    key: 'night',
    emoji: '🌙',
    label: 'Ночь',
    description: 'Тихая музыка для вечера',
    tags: 'downtempo,chill',
    speed: 'verylow',
    acousticelectric: '',
  },
];

function buildUrl(path: string, params: Record<string, string>): string {
  const url = new URL(`${JAMENDO_BASE}${path}`);
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('format', 'json');
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
}

export async function fetchTracks(params: {
  tags?: string;
  speed?: string;
  acousticelectric?: string;
  search?: string;
  limit?: number;
  offset?: number;
  order?: string;
}): Promise<JamendoTrack[]> {
  const { tags, speed, acousticelectric, search, limit = 20, offset = 0, order } = params;

  const queryParams: Record<string, string> = {
    limit: String(limit),
    offset: String(offset),
    order: order || 'popularity_week',
    audioformat: 'mp32',
    include: 'musicinfo',
  };

  if (tags) queryParams.tags = tags;
  if (speed) queryParams.speed = speed;
  if (acousticelectric) queryParams.acousticelectric = acousticelectric;
  if (search) queryParams.search = search;

  const url = buildUrl('/tracks/', queryParams);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Jamendo API error: ${response.status}`);
  }

  const data: JamendoSearchResponse = await response.json();
  if (data.headers.status !== 'success') {
    throw new Error(`Jamendo API returned error: ${data.headers.code}`);
  }

  return data.results.filter((t) => t.audio); // only tracks with audio URL
}

export async function fetchTracksByMood(mood: MoodPreset, limit = 20): Promise<JamendoTrack[]> {
  return fetchTracks({
    tags: mood.tags,
    speed: mood.speed,
    acousticelectric: mood.acousticelectric,
    limit,
  });
}

export async function searchTracks(query: string, limit = 20): Promise<JamendoTrack[]> {
  return fetchTracks({ search: query, limit });
}
