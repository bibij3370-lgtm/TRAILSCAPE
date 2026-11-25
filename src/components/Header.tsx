import React, { useState } from 'react';
import { Bell, Check, Globe, MapPin, User, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTrails } from '../context/TrailContext';
import { RegionName } from '../types/trail';

const REGIONS: RegionName[] = [
  'All Regions',
  'Tatra & Alps',
  'Himalayas & Karakoram',
  'North America',
  'Coastal Europe',
];

export const Header: React.FC = () => {
  const {
    profile,
    notifications,
    unreadCount,
    markAllNotificationsRead,
    markNotificationRead,
    updateProfile,
  } = useTrails();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  return (
    <header className="relative z-30 flex items-center justify-between gap-3 pt-2 pb-4">
      <Link
        to="/profile"
        className="flex items-center gap-3 min-w-0 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#304B37] rounded-[18px]"
      >
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FAFAF5] shadow-sm bg-[#DDE5D6] shrink-0">
          {!avatarError ? (
            <img
              src={profile.avatarUrl}
              alt={`${profile.name} profile`}
              referrerPolicy="no-referrer"
              onError={() => setAvatarError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#304B37] flex items-center justify-center text-[#FAFAF5]">
              <User className="w-5 h-5" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="font-display text-base font-bold text-[#242923] truncate group-hover:text-[#304B37] transition-colors">
            Hello, {profile.name}!
          </p>
          <p className="text-xs text-[#858B80] truncate">Ready for your next adventure?</p>
        </div>
      </Link>

      <div className="flex items-center gap-2 shrink-0 relative">
        <button
          type="button"
          onClick={() => {
            setShowRegionMenu((v) => !v);
            setShowNotifications(false);
          }}
          aria-label={`Change trail region, currently ${profile.preferredRegion}`}
          aria-expanded={showRegionMenu}
          className="min-h-[44px] px-3 py-2 rounded-full bg-[#FAFAF5]/90 backdrop-blur-sm border border-[#DDE5D6] text-xs font-medium text-[#242923] inline-flex items-center gap-1.5 hover:bg-[#DDE5D6]/50 transition-colors cursor-pointer"
        >
          <Globe className="w-4 h-4 text-[#304B37]" aria-hidden="true" />
          <span className="hidden sm:inline max-w-[130px] truncate">{profile.preferredRegion}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setShowNotifications((v) => !v);
            setShowRegionMenu(false);
          }}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          aria-expanded={showNotifications}
          className="relative min-w-[44px] min-h-[44px] rounded-full bg-[#FAFAF5]/90 backdrop-blur-sm border border-[#DDE5D6] text-[#242923] inline-flex items-center justify-center hover:bg-[#DDE5D6]/50 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#304B37] text-[#FAFAF5] text-[10px] font-bold flex items-center justify-center tabular-nums">
              {unreadCount}
            </span>
          )}
        </button>

        {showRegionMenu && (
          <div
            role="dialog"
            aria-label="Select discovery region"
            className="absolute right-0 top-14 w-64 max-w-[calc(100vw-2rem)] bg-[#FAFAF5] border border-[#DDE5D6] rounded-[18px] shadow-xl p-3 z-50"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DDE5D6]/70">
              <span className="font-display text-xs font-bold text-[#242923]">Trail Region</span>
              <button
                type="button"
                onClick={() => setShowRegionMenu(false)}
                aria-label="Close region selector"
                className="p-1 text-[#858B80] hover:text-[#242923] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {REGIONS.map((region) => {
                const active = profile.preferredRegion === region;
                return (
                  <button
                    key={region}
                    type="button"
                    onClick={() => {
                      updateProfile({ preferredRegion: region });
                      setShowRegionMenu(false);
                    }}
                    className={`w-full min-h-[40px] px-3 py-2 rounded-[12px] text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#304B37] text-[#FAFAF5]'
                        : 'text-[#242923] hover:bg-[#F4F3EC]'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{region}</span>
                    </span>
                    {active && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showNotifications && (
          <div
            role="dialog"
            aria-label="Trail notifications"
            className="absolute right-0 top-14 w-80 max-w-[calc(100vw-2rem)] bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] shadow-xl p-4 z-50"
          >
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#DDE5D6]/70">
              <span className="font-display text-sm font-bold text-[#242923]">Trail Alerts</span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-xs font-medium text-[#304B37] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Close notifications"
                  className="p-1 text-[#858B80] hover:text-[#242923] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-[12px] p-3 text-xs transition-colors ${
                    item.read ? 'bg-[#F4F3EC]/60' : 'bg-[#DDE5D6]/45'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-[#242923]">{item.title}</p>
                    <span className="text-[11px] text-[#858B80] shrink-0">{item.timeAgo}</span>
                  </div>
                  <p className="mt-1 text-[#858B80] leading-relaxed">{item.message}</p>
                  <div className="mt-2 flex items-center justify-between">
                    {item.trailId ? (
                      <Link
                        to={`/trail/${item.trailId}`}
                        onClick={() => {
                          markNotificationRead(item.id);
                          setShowNotifications(false);
                        }}
                        className="font-semibold text-[#304B37] hover:underline"
                      >
                        Open trail
                      </Link>
                    ) : (
                      <span />
                    )}
                    {!item.read && (
                      <button
                        type="button"
                        onClick={() => markNotificationRead(item.id)}
                        className="text-[11px] text-[#304B37] font-medium hover:underline cursor-pointer"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
