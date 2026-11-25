import React, { memo, useState } from 'react';
import { Bookmark, CheckCircle2, Download, Mountain, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Trail } from '../types/trail';
import { DifficultyBadge } from './DifficultyBadge';

interface TrailCardProps {
  trail: Trail;
  isSaved: boolean;
  isOffline?: boolean;
  onToggleSave: (trailId: string) => void;
  onToggleOffline?: (trailId: string) => void;
  showOfflineAction?: boolean;
}

export const TrailCard: React.FC<TrailCardProps> = memo(
  ({
    trail,
    isSaved,
    isOffline = false,
    onToggleSave,
    onToggleOffline,
    showOfflineAction = false,
  }) => {
    const [imgError, setImgError] = useState(false);

    return (
      <article className="group bg-[#FAFAF5] border border-[#DDE5D6] rounded-[18px] p-3 flex gap-3.5 items-center hover:shadow-md hover:shadow-[#242923]/8 transition-shadow duration-150">
        <Link
          to={`/trail/${trail.id}`}
          aria-label={`Open ${trail.name}`}
          className="w-24 h-24 sm:w-28 sm:h-24 rounded-[12px] overflow-hidden bg-[#DDE5D6] shrink-0 block"
        >
          {!imgError ? (
            <img
              src={trail.imageUrl}
              alt={`${trail.name} trail view`}
              referrerPolicy="no-referrer"
              decoding="async"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="w-full h-full bg-[#304B37] flex items-center justify-center text-[#FAFAF5]">
              <Mountain className="w-6 h-6" aria-hidden="true" />
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1 flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/trail/${trail.id}`} className="min-w-0 flex-1">
              <h3 className="font-display text-base font-bold text-[#242923] truncate group-hover:text-[#304B37] transition-colors duration-100">
                {trail.name}
              </h3>
              <p className="text-xs text-[#858B80] truncate">
                {trail.park}, {trail.country}
              </p>
            </Link>

            <button
              type="button"
              onClick={() => onToggleSave(trail.id)}
              aria-label={isSaved ? `Remove ${trail.name} from saved` : `Save ${trail.name}`}
              aria-pressed={isSaved}
              className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors duration-100 active:scale-90 cursor-pointer shrink-0 ${
                isSaved
                  ? 'bg-[#304B37] text-[#FAFAF5]'
                  : 'bg-[#F4F3EC] text-[#242923] hover:bg-[#DDE5D6]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#242923] tabular-nums mt-0.5">
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
            <span className="text-[#858B80]">{trail.durationLabel}</span>
            <span className="text-[#858B80]" aria-hidden="true">
              ·
            </span>
            <DifficultyBadge difficulty={trail.difficulty} variant="inline" />
          </div>

          {showOfflineAction && onToggleOffline && (
            <div className="pt-1.5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onToggleOffline(trail.id)}
                className={`min-h-[36px] px-3 py-1 rounded-[12px] text-xs font-medium inline-flex items-center gap-1.5 transition-colors duration-100 cursor-pointer ${
                  isOffline
                    ? 'bg-[#DDE5D6] text-[#243D2D]'
                    : 'bg-[#F4F3EC] text-[#304B37] hover:bg-[#DDE5D6]/70'
                }`}
              >
                {isOffline ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Available Offline</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Download Offline</span>
                  </>
                )}
              </button>
              <Link
                to={`/trail/${trail.id}`}
                className="text-xs font-semibold text-[#304B37] hover:underline whitespace-nowrap"
              >
                View details
              </Link>
            </div>
          )}
        </div>
      </article>
    );
  }
);

TrailCard.displayName = 'TrailCard';
