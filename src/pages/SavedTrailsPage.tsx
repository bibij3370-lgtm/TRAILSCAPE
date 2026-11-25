import React, { useMemo, useState } from 'react';
import { ArrowUpDown, Bookmark, Compass, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { SearchBar } from '../components/SearchBar';
import { TrailCard } from '../components/TrailCard';
import { useTrails } from '../context/TrailContext';
import { filterTrails, SavedSortOption, sortSavedTrails } from '../utils/trailLogic';

export const SavedTrailsPage: React.FC = () => {
  const { trails, savedIds, offlineIds, toggleSaved, toggleOfflineDownload } = useTrails();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SavedSortOption>('rating');

  const savedTrails = useMemo(() => {
    const onlySaved = trails.filter((t) => savedIds.includes(t.id));
    const filtered = filterTrails(onlySaved, { query: searchQuery });
    return sortSavedTrails(filtered, sortBy);
  }, [trails, savedIds, searchQuery, sortBy]);

  const offlineSavedCount = savedIds.filter((id) => offlineIds.includes(id)).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.08 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-5 pb-28 md:pb-16"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#DDE5D6]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#242923]">
            Saved Trails
          </h1>
          <p className="mt-1 text-sm text-[#858B80] tabular-nums">
            {savedIds.length} {savedIds.length === 1 ? 'trail' : 'trails'} bookmarked ·{' '}
            {offlineSavedCount} cached for offline navigation
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-medium text-[#304B37] bg-[#DDE5D6]/55 px-3.5 py-2 rounded-[14px] self-start sm:self-auto">
          <WifiOff className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Offline packs work without cellular signal</span>
        </div>
      </div>

      {/* Search & Sort Controls */}
      {savedIds.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Filter your saved trails..."
            ariaLabel="Filter saved trails"
            className="sm:max-w-md flex-1"
          />

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#858B80] shrink-0" aria-hidden="true" />
            <label htmlFor="saved-sort" className="text-xs font-medium text-[#858B80] whitespace-nowrap">
              Sort by
            </label>
            <select
              id="saved-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SavedSortOption)}
              className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2 rounded-[14px] bg-[#FAFAF5] border border-[#DDE5D6] text-xs font-semibold text-[#242923] focus:outline-none focus:border-[#304B37] cursor-pointer"
            >
              <option value="rating">Highest Rating</option>
              <option value="distance">Shortest Distance</option>
              <option value="difficulty">Difficulty (Easy → Hard)</option>
            </select>
          </div>
        </div>
      )}

      {/* Trails Grid or Empty States */}
      <div className="mt-6">
        {savedIds.length === 0 ? (
          <div className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-12 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#DDE5D6]/60 text-[#304B37] flex items-center justify-center mb-4">
              <Bookmark className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-bold text-[#242923]">
              Your saved trail list is empty
            </h2>
            <p className="mt-1.5 text-sm text-[#858B80] max-w-md">
              Bookmark mountains, alpine lakes, and coastal routes to plan future adventures and
              download maps offline.
            </p>
            <Link to="/" className="mt-5">
              <PrimaryButton icon={<Compass className="w-4 h-4" />}>
                Discover Trails
              </PrimaryButton>
            </Link>
          </div>
        ) : savedTrails.length === 0 ? (
          <div className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-10 text-center">
            <h2 className="font-display text-base font-bold text-[#242923]">
              No saved trails match "{searchQuery}"
            </h2>
            <PrimaryButton
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              Show all saved trails
            </PrimaryButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedTrails.map((trail) => (
              <TrailCard
                key={trail.id}
                trail={trail}
                isSaved={true}
                isOffline={offlineIds.includes(trail.id)}
                onToggleSave={toggleSaved}
                onToggleOffline={toggleOfflineDownload}
                showOfflineAction={true}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
