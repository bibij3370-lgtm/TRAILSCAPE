import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Compass,
  Droplets,
  List,
  LocateFixed,
  Map as MapIcon,
  Minus,
  Mountain,
  Play,
  Plus,
  RotateCcw,
  Star,
  Trees,
  Waves,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { PrimaryButton } from '../components/PrimaryButton';
import { SearchBar } from '../components/SearchBar';
import { TrailCard } from '../components/TrailCard';
import { useTrails } from '../context/TrailContext';
import { DifficultyLevel, Trail, TrailCategory } from '../types/trail';
import { DistanceFilterValue, filterTrails } from '../utils/trailLogic';

const CATEGORY_ICON: Record<TrailCategory, React.ReactNode> = {
  Mountains: <Mountain className="w-3.5 h-3.5" aria-hidden="true" />,
  Lakes: <Droplets className="w-3.5 h-3.5" aria-hidden="true" />,
  Forests: <Trees className="w-3.5 h-3.5" aria-hidden="true" />,
  Coastal: <Waves className="w-3.5 h-3.5" aria-hidden="true" />,
  Waterfalls: <Droplets className="w-3.5 h-3.5" aria-hidden="true" />,
};

export const ExploreMapPage: React.FC = () => {
  const { trails, savedIds, toggleSaved, showToast } = useTrails();

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState<'All' | DifficultyLevel>('All');
  const [distance, setDistance] = useState<DistanceFilterValue>('All');
  const [selectedTrailId, setSelectedTrailId] = useState<string>(trails[0]?.id ?? 'morskie-oko');
  const [zoom, setZoom] = useState(1);
  const [userLocationLabel, setUserLocationLabel] = useState('Tatra Base (49.20° N)');

  const filteredTrails = useMemo(
    () =>
      filterTrails(trails, {
        query: searchQuery,
        difficulty,
        distance,
      }),
    [trails, searchQuery, difficulty, distance]
  );

  const selectedTrail: Trail | undefined = useMemo(
    () => filteredTrails.find((t) => t.id === selectedTrailId) ?? filteredTrails[0],
    [filteredTrails, selectedTrailId]
  );

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      showToast('Centered on your active region');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocationLabel(
          `${pos.coords.latitude.toFixed(2)}° N, ${pos.coords.longitude.toFixed(2)}° E`
        );
        showToast('Updated your current map position');
      },
      () => {
        setUserLocationLabel('Warsaw / Tatra Corridor');
        showToast('Using regional base coordinates');
      },
      { timeout: 3500 }
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDifficulty('All');
    setDistance('All');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.08 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-28 md:pb-12 flex flex-col gap-4"
    >
      {/* Top Search + Filter Bar */}
      <div className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-3.5 sm:p-4 flex flex-col gap-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="w-full sm:flex-1 sm:min-w-[220px]">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search trails, parks, or countries..."
              ariaLabel="Search trails on map"
            />
          </div>

          <div
            role="group"
            aria-label="Map or list toggle"
            className="grid grid-cols-2 sm:flex items-center p-1 bg-[#F4F3EC] border border-[#DDE5D6] rounded-[16px] shrink-0"
          >
            <button
              type="button"
              onClick={() => setViewMode('map')}
              aria-pressed={viewMode === 'map'}
              className={`min-h-[40px] sm:min-h-[38px] px-3.5 py-1.5 rounded-[12px] text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#304B37] text-[#FAFAF5]'
                  : 'text-[#858B80] hover:text-[#242923]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Map</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-pressed={viewMode === 'list'}
              className={`min-h-[40px] sm:min-h-[38px] px-3.5 py-1.5 rounded-[12px] text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#304B37] text-[#FAFAF5]'
                  : 'text-[#858B80] hover:text-[#242923]'
              }`}
            >
              <List className="w-3.5 h-3.5" aria-hidden="true" />
              <span>List ({filteredTrails.length})</span>
            </button>
          </div>
        </div>

        {/* Difficulty & Distance Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[#858B80] font-medium mr-1">Difficulty:</span>
            {(['All', 'Easy', 'Moderate', 'Hard'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`min-h-[36px] px-3 rounded-[12px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  difficulty === level
                    ? 'bg-[#304B37] text-[#FAFAF5]'
                    : 'bg-[#F4F3EC] text-[#242923] hover:bg-[#DDE5D6]/60'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[#858B80] font-medium mr-1">Distance:</span>
            {(
              [
                { value: 'All', label: 'Any' },
                { value: 'Under10', label: '< 10 km' },
                { value: '10to20', label: '10–20 km' },
                { value: 'Over20', label: '20+ km' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDistance(opt.value)}
                className={`min-h-[36px] px-3 rounded-[12px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  distance === opt.value
                    ? 'bg-[#304B37] text-[#FAFAF5]'
                    : 'bg-[#F4F3EC] text-[#242923] hover:bg-[#DDE5D6]/60'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Interactive Topographic Vector Map Canvas */}
          <div className="lg:col-span-8 relative h-[350px] sm:h-[460px] lg:h-auto lg:min-h-[560px] bg-[#E5EAD9] border border-[#DDE5D6] rounded-[24px] overflow-hidden shadow-sm">
            <div
              className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out origin-center"
              style={{ transform: `scale(${zoom})` }}
            >
              <svg
                viewBox="0 0 1000 620"
                preserveAspectRatio="xMidYMid slice"
                className="w-full h-full block select-none"
                aria-label="Interactive hiking destinations map"
              >
                {/* Alpine topographic background & terrain contours */}
                <rect width="1000" height="620" fill="#E7ECE0" />
                <g fill="none" stroke="#C5D2BA" strokeWidth="1.5">
                  <path d="M-40 160 C 180 90, 320 260, 560 150 C 760 60, 910 200, 1050 110" />
                  <path d="M-40 240 C 210 170, 360 330, 610 220 C 810 130, 930 270, 1050 190" />
                  <path d="M-40 340 C 190 280, 390 410, 640 310 C 840 230, 950 360, 1050 290" />
                  <path d="M-40 440 C 230 390, 440 500, 700 410 C 860 350, 960 470, 1050 420" />
                  <ellipse cx="520" cy="240" rx="220" ry="120" strokeDasharray="6 6" />
                  <ellipse cx="520" cy="240" rx="140" ry="74" />
                  <ellipse cx="790" cy="190" rx="160" ry="95" />
                  <ellipse cx="220" cy="390" rx="150" ry="90" />
                </g>

                {/* Lakes & Coastal Ocean Tint */}
                <path
                  d="M0 430 Q 110 380 180 470 Q 250 560 190 620 L 0 620 Z"
                  fill="#BBD1CE"
                  fillOpacity="0.65"
                />
                <ellipse cx="410" cy="325" rx="48" ry="26" fill="#BBD1CE" fillOpacity="0.8" />
                <ellipse cx="545" cy="215" rx="36" ry="22" fill="#BBD1CE" fillOpacity="0.8" />

                {/* Connecting regional scenic routes */}
                <path
                  d="M290 272 Q 360 300 410 322 T 540 210"
                  fill="none"
                  stroke="#304B37"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  strokeOpacity="0.45"
                />
              </svg>

              {/* User Current Location Marker */}
              <div
                style={{ left: '53%', top: '77%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center z-10"
              >
                <span className="w-7 h-7 rounded-full bg-[#304B37]/20 flex items-center justify-center">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#304B37] border-2 border-[#FAFAF5] shadow" />
                </span>
                <span className="mt-1 px-2 py-0.5 rounded-[8px] bg-[#FAFAF5]/95 border border-[#DDE5D6] text-[10px] font-semibold text-[#242923] shadow-xs whitespace-nowrap max-w-[140px] truncate sm:max-w-none">
                  You · {userLocationLabel}
                </span>
              </div>

              {/* Nature-Inspired Trail Markers */}
              {filteredTrails.map((trail) => {
                const isSelected = selectedTrail?.id === trail.id;
                return (
                  <button
                    key={trail.id}
                    type="button"
                    onClick={() => setSelectedTrailId(trail.id)}
                    aria-label={`Select ${trail.name} on map`}
                    aria-pressed={isSelected}
                    style={{
                      left: `${trail.mapPosition.x}%`,
                      top: `${trail.mapPosition.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 min-h-[36px] sm:min-h-[38px] px-2 sm:px-2.5 py-1 rounded-full border shadow-md flex items-center gap-1 sm:gap-1.5 transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'z-20 bg-[#304B37] text-[#FAFAF5] border-[#FAFAF5] scale-105 sm:scale-110'
                        : 'z-10 bg-[#FAFAF5] text-[#242923] border-[#A6B79B] hover:scale-105'
                    }`}
                  >
                    <span className={isSelected ? 'text-[#DDE5D6]' : 'text-[#304B37]'}>
                      {CATEGORY_ICON[trail.category]}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold whitespace-nowrap max-w-[68px] truncate sm:max-w-none">
                      {trail.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Map Zoom & Locate Controls (bottom-right avoids upper trail pins) */}
            <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleLocateUser}
                aria-label="Center on my current location"
                className="min-w-[42px] min-h-[42px] rounded-[14px] bg-[#FAFAF5]/95 backdrop-blur-md border border-[#DDE5D6] text-[#304B37] flex items-center justify-center shadow-sm hover:bg-[#FAFAF5] cursor-pointer"
              >
                <LocateFixed className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.2).toFixed(1))))}
                aria-label="Zoom in map"
                className="min-w-[42px] min-h-[42px] rounded-[14px] bg-[#FAFAF5]/95 backdrop-blur-md border border-[#DDE5D6] text-[#242923] flex items-center justify-center shadow-sm hover:bg-[#FAFAF5] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.2).toFixed(1))))}
                aria-label="Zoom out map"
                className="min-w-[42px] min-h-[42px] rounded-[14px] bg-[#FAFAF5]/95 backdrop-blur-md border border-[#DDE5D6] text-[#242923] flex items-center justify-center shadow-sm hover:bg-[#FAFAF5] cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selected Trail Preview Card / Nearby Destinations Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {selectedTrail ? (
              <article className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-4 flex flex-col gap-3.5 shadow-sm">
                <div className="relative aspect-[16/10] rounded-[16px] overflow-hidden bg-[#DDE5D6]">
                  <img
                    src={selectedTrail.imageUrl}
                    alt={selectedTrail.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSaved(selectedTrail.id)}
                    aria-label={
                      savedIds.includes(selectedTrail.id)
                        ? `Remove ${selectedTrail.name} from saved`
                        : `Save ${selectedTrail.name}`
                    }
                    className={`absolute top-2.5 right-2.5 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer ${
                      savedIds.includes(selectedTrail.id)
                        ? 'bg-[#304B37] text-[#FAFAF5]'
                        : 'bg-[#242923]/45 text-[#FAFAF5]'
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        savedIds.includes(selectedTrail.id) ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-display text-lg font-bold text-[#242923]">
                        {selectedTrail.name}
                      </h2>
                      <p className="text-xs text-[#858B80]">
                        {selectedTrail.park}, {selectedTrail.country}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#242923] tabular-nums shrink-0">
                      <Star className="w-3.5 h-3.5 text-[#D9A85D] fill-[#D9A85D]" aria-hidden="true" />
                      <span>{selectedTrail.rating.toFixed(1)}</span>
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#242923]/80 leading-relaxed">
                    {selectedTrail.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#858B80] tabular-nums">
                    <span>{selectedTrail.distanceKm.toFixed(1)} km</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedTrail.durationLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>+{selectedTrail.elevationGainM}m</span>
                    <span aria-hidden="true">·</span>
                    <DifficultyBadge difficulty={selectedTrail.difficulty} variant="inline" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Link to={`/trail/${selectedTrail.id}`} className="block">
                    <PrimaryButton variant="secondary" fullWidth size="sm">
                      View Details
                    </PrimaryButton>
                  </Link>
                  <Link to={`/activity?trail=${selectedTrail.id}`} className="block">
                    <PrimaryButton
                      fullWidth
                      size="sm"
                      icon={<Play className="w-3.5 h-3.5 fill-current" />}
                    >
                      Start Hike
                    </PrimaryButton>
                  </Link>
                </div>
              </article>
            ) : (
              <div className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-8 text-center">
                <Compass className="w-8 h-8 text-[#304B37] mx-auto mb-2" aria-hidden="true" />
                <p className="font-display text-sm font-bold text-[#242923]">
                  No trails match these filters
                </p>
                <PrimaryButton
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={resetFilters}
                >
                  Clear filters
                </PrimaryButton>
              </div>
            )}

            {/* Quick nearby trail pills list */}
            <div className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-4 flex-1">
              <h3 className="font-display text-sm font-bold text-[#242923] mb-2.5">
                Destinations in View ({filteredTrails.length})
              </h3>
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                {filteredTrails.map((trail) => {
                  const active = selectedTrail?.id === trail.id;
                  return (
                    <button
                      key={trail.id}
                      type="button"
                      onClick={() => setSelectedTrailId(trail.id)}
                      className={`w-full min-h-[40px] px-3 py-2 rounded-[12px] text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#DDE5D6]/70 text-[#243D2D] font-semibold'
                          : 'hover:bg-[#F4F3EC] text-[#242923]'
                      }`}
                    >
                      <span className="truncate">{trail.name}</span>
                      <span className="text-[#858B80] tabular-nums shrink-0">
                        {trail.distanceKm.toFixed(1)} km
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : filteredTrails.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTrails.map((trail) => (
            <TrailCard
              key={trail.id}
              trail={trail}
              isSaved={savedIds.includes(trail.id)}
              onToggleSave={toggleSaved}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-12 text-center">
          <Compass className="w-9 h-9 text-[#304B37] mx-auto mb-3" aria-hidden="true" />
          <h2 className="font-display text-base font-bold text-[#242923]">
            No destinations match your filters
          </h2>
          <p className="mt-1 text-sm text-[#858B80]">
            Adjust difficulty or distance thresholds to discover more trails.
          </p>
          <PrimaryButton
            variant="secondary"
            size="sm"
            className="mt-4"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={resetFilters}
          >
            Clear filters
          </PrimaryButton>
        </div>
      )}
    </motion.div>
  );
};
