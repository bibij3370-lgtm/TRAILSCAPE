import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Backpack,
  Bookmark,
  Calendar,
  Check,
  Clock,
  Compass,
  Download,
  MapPin,
  Mountain,
  Play,
  Route,
  Share2,
  Star,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { ElevationChart } from '../components/ElevationChart';
import { PrimaryButton } from '../components/PrimaryButton';
import { ReviewCard } from '../components/ReviewCard';
import { StatisticsCard } from '../components/StatisticsCard';
import { TrailMap } from '../components/TrailMap';
import { WeatherCard } from '../components/WeatherCard';
import { useTrails } from '../context/TrailContext';

export const TrailDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    trails,
    savedIds,
    offlineIds,
    toggleSaved,
    toggleOfflineDownload,
    markExplored,
    getCheckedItems,
    toggleChecklistItem,
    addTrailReview,
    showToast,
  } = useTrails();

  const trail = trails.find((t) => t.id === id);

  const [imgError, setImgError] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewConditions, setReviewConditions] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    if (trail) {
      markExplored(trail.id);
    }
  }, [trail?.id, markExplored]);

  if (!trail) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-[#242923]">Trail not found</h1>
        <p className="mt-2 text-sm text-[#858B80]">
          This trail may have moved or is unavailable offline.
        </p>
        <PrimaryButton className="mt-6" onClick={() => navigate('/')}>
          Back to Explore
        </PrimaryButton>
      </div>
    );
  }

  const isSaved = savedIds.includes(trail.id);
  const isOffline = offlineIds.includes(trail.id);
  const checkedItems = getCheckedItems(trail.id);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trail.name} — TRAILSCAPE`,
          text: `Check out ${trail.name} (${trail.distanceKm} km) in ${trail.park}, ${trail.country}`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Trail link copied to clipboard');
    } catch {
      showToast(`Share: ${trail.name} (${trail.park})`);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError('Please add a brief note about your experience on this trail.');
      return;
    }
    setReviewError(null);
    addTrailReview(trail.id, reviewRating, reviewComment, reviewConditions);
    setReviewComment('');
    setReviewConditions('');
    setReviewRating(5);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.08 }}
      className="pb-28 md:pb-16"
    >
      {/* Top Full-Width Photography Hero */}
      <div className="relative w-full h-[270px] sm:h-[390px] lg:h-[450px] bg-[#304B37] overflow-hidden">
        {!imgError ? (
          <img
            src={trail.imageUrl}
            alt={`${trail.name} landscape`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#243D2D] to-[#A6B79B] flex items-center justify-center">
            <Mountain className="w-16 h-16 text-[#FAFAF5]/70" aria-hidden="true" />
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#242923]/75 via-[#242923]/20 to-[#242923]/35"
        />

        {/* Top Floating Controls */}
        <div className="absolute top-4 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="min-w-[44px] min-h-[44px] rounded-full bg-[#FAFAF5]/90 backdrop-blur-md text-[#242923] flex items-center justify-center shadow-md hover:bg-[#FAFAF5] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleShare}
              aria-label={`Share ${trail.name}`}
              className="min-w-[44px] min-h-[44px] rounded-full bg-[#FAFAF5]/90 backdrop-blur-md text-[#242923] flex items-center justify-center shadow-md hover:bg-[#FAFAF5] transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => toggleSaved(trail.id)}
              aria-label={isSaved ? 'Remove trail from saved' : 'Save trail'}
              aria-pressed={isSaved}
              className={`min-w-[44px] min-h-[44px] rounded-full backdrop-blur-md flex items-center justify-center shadow-md transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#304B37] text-[#FAFAF5]'
                  : 'bg-[#FAFAF5]/90 text-[#242923] hover:bg-[#FAFAF5]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Overlaid Title on Hero Bottom */}
        <div className="absolute bottom-5 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-[#FAFAF5]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#DDE5D6] mb-1.5">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {trail.park}, {trail.country}
              </span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{trail.category}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight [text-wrap:balance]">
            {trail.name}
          </h1>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-6">
        {/* Rating + Difficulty Summary Row & Action CTAs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DDE5D6]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#242923] tabular-nums">
              <Star className="w-4 h-4 text-[#D9A85D] fill-[#D9A85D]" aria-hidden="true" />
              <span>{trail.rating.toFixed(1)}</span>
              <span className="text-[#858B80] font-normal">({trail.reviewCount} reviews)</span>
            </div>
            <span className="text-[#858B80]" aria-hidden="true">
              ·
            </span>
            <DifficultyBadge difficulty={trail.difficulty} variant="block" />
            <span className="hidden sm:inline text-[#858B80]" aria-hidden="true">
              ·
            </span>
            <button
              type="button"
              onClick={() => toggleOfflineDownload(trail.id)}
              className="min-h-[44px] sm:min-h-[38px] px-3 py-1 rounded-[12px] bg-[#FAFAF5] border border-[#DDE5D6] text-xs font-medium text-[#304B37] inline-flex items-center gap-1.5 hover:bg-[#DDE5D6]/50 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isOffline ? 'Cached Offline' : 'Download Offline'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3">
            <PrimaryButton
              variant="secondary"
              fullWidth
              className="sm:w-auto"
              icon={<Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-[#304B37]' : ''}`} />}
              onClick={() => toggleSaved(trail.id)}
            >
              {isSaved ? 'Saved' : 'Save Trail'}
            </PrimaryButton>
            <Link to={`/activity?trail=${trail.id}`} className="block sm:inline-block">
              <PrimaryButton
                fullWidth
                className="sm:w-auto"
                icon={<Play className="w-4 h-4 fill-current" />}
              >
                Start Your Adventure
              </PrimaryButton>
            </Link>
          </div>
        </div>

        {/* 4 Statistics Cards */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <StatisticsCard
            label="Distance"
            value={`${trail.distanceKm.toFixed(1)} km`}
            subtext={trail.routeType}
            icon={<Route className="w-4 h-4" aria-hidden="true" />}
          />
          <StatisticsCard
            label="Estimated Duration"
            value={trail.durationLabel}
            subtext="Steady alpine pace"
            icon={<Clock className="w-4 h-4" aria-hidden="true" />}
          />
          <StatisticsCard
            label="Elevation Gain"
            value={`${trail.elevationGainM}m`}
            subtext={`Max altitude ${trail.maxAltitudeM}m`}
            icon={<TrendingUp className="w-4 h-4" aria-hidden="true" />}
          />
          <StatisticsCard
            label="Difficulty"
            value={trail.difficulty}
            subtext={trail.surface.split('&')[0].trim()}
            icon={<Mountain className="w-4 h-4" aria-hidden="true" />}
          />
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Description, Highlights, Map, Elevation, Reviews */}
          <div className="lg:col-span-7 flex flex-col gap-7">
            <section className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-6">
              <h2 className="font-display text-lg font-bold text-[#242923]">Trail Overview</h2>
              <p className="mt-2.5 text-sm sm:text-[15px] text-[#242923]/85 leading-relaxed">
                {trail.description}
              </p>

              <h3 className="mt-5 font-display text-sm font-bold text-[#242923]">
                Route Highlights
              </h3>
              <ul className="mt-2.5 flex flex-col gap-2">
                {trail.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-[#242923]/85"
                  >
                    <Compass className="w-4 h-4 text-[#304B37] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <TrailMap trail={trail} />

            <ElevationChart points={trail.elevationProfile} />

            {/* User Reviews */}
            <section aria-label="Trail reviews" className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-[#242923]">
                  Hiker Reviews ({trail.reviewCount})
                </h2>
              </div>

              <form
                onSubmit={handleReviewSubmit}
                className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-5 flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-[#242923]">
                    Share Your Trail Report
                  </span>
                  <div className="flex items-center gap-1" role="group" aria-label="Rating out of 5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setReviewRating(num)}
                        aria-label={`Rate ${num} stars`}
                        className="min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            num <= reviewRating
                              ? 'text-[#D9A85D] fill-[#D9A85D]'
                              : 'text-[#DDE5D6]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  value={reviewConditions}
                  onChange={(e) => setReviewConditions(e.target.value)}
                  placeholder="Trail conditions (e.g. Dry granite, light breeze)"
                  aria-label="Trail conditions"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-[12px] bg-[#F4F3EC] border border-[#DDE5D6] text-xs text-[#242923] placeholder:text-[#858B80] focus:outline-none focus:border-[#304B37]"
                />

                <textarea
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => {
                    setReviewComment(e.target.value);
                    if (reviewError) setReviewError(null);
                  }}
                  placeholder="How were the views, footing, and timing?"
                  aria-label="Review comment"
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#F4F3EC] border border-[#DDE5D6] text-sm text-[#242923] placeholder:text-[#858B80] focus:outline-none focus:border-[#304B37]"
                />
                {reviewError && <p className="text-xs text-[#C87568]">{reviewError}</p>}
                <div className="flex justify-end">
                  <PrimaryButton type="submit" size="sm">
                    Post Review
                  </PrimaryButton>
                </div>
              </form>

              <div className="flex flex-col gap-3">
                {trail.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Weather, Route Logistics, Packing Checklist */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <WeatherCard weather={trail.weather} locationLabel={trail.name} />

            {/* Hiking Route Information */}
            <section className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-5">
              <h2 className="font-display text-base font-bold text-[#242923] mb-3.5">
                Route Information
              </h2>
              <dl className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
                <div>
                  <dt className="text-[#858B80]">Route Type</dt>
                  <dd className="mt-0.5 font-semibold text-[#242923]">{trail.routeType}</dd>
                </div>
                <div>
                  <dt className="text-[#858B80]">Best Season</dt>
                  <dd className="mt-0.5 font-semibold text-[#242923] inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#304B37]" aria-hidden="true" />
                    <span>{trail.bestSeason}</span>
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[#858B80]">Surface</dt>
                  <dd className="mt-0.5 font-semibold text-[#242923]">{trail.surface}</dd>
                </div>
              </dl>
            </section>

            {/* What to Bring Checklist */}
            <section className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-5">
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="flex items-center gap-2">
                  <Backpack className="w-4 h-4 text-[#304B37]" aria-hidden="true" />
                  <h2 className="font-display text-base font-bold text-[#242923]">
                    What to Bring
                  </h2>
                </div>
                <span className="text-xs font-medium text-[#858B80] tabular-nums">
                  {checkedItems.length}/{trail.checklist.length} packed
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {trail.checklist.map((item) => {
                  const checked = checkedItems.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleChecklistItem(trail.id, item)}
                      aria-pressed={checked}
                      className={`w-full min-h-[44px] px-3.5 py-2 rounded-[14px] text-left text-sm flex items-center gap-3 transition-colors cursor-pointer ${
                        checked
                          ? 'bg-[#DDE5D6]/55 text-[#243D2D]'
                          : 'bg-[#F4F3EC] text-[#242923] hover:bg-[#DDE5D6]/30'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-[6px] border flex items-center justify-center shrink-0 transition-colors ${
                          checked
                            ? 'bg-[#304B37] border-[#304B37] text-[#FAFAF5]'
                            : 'border-[#A6B79B] bg-[#FAFAF5]'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                      </span>
                      <span className={checked ? 'line-through opacity-75' : ''}>{item}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
