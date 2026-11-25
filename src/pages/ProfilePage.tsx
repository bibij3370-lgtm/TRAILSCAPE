import React, { useState } from 'react';
import { ArrowUpRight, Award, Calendar, Clock, Mountain, TrendingUp, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AchievementCard } from '../components/AchievementCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProfileCard } from '../components/ProfileCard';
import { ProgressBar } from '../components/ProgressBar';
import { MobileInstallBanner } from '../components/PWAOverlays';
import { useTrails } from '../context/TrailContext';
import { formatDurationCompact } from '../utils/trailLogic';

export const ProfilePage: React.FC = () => {
  const {
    profile,
    userStats,
    completedHikes,
    achievements,
    updateProfile,
  } = useTrails();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [locationInput, setLocationInput] = useState(profile.location);
  const [targetInput, setTargetInput] = useState(String(profile.monthlyTargetKm));
  const [formError, setFormError] = useState<string | null>(null);

  const openEdit = () => {
    setNameInput(profile.name);
    setLocationInput(profile.location);
    setTargetInput(String(profile.monthlyTargetKm));
    setFormError(null);
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = nameInput.trim();
    const trimmedLoc = locationInput.trim();
    const parsedTarget = Number(targetInput);

    if (!trimmedName || !trimmedLoc) {
      setFormError('Name and location are required.');
      return;
    }
    if (!Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      setFormError('Monthly target must be a positive distance.');
      return;
    }

    updateProfile({
      name: trimmedName,
      location: trimmedLoc,
      monthlyTargetKm: Number(parsedTarget.toFixed(1)),
    });
    setIsEditing(false);
  };

  // Monthly challenge ridge elevation curve marker x-position (0-100)
  const challengeX = Math.max(8, Math.min(92, userStats.monthlyProgressPct));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.08 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-5 pb-28 md:pb-16 flex flex-col gap-7"
    >
      <ProfileCard
        profile={profile}
        trailsCompleted={userStats.trailsCompleted}
        totalDistanceKm={userStats.totalDistanceKm}
        longestTrailKm={userStats.longestTrailKm}
        onEditClick={openEdit}
      />

      <MobileInstallBanner className="md:hidden" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Monthly Challenge + Achievements */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <section className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-6 overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-[#242923]">
                  Monthly Challenge
                </h2>
                <p className="mt-0.5 text-xs text-[#858B80]">15 days left in November</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#304B37]">
                <Award className="w-4 h-4" aria-hidden="true" />
                <span>Alpine Ridge Badge</span>
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-2 tabular-nums">
              <div className="font-display text-2xl font-bold text-[#242923]">
                {userStats.monthlyDistanceKm.toFixed(1)} km{' '}
                <span className="text-sm font-normal text-[#858B80]">
                  / {profile.monthlyTargetKm.toFixed(1)} km
                </span>
              </div>
              <span className="text-sm font-semibold text-[#304B37]">
                {userStats.monthlyProgressPct}%
              </span>
            </div>

            <div className="mt-3">
              <ProgressBar
                value={userStats.monthlyProgressPct}
                label="Monthly hiking distance challenge"
              />
            </div>

            {/* Elevation-area challenge curve inspired by reference Profile screen */}
            <div className="mt-5 -mx-6 -mb-6 pt-2">
              <svg
                viewBox="0 0 400 95"
                className="w-full h-24 block"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="challengeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#77A77A" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#DDE5D6" stopOpacity="0.18" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,85 L42,68 L84,74 L126,56 L172,62 L218,45 L268,52 L318,28 L364,34 L400,12 L400,95 L0,95 Z"
                  fill="url(#challengeGrad)"
                />
                <path
                  d="M0,85 L42,68 L84,74 L126,56 L172,62 L218,45 L268,52 L318,28 L364,34 L400,12"
                  fill="none"
                  stroke="#304B37"
                  strokeWidth="2.5"
                />
                <circle
                  cx={(challengeX / 100) * 400}
                  cy={85 - (challengeX / 100) * 65}
                  r="7"
                  fill="#304B37"
                  stroke="#FAFAF5"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </section>

          <section aria-label="Achievements" className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#242923]">Achievements</h2>
              <span className="text-xs text-[#858B80] tabular-nums">
                {achievements.filter((a) => a.unlocked).length} / {achievements.length} unlocked
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((ach) => (
                <AchievementCard key={ach.id} achievement={ach} />
              ))}
            </div>
          </section>
        </div>

        {/* Completed Trails + Personal Activity History */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <section aria-label="Completed trails">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="font-display text-lg font-bold text-[#242923]">Completed Trails</h2>
              <Link
                to="/explore"
                className="text-xs font-semibold text-[#304B37] hover:underline"
              >
                Find next trail
              </Link>
            </div>

            <div className="flex flex-col gap-3.5">
              {completedHikes.slice(0, 4).map((hike) => (
                <Link
                  key={hike.id}
                  to={`/trail/${hike.trailId}`}
                  className="group relative h-32 rounded-[22px] overflow-hidden border border-[#DDE5D6] block shadow-xs"
                >
                  <img
                    src={hike.imageUrl}
                    alt={`${hike.trailName} in ${hike.country}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#242923]/80 via-[#242923]/25 to-transparent"
                  />
                  <div className="absolute top-3 left-3.5 text-[11px] font-medium text-[#FAFAF5] bg-[#242923]/55 backdrop-blur-sm px-2.5 py-1 rounded-[10px] tabular-nums">
                    {hike.completedDate} · {hike.distanceKm.toFixed(1)} km
                  </div>
                  <div className="absolute top-3 right-3.5 w-8 h-8 rounded-full bg-[#FAFAF5]/90 text-[#242923] flex items-center justify-center group-hover:bg-[#304B37] group-hover:text-[#FAFAF5] transition-colors">
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-[#FAFAF5]">
                    <h3 className="font-display text-base font-bold truncate">
                      {hike.trailName} ({hike.country})
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section
            aria-label="Personal hiking activity history"
            className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-5"
          >
            <h2 className="font-display text-base font-bold text-[#242923] mb-3.5">
              Activity History
            </h2>
            <div className="divide-y divide-[#DDE5D6]/80">
              {completedHikes.map((hike) => (
                <div key={hike.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to={`/trail/${hike.trailId}`}
                      className="font-display text-sm font-semibold text-[#242923] hover:text-[#304B37] truncate block"
                    >
                      {hike.trailName}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-[#858B80] tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" aria-hidden="true" />
                        <span>{hike.completedDate}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>{formatDurationCompact(hike.durationMinutes)}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" aria-hidden="true" />
                        <span>+{hike.elevationGainM}m</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 tabular-nums">
                    <div className="font-display text-sm font-bold text-[#304B37]">
                      {hike.distanceKm.toFixed(1)} km
                    </div>
                    <div className="text-[11px] text-[#858B80]">{hike.avgSpeedKmh.toFixed(1)} km/h</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Edit hiker profile"
          className="fixed inset-0 z-50 bg-[#242923]/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE5D6]">
              <h2 className="font-display text-lg font-bold text-[#242923] flex items-center gap-2">
                <Mountain className="w-4 h-4 text-[#304B37]" aria-hidden="true" />
                <span>Edit Profile</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                aria-label="Close edit profile modal"
                className="min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center text-[#858B80] hover:text-[#242923] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 flex flex-col gap-4">
              <div>
                <label htmlFor="profile-name" className="block text-xs font-medium text-[#242923] mb-1">
                  Display Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-[12px] bg-[#F4F3EC] border border-[#DDE5D6] text-sm text-[#242923] focus:outline-none focus:border-[#304B37]"
                />
              </div>

              <div>
                <label htmlFor="profile-location" className="block text-xs font-medium text-[#242923] mb-1">
                  Home Base
                </label>
                <input
                  id="profile-location"
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-[12px] bg-[#F4F3EC] border border-[#DDE5D6] text-sm text-[#242923] focus:outline-none focus:border-[#304B37]"
                />
              </div>

              <div>
                <label htmlFor="profile-target" className="block text-xs font-medium text-[#242923] mb-1">
                  Monthly Target Distance (km)
                </label>
                <input
                  id="profile-target"
                  type="number"
                  step="0.5"
                  min="1"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-[12px] bg-[#F4F3EC] border border-[#DDE5D6] text-sm text-[#242923] tabular-nums focus:outline-none focus:border-[#304B37]"
                />
              </div>

              {formError && <p className="text-xs text-[#C87568]">{formError}</p>}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <PrimaryButton type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </PrimaryButton>
                <PrimaryButton type="submit">Save Changes</PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
