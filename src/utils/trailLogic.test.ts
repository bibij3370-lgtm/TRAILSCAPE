import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_ACHIEVEMENTS, INITIAL_COMPLETED_HIKES, INITIAL_TRAILS } from '../data/trails';
import {
  computeHikeProgressMetrics,
  computeUserStats,
  evaluateAchievements,
  filterTrails,
  formatChronoTimer,
  formatDurationCompact,
  recalculateRating,
  sortSavedTrails,
} from './trailLogic';

test('filterTrails filters by category, search query, difficulty, and distance', () => {
  const lakes = filterTrails(INITIAL_TRAILS, { category: 'Lakes' });
  assert.equal(lakes.length, 2);
  assert.ok(lakes.every((t) => t.category === 'Lakes'));

  const dolomites = filterTrails(INITIAL_TRAILS, { query: 'dolomites' });
  assert.equal(dolomites.length, 1);
  assert.equal(dolomites[0].id, 'dolomites-seceda');

  const hardOver20 = filterTrails(INITIAL_TRAILS, {
    difficulty: 'Hard',
    distance: 'Over20',
  });
  assert.equal(hardOver20.length, 1);
  assert.equal(hardOver20[0].id, 'morskie-oko');
});

test('sortSavedTrails orders accurately by distance, rating, and difficulty', () => {
  const byDistance = sortSavedTrails(INITIAL_TRAILS, 'distance');
  assert.ok(byDistance[0].distanceKm <= byDistance[1].distanceKm);

  const byRating = sortSavedTrails(INITIAL_TRAILS, 'rating');
  assert.ok(byRating[0].rating >= byRating[1].rating);

  const byDifficulty = sortSavedTrails(INITIAL_TRAILS, 'difficulty');
  assert.equal(byDifficulty[0].difficulty, 'Easy');
  assert.equal(byDifficulty[byDifficulty.length - 1].difficulty, 'Hard');
});

test('formatDurationCompact and formatChronoTimer format values deterministically', () => {
  assert.equal(formatDurationCompact(398), '6h 38m');
  assert.equal(formatDurationCompact(45), '45m');
  assert.equal(formatChronoTimer(3665), '01:01:05');
});

test('computeHikeProgressMetrics computes remaining distance, speed, elevation, and bearing', () => {
  const morskie = INITIAL_TRAILS[0];
  const metrics = computeHikeProgressMetrics({
    trail: morskie,
    elapsedSeconds: 3600,
    distanceCoveredKm: 5.2,
  });

  assert.equal(metrics.completionPct, 25);
  assert.equal(metrics.remainingKm, 15.6);
  assert.equal(metrics.avgSpeedKmh, 5.2);
  assert.equal(metrics.elevationGainedM, Math.round(0.25 * morskie.elevationGainM));
  assert.ok(metrics.bearingDeg >= 245 && metrics.bearingDeg <= 287);
});

test('computeUserStats and evaluateAchievements update when new hikes finish', () => {
  const nextHikes = [
    {
      id: 'ch-new-1',
      trailId: 'lake-bled',
      trailName: 'Lake Bled & Ojstrica',
      location: 'Julian Alps',
      country: 'Slovenia',
      imageUrl: INITIAL_TRAILS[1].imageUrl,
      completedDate: '2026-11-24',
      distanceKm: 12.0,
      durationMinutes: 190,
      elevationGainM: 320,
      avgSpeedKmh: 3.8,
    },
    {
      id: 'ch-new-2',
      trailId: 'dolomites-seceda',
      trailName: 'Seceda Ridge Traverse',
      location: 'Dolomites',
      country: 'Italy',
      imageUrl: INITIAL_TRAILS[2].imageUrl,
      completedDate: '2026-11-24',
      distanceKm: 22.5,
      durationMinutes: 350,
      elevationGainM: 940,
      avgSpeedKmh: 3.9,
    },
    ...INITIAL_COMPLETED_HIKES,
  ];

  const stats = computeUserStats({
    baseCompletedCount: 23,
    baseTotalDistanceKm: 248.6,
    baseLongestTrailKm: 21.4,
    completedHikes: nextHikes,
    monthlyTargetKm: 20.8,
  });

  assert.equal(stats.trailsCompleted, 25);
  assert.equal(stats.longestTrailKm, 22.5);
  assert.equal(stats.monthlyProgressPct, 100);

  const updatedAch = evaluateAchievements(INITIAL_ACHIEVEMENTS, {
    trailsCompleted: stats.trailsCompleted,
    totalDistanceKm: stats.totalDistanceKm,
    totalElevationM: 4200,
  });
  const champion = updatedAch.find((a) => a.id === 'ach-adventure-champion');
  assert.equal(champion?.unlocked, true);
});

test('recalculateRating returns accurate weighted average', () => {
  const res = recalculateRating(4.7, 10, 5.0);
  assert.equal(res.reviewCount, 11);
  assert.equal(res.rating, 4.7);
});
