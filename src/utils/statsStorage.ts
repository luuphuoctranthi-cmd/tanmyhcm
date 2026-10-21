import { AppStatistics } from '../types';

export const STATS_STORAGE_KEY = 'tan_my_ward_stats_v1';
export const STATS_SESSION_VISIT_KEY = 'tan_my_session_visited_flag';

export const ZERO_STATS: AppStatistics = {
  totalVisits: 0,
  totalVoiceQueries: 0,
  satisfiedVotes: 0,
  totalRatings: 0,
  averageRating: 0,
  likesCount: 0,
  procedureViews: {}
};

export const DEFAULT_STATS: AppStatistics = {
  totalVisits: 1428,
  totalVoiceQueries: 934,
  satisfiedVotes: 918,
  totalRatings: 932,
  averageRating: 4.9,
  likesCount: 652,
  procedureViews: {
    'proc-khai-sinh': 412,
    'proc-ket-hon': 218,
    'proc-sao-y-cong-chung': 324,
    'proc-tam-tru-thuong-tru': 186,
    'proc-xac-nhan-doc-than': 142
  }
};

function dispatchStatsEvent(stats: AppStatistics) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tanmy_stats_updated', { detail: stats }));
  }
}

export function getStoredStats(): AppStatistics {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(DEFAULT_STATS));
      return DEFAULT_STATS;
    }
    const parsed = JSON.parse(raw);
    return { ...ZERO_STATS, ...parsed };
  } catch (e) {
    return DEFAULT_STATS;
  }
}

export function saveStoredStats(stats: AppStatistics): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    dispatchStatsEvent(stats);
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}

/**
 * Increment visit on actual citizen visits
 */
export function recordVisit(): AppStatistics {
  try {
    // Only increment once per browser session to count real visitor sessions
    const hasVisitedThisSession = sessionStorage.getItem(STATS_SESSION_VISIT_KEY);
    const stats = getStoredStats();
    if (!hasVisitedThisSession) {
      sessionStorage.setItem(STATS_SESSION_VISIT_KEY, 'true');
      stats.totalVisits += 1;
      saveStoredStats(stats);
    }
    return stats;
  } catch {
    const stats = getStoredStats();
    stats.totalVisits += 1;
    saveStoredStats(stats);
    return stats;
  }
}

export function incrementVoiceQuery(procedureId?: string): AppStatistics {
  const stats = getStoredStats();
  stats.totalVoiceQueries += 1;
  if (procedureId) {
    stats.procedureViews[procedureId] = (stats.procedureViews[procedureId] || 0) + 1;
  }
  saveStoredStats(stats);
  return stats;
}

export function recordCitizenRating(rating: number, isSatisfied: boolean): AppStatistics {
  const stats = getStoredStats();
  const currentTotal = stats.totalRatings || 0;
  const currentAvg = stats.averageRating || 0;

  stats.totalRatings += 1;
  stats.averageRating = Number((((currentAvg * currentTotal) + rating) / (stats.totalRatings)).toFixed(1));
  if (isSatisfied) {
    stats.satisfiedVotes += 1;
  }
  saveStoredStats(stats);
  return stats;
}

export function recordLike(): AppStatistics {
  const stats = getStoredStats();
  stats.likesCount += 1;
  saveStoredStats(stats);
  return stats;
}

/**
 * Admin action: Reset all statistics to 0 and begin fresh count on real citizen interactions
 */
export function resetStatsToZero(): AppStatistics {
  const freshZero: AppStatistics = {
    totalVisits: 0,
    totalVoiceQueries: 0,
    satisfiedVotes: 0,
    totalRatings: 0,
    averageRating: 0,
    likesCount: 0,
    procedureViews: {}
  };
  try {
    sessionStorage.removeItem(STATS_SESSION_VISIT_KEY);
  } catch {}
  saveStoredStats(freshZero);
  return freshZero;
}
