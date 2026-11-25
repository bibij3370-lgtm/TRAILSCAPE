import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  Flag,
  Pause,
  Play,
  Plus,
  Route,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { TrailMap } from '../components/TrailMap';
import { useTrails } from '../context/TrailContext';
import { Achievement } from '../types/trail';
import {
  computeHikeProgressMetrics,
  formatChronoTimer,
  formatDurationCompact,
} from '../utils/trailLogic';

type ActivityStatus = 'idle' | 'active' | 'paused' | 'completed';

export const ActivityPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { trails, recordCompletedHike, showToast } = useTrails();

  const initialTrailId = searchParams.get('trail') ?? trails[0]?.id ?? 'morskie-oko';
  const [selectedTrailId, setSelectedTrailId] = useState(initialTrailId);
  const trail = useMemo(
    () => trails.find((t) => t.id === selectedTrailId) ?? trails[0],
    [trails, selectedTrailId]
  );

  const [status, setStatus] = useState<ActivityStatus>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceCoveredKm, setDistanceCoveredKm] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);

  // Keep selected trail synced when URL param changes
  useEffect(() => {
    const paramId = searchParams.get('trail');
    if (paramId && paramId !== selectedTrailId && status === 'idle') {
      setSelectedTrailId(paramId);
    }
  }, [searchParams, selectedTrailId, status]);

  // Live 1-second timer & realistic walking pace increment (~4.2 km/h) when active
  useEffect(() => {
    if (status !== 'active') return;
    const interval = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
      setDistanceCoveredKm((d) => Math.min(trail.distanceKm, d + 0.0012));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [status, trail.distanceKm]);

  const metrics = useMemo(
    () =>
      computeHikeProgressMetrics({
        trail,
        elapsedSeconds,
        distanceCoveredKm,
      }),
    [trail, elapsedSeconds, distanceCoveredKm]
  );

  const handleTrailChange = (newId: string) => {
    if (status === 'active' || status === 'paused') {
      showToast('Finish or reset your current hike before switching trails');
      return;
    }
    setSelectedTrailId(newId);
    setSearchParams({ trail: newId });
    setElapsedSeconds(0);
    setDistanceCoveredKm(0);
    setStatus('idle');
  };

  const handleStart = () => {
    if (status === 'idle') {
      // Seed a slight initial distance step so user sees realistic GPS lock immediately
      setDistanceCoveredKm((d) => (d === 0 ? 0.1 : d));
      setElapsedSeconds((s) => (s === 0 ? 12 : s));
    }
    setStatus('active');
  };

  const handlePauseResume = () => {
    setStatus((prev) => (prev === 'active' ? 'paused' : 'active'));
  };

  const handleLogSegment = () => {
    setDistanceCoveredKm((d) => Math.min(trail.distanceKm, Number((d + 1.2).toFixed(2))));
    setElapsedSeconds((s) => s + 1240);
  };

  const handleFinish = () => {
    const finalDistance = Math.max(0.4, Number(metrics.distanceCoveredKm.toFixed(1)));
    const finalDurationMins = Math.max(15, Math.round(elapsedSeconds / 60));
    const finalSpeed =
      metrics.avgSpeedKmh > 0
        ? metrics.avgSpeedKmh
        : Number((finalDistance / (finalDurationMins / 60)).toFixed(1));
    const finalElevation = Math.max(
      Math.round((finalDistance / trail.distanceKm) * trail.elevationGainM),
      40
    );

    const newlyUnlocked = recordCompletedHike({
      trailId: trail.id,
      trailName: trail.name,
      location: trail.park,
      country: trail.country,
      imageUrl: trail.imageUrl,
      completedDate: '2026-11-24',
      distanceKm: finalDistance,
      durationMinutes: finalDurationMins,
      elevationGainM: finalElevation,
      avgSpeedKmh: finalSpeed,
    });

    setUnlockedAchievements(newlyUnlocked);
    setStatus('completed');
    showToast(`Completed ${trail.name}!`);
  };

  const handleReset = () => {
    setStatus('idle');
    setElapsedSeconds(0);
    setDistanceCoveredKm(0);
    setUnlockedAchievements([]);
  };

  if (status === 'completed') {
    const finalDistance = Math.max(0.4, Number(metrics.distanceCoveredKm.toFixed(1)));
    const finalDurationMins = Math.max(15, Math.round(elapsedSeconds / 60));
    const finalSpeed =
      metrics.avgSpeedKmh > 0
        ? metrics.avgSpeedKmh
        : Number((finalDistance / (finalDurationMins / 60)).toFixed(1));

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-28 md:pb-16"
      >
        <div className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[30px] p-6 sm:p-8 shadow-md text-center">
          <div className="w-16 h-16 rounded-full bg-[#304B37] text-[#FAFAF5] flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-[#242923]">
            Hike Completed!
          </h1>
          <p className="mt-1 text-sm text-[#858B80]">
            {trail.name} · {trail.park}, {trail.country}
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-[#F4F3EC] rounded-[18px] p-3.5">
              <div className="text-[11px] text-[#858B80]">Distance</div>
              <div className="mt-1 font-display text-lg font-bold text-[#242923] tabular-nums">
                {finalDistance.toFixed(1)} km
              </div>
            </div>
            <div className="bg-[#F4F3EC] rounded-[18px] p-3.5">
              <div className="text-[11px] text-[#858B80]">Duration</div>
              <div className="mt-1 font-display text-lg font-bold text-[#242923] tabular-nums">
                {formatDurationCompact(finalDurationMins)}
              </div>
            </div>
            <div className="bg-[#F4F3EC] rounded-[18px] p-3.5">
              <div className="text-[11px] text-[#858B80]">Avg Speed</div>
              <div className="mt-1 font-display text-lg font-bold text-[#242923] tabular-nums">
                {finalSpeed.toFixed(1)} km/h
              </div>
            </div>
            <div className="bg-[#F4F3EC] rounded-[18px] p-3.5">
              <div className="text-[11px] text-[#858B80]">Elevation</div>
              <div className="mt-1 font-display text-lg font-bold text-[#242923] tabular-nums">
                +{Math.max(metrics.elevationGainedM, 40)}m
              </div>
            </div>
          </div>

          {unlockedAchievements.length > 0 && (
            <div className="mt-5 bg-[#DDE5D6]/60 border border-[#A6B79B] rounded-[18px] p-4 flex items-center gap-3 text-left">
              <Award className="w-6 h-6 text-[#304B37] shrink-0" aria-hidden="true" />
              <div>
                <div className="font-display text-sm font-bold text-[#243D2D]">
                  Achievement Unlocked: {unlockedAchievements[0].title}
                </div>
                <p className="text-xs text-[#304B37]">{unlockedAchievements[0].description}</p>
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/profile" className="w-full sm:w-auto">
              <PrimaryButton fullWidth>View Profile &amp; History</PrimaryButton>
            </Link>
            <PrimaryButton variant="secondary" onClick={handleReset} className="w-full sm:w-auto">
              Track Another Hike
            </PrimaryButton>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.08 }}
      className="pb-28 md:pb-16"
    >
      {/* Top Mountain Landscape Header with Route Path Overlay (matches reference Screen 3) */}
      <div className="relative h-56 sm:h-72 bg-[#243D2D] overflow-hidden">
        <img
          src={trail.imageUrl}
          alt={trail.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-85"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#242923]/45 via-transparent to-[#F4F3EC]"
        />

        {/* Route Path Overlay SVG */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 180"
          className="pointer-events-none absolute inset-0 w-full h-full"
        >
          <path
            d="M 110 155 C 145 120, 175 112, 195 82 C 215 52, 255 64, 290 36"
            fill="none"
            stroke="#FAFAF5"
            strokeWidth="3.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
          <circle cx="110" cy="155" r="6" fill="#77A77A" stroke="#FAFAF5" strokeWidth="2.5" />
          <circle cx="290" cy="36" r="7" fill="#304B37" stroke="#FAFAF5" strokeWidth="2.5" />
        </svg>

        {/* Top Bar Trail Selector */}
        <div className="absolute top-4 inset-x-0 max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="min-w-[44px] min-h-[44px] rounded-full bg-[#FAFAF5]/90 backdrop-blur-sm text-[#242923] flex items-center justify-center shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 max-w-md bg-[#FAFAF5]/95 backdrop-blur-sm border border-[#DDE5D6] rounded-[18px] px-3 py-1.5 flex items-center gap-2.5 shadow-sm">
            <img
              src={trail.imageUrl}
              alt=""
              className="w-9 h-9 rounded-[10px] object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <label htmlFor="activity-trail-select" className="sr-only">
                Select trail to track
              </label>
              <select
                id="activity-trail-select"
                value={trail.id}
                onChange={(e) => handleTrailChange(e.target.value)}
                className="w-full bg-transparent font-display text-sm font-bold text-[#242923] focus:outline-none truncate cursor-pointer"
              >
                {trails.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-[#858B80] tabular-nums truncate">
                {trail.distanceKm.toFixed(1)} km · Est. {trail.durationLabel}
              </div>
            </div>
          </div>

          <div className="hidden sm:block sm:w-[44px]" aria-hidden="true" />
        </div>
      </div>

      {/* Main Frosted Hike Details Sheet */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[30px] p-5 sm:p-8 shadow-lg shadow-[#242923]/8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#242923]">
                Hike Details
              </h1>
              <p className="text-xs sm:text-sm text-[#858B80]">
                {status === 'idle' && 'Ready to begin GPS trail tracking'}
                {status === 'active' && 'Live tracking active · Recording distance & elevation'}
                {status === 'paused' && 'Activity paused · Resume when ready'}
              </p>
            </div>

            {status !== 'idle' && (
              <button
                type="button"
                onClick={handleLogSegment}
                className="min-h-[40px] px-3.5 py-1.5 rounded-[14px] bg-[#DDE5D6]/65 text-[#243D2D] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#DDE5D6] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Log +1.2 km checkpoint</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Live Duration, Distance, Speed, Elevation */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-3.5">
              <div className="bg-[#F4F3EC] border border-[#DDE5D6] rounded-[20px] p-3.5 sm:p-4">
                <div className="flex items-center gap-1.5 text-xs text-[#858B80]">
                  <Clock className="w-3.5 h-3.5 text-[#304B37]" aria-hidden="true" />
                  <span>Duration</span>
                </div>
                <div className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-[#242923] tabular-nums">
                  {status === 'idle' ? trail.durationLabel : formatChronoTimer(elapsedSeconds)}
                </div>
                <div className="mt-1 text-xs text-[#858B80] tabular-nums">
                  {formatDurationCompact(metrics.estimatedRemainingMinutes)} left
                </div>
              </div>

              <div className="bg-[#F4F3EC] border border-[#DDE5D6] rounded-[20px] p-3.5 sm:p-4">
                <div className="flex items-center gap-1.5 text-xs text-[#858B80]">
                  <Route className="w-3.5 h-3.5 text-[#304B37]" aria-hidden="true" />
                  <span>Distance</span>
                </div>
                <div className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-[#242923] tabular-nums">
                  {metrics.distanceCoveredKm.toFixed(1)} km
                </div>
                <div className="mt-1 text-xs text-[#858B80] tabular-nums">
                  {metrics.remainingKm.toFixed(1)} km left
                </div>
              </div>

              <div className="bg-[#F4F3EC] border border-[#DDE5D6] rounded-[20px] p-3.5 sm:p-4">
                <div className="flex items-center gap-1.5 text-xs text-[#858B80]">
                  <Compass className="w-3.5 h-3.5 text-[#304B37]" aria-hidden="true" />
                  <span>Current Speed</span>
                </div>
                <div className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-[#242923] tabular-nums">
                  {metrics.avgSpeedKmh.toFixed(1)} km/h
                </div>
                <div className="mt-1 text-xs text-[#858B80]">Steady trail pace</div>
              </div>

              <div className="bg-[#F4F3EC] border border-[#DDE5D6] rounded-[20px] p-3.5 sm:p-4">
                <div className="flex items-center gap-1.5 text-xs text-[#858B80]">
                  <TrendingUp className="w-3.5 h-3.5 text-[#304B37]" aria-hidden="true" />
                  <span>Elevation Climbed</span>
                </div>
                <div className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-[#242923] tabular-nums">
                  +{metrics.elevationGainedM} m
                </div>
                <div className="mt-1 text-xs text-[#858B80] tabular-nums">
                  Target {trail.elevationGainM}m
                </div>
              </div>
            </div>

            {/* Right: Circular Compass Dial inspired by reference Screen 3 */}
            <div className="lg:col-span-5 bg-[#F4F3EC] border border-[#DDE5D6] rounded-[24px] p-5 flex flex-col items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <span className="absolute top-0 text-xs font-bold text-[#242923]">N</span>
                <span className="absolute right-0 text-xs font-semibold text-[#858B80]">E</span>
                <span className="absolute bottom-0 text-xs font-semibold text-[#858B80]">S</span>
                <span className="absolute left-0 text-xs font-semibold text-[#858B80]">W</span>

                <svg viewBox="0 0 140 140" className="w-36 h-36" aria-hidden="true">
                  <circle
                    cx="70"
                    cy="70"
                    r="54"
                    fill="#FAFAF5"
                    stroke="#DDE5D6"
                    strokeWidth="2"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="44"
                    fill="none"
                    stroke="#A6B79B"
                    strokeWidth="1.5"
                    strokeDasharray="2 6"
                  />
                  <g transform={`rotate(${metrics.bearingDeg} 70 70)`}>
                    <polygon points="70,14 75,26 65,26" fill="#304B37" />
                  </g>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-display text-2xl font-bold text-[#242923] tabular-nums">
                    {metrics.bearingDeg}°
                  </span>
                  <span className="text-xs font-semibold text-[#304B37]">{metrics.cardinal}</span>
                </div>
              </div>
              <p className="mt-1 text-[11px] text-[#858B80]">Live route heading</p>
            </div>
          </div>

          {/* Primary Tracking Action Controls */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {status === 'idle' ? (
              <PrimaryButton
                size="lg"
                fullWidth
                icon={<Play className="w-4 h-4 fill-current" />}
                onClick={handleStart}
              >
                Start Hike
              </PrimaryButton>
            ) : (
              <>
                <PrimaryButton
                  size="lg"
                  variant="secondary"
                  className="flex-1 min-w-[140px]"
                  icon={
                    status === 'active' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )
                  }
                  onClick={handlePauseResume}
                >
                  {status === 'active' ? 'Pause' : 'Resume'}
                </PrimaryButton>
                <PrimaryButton
                  size="lg"
                  className="flex-1 min-w-[160px]"
                  icon={<Flag className="w-4 h-4" />}
                  onClick={handleFinish}
                >
                  Finish Hike
                </PrimaryButton>
              </>
            )}
          </div>
        </div>

        {/* Live Route Map below Hike Details */}
        <div className="mt-6">
          <TrailMap trail={trail} progressPct={metrics.completionPct} compact />
        </div>
      </div>
    </motion.div>
  );
};
