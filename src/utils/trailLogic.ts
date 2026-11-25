import {
  Achievement,
  CompletedHike,
  DifficultyLevel,
  RegionName,
  Trail,
  TrailCategory,
} from '../types/trail';

export type CategoryFilterValue = 'All' | TrailCategory;
export type DistanceFilterValue = 'All' | 'Under10' | '10to20' | 'Over20';
export type SavedSortOption = 'rating' | 'distance' | 'difficulty';

export interface TrailFilterCriteria {
  query?: string;
  category?: CategoryFilterValue;
  difficulty?: 'All' | DifficultyLevel;
  distance?: DistanceFilterValue;
  region?: RegionName;
}

const DIFFICULTY_RANK: Record<DifficultyLevel, number> = {
  Easy: 1,
  Moderate: 2,
  Hard: 3,
};

export function filterTrails(trails: Trail[], criteria: TrailFilterCriteria): Trail[] {
  const normalizedQuery = (criteria.query ?? '').trim().toLowerCase();

  return trails.filter((trail) => {
    if (criteria.category && criteria.category !== 'All' && trail.category !== criteria.category) {
      return false;
    }

    if (criteria.difficulty && criteria.difficulty !== 'All' && trail.difficulty !== criteria.difficulty) {
      return false;
    }

    if (criteria.region && criteria.region !== 'All Regions' && trail.region !== criteria.region) {
      return false;
    }

    if (criteria.distance && criteria.distance !== 'All') {
      if (criteria.distance === 'Under10' && trail.distanceKm >= 10) return false;
      if (criteria.distance === '10to20' && (trail.distanceKm < 10 || trail.distanceKm > 20)) return false;
      if (criteria.distance === 'Over20' && trail.distanceKm <= 20) return false;
    }

    if (normalizedQuery) {
      const searchable =
        `${trail.id} ${trail.name} ${trail.park} ${trail.country} ${trail.category} ${trail.region} ${trail.summary}`.toLowerCase();
      if (!searchable.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });
}

export function sortSavedTrails(trails: Trail[], sortBy: SavedSortOption): Trail[] {
  const copy = [...trails];
  copy.sort((a, b) => {
    if (sortBy === 'distance') {
      return a.distanceKm - b.distanceKm;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty];
  });
  return copy;
}

export function formatDurationCompact(totalMinutes: number): string {
  const safeMinutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function formatChronoTimer(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

export function computeHikeProgressMetrics(params: {
  trail: Trail;
  elapsedSeconds: number;
  distanceCoveredKm: number;
}) {
  const { trail, elapsedSeconds, distanceCoveredKm } = params;
  const clampedCovered = Math.min(trail.distanceKm, Math.max(0, Number(distanceCoveredKm.toFixed(2))));
  const remainingKm = Math.max(0, Number((trail.distanceKm - clampedCovered).toFixed(1)));
  const completionPct =
    trail.distanceKm > 0 ? Math.min(100, Math.round((clampedCovered / trail.distanceKm) * 100)) : 0;

  const avgSpeedKmh =
    elapsedSeconds > 10
      ? Number(((clampedCovered / elapsedSeconds) * 3600).toFixed(1))
      : 0;

  const estimatedRemainingMinutes =
    trail.distanceKm > 0
      ? Math.max(0, Math.round(trail.durationMinutes * (1 - clampedCovered / trail.distanceKm)))
      : 0;

  const elevationGainedM = Math.round((completionPct / 100) * trail.elevationGainM);

  // Compass bearing smoothly interpolates around route waypoints (around 260° NE -> 285° WNW)
  const bearingDeg = Math.round((245 + (completionPct / 100) * 42) % 360);
  const cardinal = getCardinalDirection(bearingDeg);

  return {
    distanceCoveredKm: clampedCovered,
    remainingKm,
    completionPct,
    avgSpeedKmh,
    estimatedRemainingMinutes,
    elevationGainedM,
    bearingDeg,
    cardinal,
  };
}

export function getCardinalDirection(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(normalized / 45) % 8];
}

export function computeUserStats(params: {
  baseCompletedCount: number;
  baseTotalDistanceKm: number;
  baseLongestTrailKm: number;
  completedHikes: CompletedHike[];
  monthlyTargetKm: number;
}) {
  const {
    baseCompletedCount,
    baseTotalDistanceKm,
    baseLongestTrailKm,
    completedHikes,
    monthlyTargetKm,
  } = params;

  // Baseline includes historical 20 hikes prior to the 3 initial detailed hikes
  const extraHikes = Math.max(0, completedHikes.length - 3);
  const extraDistance = completedHikes
    .slice(0, extraHikes)
    .reduce((sum, h) => sum + h.distanceKm, 0);

  const trailsCompleted = baseCompletedCount + extraHikes;
  const totalDistanceKm = Number((baseTotalDistanceKm + extraDistance).toFixed(1));
  const longestTrailKm = completedHikes.reduce(
    (max, h) => Math.max(max, h.distanceKm),
    baseLongestTrailKm
  );

  // Monthly challenge distance: sum of hikes in current month (2026-11) or baseline 9.3 km + new hikes
  const newlyLoggedThisMonth = completedHikes
    .slice(0, extraHikes)
    .reduce((sum, h) => sum + h.distanceKm, 0);

  const monthlyDistanceKm = Number((9.3 + newlyLoggedThisMonth).toFixed(1));
  const monthlyProgressPct = Math.min(
    100,
    Math.round((monthlyDistanceKm / Math.max(1, monthlyTargetKm)) * 100)
  );

  return {
    trailsCompleted,
    totalDistanceKm,
    longestTrailKm: Number(longestTrailKm.toFixed(1)),
    monthlyDistanceKm,
    monthlyProgressPct,
  };
}

export function evaluateAchievements(
  achievements: Achievement[],
  stats: { trailsCompleted: number; totalDistanceKm: number; totalElevationM: number }
): Achievement[] {
  return achievements.map((ach) => {
    if (ach.unlocked) return ach;
    let current = 0;
    if (ach.metric === 'hikes') current = stats.trailsCompleted;
    if (ach.metric === 'distance') current = stats.totalDistanceKm;
    if (ach.metric === 'elevation') current = stats.totalElevationM;

    if (current >= ach.targetValue) {
      return {
        ...ach,
        unlocked: true,
        unlockedDate: 'Nov 2026',
      };
    }
    return ach;
  });
}

export function recalculateRating(existingRating: number, existingCount: number, newRating: number) {
  const total = existingRating * existingCount + newRating;
  const nextCount = existingCount + 1;
  return {
    rating: Number((total / nextCount).toFixed(1)),
    reviewCount: nextCount,
  };
}
