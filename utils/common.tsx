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

export const getReportName = (timeframe: string, startDate: string, endDate: string): string => {
  const today = new Date().toISOString().split('T')[0];
  
  switch (timeframe) {
    case 'td':
      return `cuebill-report-${today}`;
    case 'tm':
      const thisMonth = new Date();
      const thisMonthName = thisMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      return `cuebill-report-${thisMonthName}`;
    case 'lm':
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthName = lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      return `cuebill-report-${lastMonthName}`;
    case 'ty':
      const thisYear = new Date().getFullYear();
      return `cuebill-report-${thisYear}`;
    case 'ly':
      const lastYear = new Date().getFullYear() - 1;
      return `cuebill-report-${lastYear}`;
    case 'c':
      if (startDate && endDate) {
        return `cuebill-report-${startDate}-to-${endDate}`;
      }
      return `cuebill-report-custom-${today}`;
    case 'od':
      if (startDate) {
        return `cuebill-report-${startDate}`;
      }
      return `cuebill-report-${today}`;
    default:
      return `cuebill-report-${today}`;
  }
};

export const getDateRange = (timeframe: string, startDate: string, endDate: string): { startRange: Date | null, endRange: Date | null } => {
  const now = new Date();
  
  if (timeframe === "td") {
    // Today
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { startRange: startOfDay, endRange: endOfDay };
  } else if (timeframe === "tm") {
    // This Month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { startRange: startOfMonth, endRange: endOfMonth };
  } else if (timeframe === "lm") {
    // Last Month
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const startOfLastMonth = new Date(lastMonthYear, lastMonth, 1);
    const endOfLastMonth = new Date(lastMonthYear, lastMonth + 1, 0, 23, 59, 59, 999);
    return { startRange: startOfLastMonth, endRange: endOfLastMonth };
  } else if (timeframe === "ty") {
    // This Year
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    return { startRange: startOfYear, endRange: endOfYear };
  } else if (timeframe === "ly") {
    // Last Year
    const lastYear = now.getFullYear() - 1;
    const startOfLastYear = new Date(lastYear, 0, 1);
    const endOfLastYear = new Date(lastYear, 11, 31, 23, 59, 59, 999);
    return { startRange: startOfLastYear, endRange: endOfLastYear };
  } else if (timeframe === "c") {
    // Custom Range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      return { startRange: start, endRange: end };
    }
    return { startRange: null, endRange: null };
  } else if (timeframe === "od") {
    // One Day
    if (startDate) {
      const selectedDate = new Date(startDate);
      const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59, 999);
      return { startRange: startOfDay, endRange: endOfDay };
    }
    return { startRange: null, endRange: null };
  } else {
    // No filtering
    return { startRange: null, endRange: null };
  }
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
