export const formatDate = (date: number | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

}

export const formatTime = (ms: number | undefined) => {
  if (!ms) return '00:00:00';
  // Add 5 hours and 30 minutes (in milliseconds)
  const istMs = ms + (5 * 60 * 60 * 1000) + (30 * 60 * 1000);
  const seconds = Math.floor((istMs / 1000) % 60);
  const minutes = Math.floor((istMs / (1000 * 60)) % 60);
  const hours = Math.floor((istMs / (1000 * 60 * 60)) % 24);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const formatElapsed = (ms: number | undefined) => {
  if (!ms) return '00s';
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  if (hours === 0 && minutes === 0) {
    return `${seconds.toString().padStart(2, '0')}s`;
  } else
  if (hours === 0) {
    return `${minutes.toString().padStart(2, '0')}m ${seconds
      .toString()
      .padStart(2, '0')}s`;
  } else { 
    return `${hours.toString().padStart(2, '0')}h ${minutes
      .toString()
      .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }
};

export const formatElapsedRound = (ms: number | undefined) => {
  if (!ms) return '00s';
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  if (hours === 0 && minutes === 0) {
    return `${seconds.toString().padStart(2, '0')}s`;
  } else
  if (hours === 0) {
    return `${minutes.toString().padStart(2, '0')}m`;
  } else { 
    return `${hours.toString().padStart(2, '0')}h`;
  }
}

export const calculateRevenue = (rate: number | undefined, ms: number | undefined) => {
  if (!rate || !ms) return (0).toFixed(2);
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  const revenue = (hours * 60 + minutes + seconds / 60) * rate;

  return revenue.toFixed(2);
};

import amber from '@/public/amber.svg';
import pool from '@/public/pool.png';
import ps from '@/public/ps.png';
import red from '@/public/red.svg';
import snooker from '@/public/snooker.png';
import snookerDark from '@/public/snooker-dark.png';
import stone from '@/public/stone.svg';
import tv from '@/public/tv.png';
import violet from '@/public/violet.svg';
import windows from '@/public/windows.png';
import xbox from '@/public/xbox.png';

export const tableTheme = (theme: string) => {
  switch (theme) {
    case 'tv':
      return tv;
    case 'windows':
      return windows;
    case 'xbox':
      return xbox;
    case 'ps':
      return ps;
    case 'pool':
      return pool;
    case 'snooker':
      return snooker;
    case 'snooker-dark':
      return snookerDark;
    case 'violet':
      return violet;
    case 'amber':
      return amber;
    case 'red':
      return red;
    case 'stone':
      return stone;
    default:
      return pool;
  }
}
