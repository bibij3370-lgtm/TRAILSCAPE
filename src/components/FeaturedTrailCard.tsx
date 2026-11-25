import React, { memo, useState } from 'react';
import { Bookmark, Mountain, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Trail } from '../types/trail';
import { DifficultyBadge } from './DifficultyBadge';

interface FeaturedTrailCardProps {
  trail: Trail;
  isSaved: boolean;
  onToggleSave: (trailId: string) => void;
}

export const FeaturedTrailCard: React.FC<FeaturedTrailCardProps> = memo(
  ({ trail, isSaved, onToggleSave }) => {
    const [imgError, setImgError] = useState(false);

    return (
      <article className="group relative bg-[#FAFAF5] rounded-[24px] p-3 border border-[#DDE5D6] shadow-sm shadow-[#242923]/5 hover:shadow-md hover:shadow-[#242923]/10 transition-shadow duration-150 flex flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-[#DDE5D6]">
          <Link
            to={`/trail/${trail.id}`}
            aria-label={`View ${trail.name} trail details`}
            className="block w-full h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#304B37]"
          >
            {!imgError ? (
              <img
                src={trail.imageUrl}
                alt={`${trail.name} in ${trail.park}, ${trail.country}`}
                referrerPolicy="no-referrer"
                decoding="async"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#304B37] to-[#A6B79B] flex flex-col items-center justify-center text-[#FAFAF5] p-4 text-center">
                <Mountain className="w-8 h-8 mb-2 opacity-80" aria-hidden="true" />
                <span className="font-display font-semibold text-sm">{trail.name}</span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSave(trail.id);
            }}
            aria-label={isSaved ? `Remove ${trail.name} from saved trails` : `Save ${trail.name}`}
            aria-pressed={isSaved}
            className={`absolute top-3 right-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full backdrop-blur-sm transition-transform duration-100 active:scale-90 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAFAF5] ${
              isSaved
                ? 'bg-[#304B37] text-[#FAFAF5] shadow-sm'
                : 'bg-[#242923]/45 text-[#FAFAF5] hover:bg-[#242923]/65'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        <Link
          to={`/trail/${trail.id}`}
          className="pt-3.5 px-1.5 pb-1 flex flex-col gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#304B37] rounded-[12px]"
        >
          <h3 className="font-display text-lg font-bold text-[#242923] leading-snug group-hover:text-[#304B37] transition-colors duration-100">
            {trail.name}
          </h3>
          <p className="text-sm text-[#858B80]">
            {trail.park} ({trail.country})
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#242923] tabular-nums">
            <span className="inline-flex items-center gap-1 font-semibold">
              <Star className="w-3.5 h-3.5 text-[#D9A85D] fill-[#D9A85D]" aria-hidden="true" />
              <span>{trail.rating.toFixed(1)}</span>
            </span>
            <span className="text-[#858B80]" aria-hidden="true">
              ·
            </span>
            <span className="text-[#858B80]">{trail.distanceKm.toFixed(1)} km</span>
            <span className="text-[#858B80]" aria-hidden="true">
              ·
            </span>
            <span className="text-[#858B80]">Est. {trail.durationLabel}</span>
            <span className="text-[#858B80]" aria-hidden="true">
              ·
            </span>
            <DifficultyBadge difficulty={trail.difficulty} variant="inline" />
          </div>
        </Link>
      </article>
    );
  }
);

FeaturedTrailCard.displayName = 'FeaturedTrailCard';
