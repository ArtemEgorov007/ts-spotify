import { Playlist } from '@/types/playlist.types';
import { Track } from '@/types/music.types';

import cover1 from '@/assets/covers/cover-1.svg';
import cover2 from '@/assets/covers/cover-2.svg';
import cover3 from '@/assets/covers/cover-3.svg';
import cover4 from '@/assets/covers/cover-4.svg';
import cover5 from '@/assets/covers/cover-5.svg';
import cover6 from '@/assets/covers/cover-6.svg';

const demoAudioUrls = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
];

export const mockTracks: Track[] = [
  {
    id: 't1',
    title: 'Ночной путь',
    artist: 'Пульс Авеню',
    coverUrl: cover1,
    durationSec: 214,
    audioUrl: demoAudioUrls[0],
  },
  {
    id: 't2',
    title: 'Городские петли',
    artist: 'Стерео Кадры',
    coverUrl: cover2,
    durationSec: 189,
    audioUrl: demoAudioUrls[1],
  },
  {
    id: 't3',
    title: 'Послесвечение',
    artist: 'Нова Эхо',
    coverUrl: cover3,
    durationSec: 202,
    audioUrl: demoAudioUrls[2],
  },
  {
    id: 't4',
    title: 'Поздняя станция',
    artist: 'Рейлтон',
    coverUrl: cover4,
    durationSec: 176,
    audioUrl: demoAudioUrls[3],
  },
  {
    id: 't5',
    title: 'Сигнальные волны',
    artist: 'ФМ Север',
    coverUrl: cover5,
    durationSec: 231,
    audioUrl: demoAudioUrls[4],
  },
  {
    id: 't6',
    title: 'Стеклянный горизонт',
    artist: 'Монохром Кид',
    coverUrl: cover6,
    durationSec: 205,
    audioUrl: demoAudioUrls[5],
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: 'p1',
    title: 'Поток фокуса',
    description: 'Концентрация без отвлечений.',
    tracks: mockTracks.slice(0, 3),
  },
  {
    id: 'p2',
    title: 'Ночная сессия',
    description: 'Вечерний саунд для кода и дизайна.',
    tracks: mockTracks.slice(2, 6),
  },
  {
    id: 'p3',
    title: 'Утренний импульс',
    description: 'Спокойный старт и энергия.',
    tracks: [mockTracks[1], mockTracks[4], mockTracks[0]],
  },
];
