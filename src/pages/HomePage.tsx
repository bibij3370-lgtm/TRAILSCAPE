import React, { useMemo, useState } from 'react';
import { ArrowRight, Compass, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CategoryFilter } from '../components/CategoryFilter';
import { FeaturedTrailCard } from '../components/FeaturedTrailCard';
import { Header } from '../components/Header';
import { PrimaryButton } from '../components/PrimaryButton';
import { MobileInstallBanner } from '../components/PWAOverlays';
import { SearchBar } from '../components/SearchBar';
import { TrailCard } from '../components/TrailCard';
import { useTrails } from '../context/TrailContext';
import { CategoryFilterValue, filterTrails } from '../utils/trailLogic';

export const HomePage: React.FC = () => {
  const { trails, savedIds, recentIds, profile, toggleSaved } = useTrails();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterValue>('All');

  const filteredTrails = useMemo(
    () =>
      filterTrails(trails, {
        query: searchQuery,
        category: selectedCategory,
      }),
    [trails, searchQuery, selectedCategory]
  );

  const popularNearYou = useMemo(() => {
    const regional = trails.filter(
      (t) =>
        (profile.preferredRegion === 'All Regions' || t.region === profile.preferredRegion) &&
        t.popularNearUser
    );
    return regional.length > 0 ? regional : trails.filter((t) => t.popularNearUser);
  }, [trails, profile.preferredRegion]);

  const recentlyExplored = useMemo(
    () =>
      recentIds
        .map((id) => trails.find((t) => t.id === id))
        .filter((t): t is NonNullable<typeof t> => Boolean(t)),
    [recentIds, trails]
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const displayedFeatured = useMemo(() => {
    if (searchQuery.trim() || selectedCategory !== 'All') {
      return filteredTrails;
    }
    return filteredTrails.slice(0, 6);
  }, [filteredTrails, searchQuery, selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.08 }}
      className="relative min-h-screen overflow-x-hidden pb-28 md:pb-14"
    >
      {/* Organic misty mountain ridge backdrop matching reference Screen 1 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] overflow-hidden"
      >
        <svg
          viewBox="0 0 1440 360"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="homeMistGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DDE5D6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F4F3EC" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,180 C240,120 420,235 690,150 C960,65 1190,195 1440,115 L1440,360 L0,360 Z"
            fill="url(#homeMistGrad)"
          />
          <path
            d="M0,235 C300,180 540,260 860,195 C1120,140 1280,210 1440,175 L1440,360 L0,360 Z"
            fill="#A6B79B"
            fillOpacity="0.16"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-3">
        <Header />

        {/* Hero Section */}
        <section className="mt-2 sm:mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-[#242923] leading-[1.12] [text-wrap:balance]">
              Find New Paths Around You
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-[#858B80] max-w-xl leading-relaxed">
              Curated alpine ridges, tranquil glacial lakes, and ancient forest trails ready for your
              next outdoor escape.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search mountains, trails, parks..."
              className="w-full"
            />
            <MobileInstallBanner className="md:hidden" />
          </div>
        </section>

        {/* Category Filters */}
        <section aria-label="Trail category filter" className="mt-6">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </section>

        {/* Featured / Filtered Trails */}
        <section aria-label="Featured trails" className="mt-7">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#242923]">
                {searchQuery || selectedCategory !== 'All'
                  ? `Matching Trails (${filteredTrails.length})`
                  : 'Featured Destinations'}
              </h2>
              <p className="text-xs text-[#858B80]">
                {searchQuery || selectedCategory !== 'All'
                  ? 'Filtered from curated global routes'
                  : 'Signature alpine routes handpicked this season'}
              </p>
            </div>
            <Link
              to="/explore"
              className="text-xs sm:text-sm font-semibold text-[#304B37] inline-flex items-center gap-1 hover:underline whitespace-nowrap shrink-0"
            >
              <span>Open map</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          {displayedFeatured.length > 0 ? (
            <div
              data-testid="featured-trails-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {displayedFeatured.map((trail) => (
                <FeaturedTrailCard
                  key={trail.id}
                  trail={trail}
                  isSaved={savedIds.includes(trail.id)}
                  onToggleSave={toggleSaved}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-10 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#DDE5D6]/60 text-[#304B37] flex items-center justify-center mb-3">
                <Compass className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base font-bold text-[#242923]">
                No matching trails found
              </h3>
              <p className="mt-1 text-sm text-[#858B80] max-w-sm">
                Try clearing your search or switching back to all trail categories.
              </p>
              <PrimaryButton
                variant="secondary"
                size="sm"
                className="mt-4"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={resetFilters}
              >
                Reset filters
              </PrimaryButton>
            </div>
          )}
        </section>

        {/* Popular Near You & Recently Explored */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section aria-label="Popular near you" className="lg:col-span-7">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#242923]">Popular Near You</h2>
                <p className="text-xs text-[#858B80]">
                  Region: {profile.preferredRegion}
                </p>
              </div>
              <Link
                to="/explore"
                className="text-xs font-semibold text-[#304B37] hover:underline whitespace-nowrap"
              >
                Explore all
              </Link>
            </div>
            <div className="flex flex-col gap-3.5">
              {popularNearYou.map((trail) => (
                <TrailCard
                  key={trail.id}
                  trail={trail}
                  isSaved={savedIds.includes(trail.id)}
                  onToggleSave={toggleSaved}
                />
              ))}
            </div>
          </section>

          <section aria-label="Recently explored" className="lg:col-span-5">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#242923]">
                  Recently Explored
                </h2>
                <p className="text-xs text-[#858B80]">Pick up where you left off</p>
              </div>
              <Link
                to="/saved"
                className="text-xs font-semibold text-[#304B37] hover:underline whitespace-nowrap"
              >
                Saved ({savedIds.length})
              </Link>
            </div>
            <div className="flex flex-col gap-3.5">
              {recentlyExplored.slice(0, 3).map((trail) => (
                <TrailCard
                  key={trail.id}
                  trail={trail}
                  isSaved={savedIds.includes(trail.id)}
                  onToggleSave={toggleSaved}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};
