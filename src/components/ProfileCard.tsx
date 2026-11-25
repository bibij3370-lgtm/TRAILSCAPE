import React, { useState } from 'react';
import { Edit3, MapPin, User } from 'lucide-react';
import { UserProfile } from '../types/trail';

interface ProfileCardProps {
  profile: UserProfile;
  trailsCompleted: number;
  totalDistanceKm: number;
  longestTrailKm: number;
  onEditClick: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  trailsCompleted,
  totalDistanceKm,
  longestTrailKm,
  onEditClick,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#FAFAF5] border border-[#DDE5D6] rounded-[30px] p-6 sm:p-8 shadow-sm">
      {/* Subtle Topographic Map Backdrop inspired by reference Profile screen */}
      <svg
        aria-hidden="true"
        viewBox="0 0 800 260"
        className="pointer-events-none absolute inset-x-0 top-0 w-full h-44 text-[#DDE5D6] opacity-75"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-20 40 C 120 10, 210 110, 340 70 C 480 25, 590 120, 820 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M-20 85 C 140 55, 250 155, 390 105 C 530 55, 640 165, 820 95"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M-20 130 C 170 95, 290 190, 440 140 C 570 95, 670 190, 820 135"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="150" cy="70" r="55" fill="#DDE5D6" fillOpacity="0.45" />
        <circle cx="655" cy="65" r="70" fill="#DDE5D6" fillOpacity="0.4" />
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#FAFAF5] shadow-md overflow-hidden bg-[#DDE5D6]">
            {!imgError ? (
              <img
                src={profile.avatarUrl}
                alt={`${profile.name} profile portrait`}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#304B37] flex items-center justify-center text-[#FAFAF5]">
                <User className="w-10 h-10" aria-hidden="true" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onEditClick}
            aria-label="Edit profile"
            className="absolute bottom-0 right-0 min-w-[40px] min-h-[40px] rounded-full bg-[#304B37] text-[#FAFAF5] border-2 border-[#FAFAF5] flex items-center justify-center shadow-sm hover:bg-[#243D2D] transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        <h1 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-[#242923]">
          {profile.name}
        </h1>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#858B80]">
          <MapPin className="w-3.5 h-3.5 text-[#304B37]" aria-hidden="true" />
          <span>{profile.location}</span>
        </p>

        <div className="mt-6 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#F4F3EC] rounded-[18px] px-3 py-3.5">
            <div className="font-display text-base sm:text-lg font-bold text-[#242923]">
              {profile.memberSince}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-[#858B80]">Member Since</div>
          </div>
          <div className="bg-[#F4F3EC] rounded-[18px] px-3 py-3.5">
            <div className="font-display text-base sm:text-lg font-bold text-[#242923] tabular-nums">
              {trailsCompleted}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-[#858B80]">Trails Completed</div>
          </div>
          <div className="bg-[#F4F3EC] rounded-[18px] px-3 py-3.5">
            <div className="font-display text-base sm:text-lg font-bold text-[#242923] tabular-nums">
              {totalDistanceKm.toFixed(1)} km
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-[#858B80]">Total Distance</div>
          </div>
          <div className="bg-[#F4F3EC] rounded-[18px] px-3 py-3.5">
            <div className="font-display text-base sm:text-lg font-bold text-[#242923] tabular-nums">
              {longestTrailKm.toFixed(1)} km
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-[#858B80]">Longest Trail</div>
          </div>
        </div>
      </div>
    </section>
  );
};
