import React from 'react';
import { Bookmark, Compass, Home, Play, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const BottomNavigation: React.FC = () => {
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/' || pathname.startsWith('/trail/');
    return pathname === path;
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/activity', label: 'Start Hike', icon: Play, featured: true },
    { to: '/saved', label: 'Saved', icon: Bookmark },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop & Tablet Top Navigation Bar — clean 3-zone contract */}
      <nav
        aria-label="Primary desktop navigation"
        className="hidden md:block sticky top-0 z-40 bg-[#F4F3EC]/90 backdrop-blur-md border-b border-[#DDE5D6]"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
          <Link
            to="/"
            className="font-display text-lg font-extrabold tracking-tight text-[#243D2D] whitespace-nowrap shrink-0"
          >
            TRAILSCAPE
          </Link>

          <div className="flex items-center gap-7 text-sm font-medium">
            <Link
              to="/"
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                isActive('/')
                  ? 'border-[#304B37] text-[#242923] font-semibold'
                  : 'border-transparent text-[#858B80] hover:text-[#242923]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                isActive('/explore')
                  ? 'border-[#304B37] text-[#242923] font-semibold'
                  : 'border-transparent text-[#858B80] hover:text-[#242923]'
              }`}
            >
              Explore Map
            </Link>
            <Link
              to="/saved"
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                isActive('/saved')
                  ? 'border-[#304B37] text-[#242923] font-semibold'
                  : 'border-transparent text-[#858B80] hover:text-[#242923]'
              }`}
            >
              Saved
            </Link>
            <Link
              to="/profile"
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                isActive('/profile')
                  ? 'border-[#304B37] text-[#242923] font-semibold'
                  : 'border-transparent text-[#858B80] hover:text-[#242923]'
              }`}
            >
              Profile
            </Link>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/activity"
              className="min-h-[42px] px-5 py-2 rounded-[18px] bg-[#304B37] text-[#FAFAF5] text-sm font-medium inline-flex items-center gap-2 hover:bg-[#243D2D] transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-[#243D2D]/15"
            >
              <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              <span>Start Hike</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Floating Frosted Bottom Navigation Bar (<= 15% mobile sticky cap) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-2.5 inset-x-3 z-40 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="max-w-md mx-auto bg-[#FAFAF5]/95 backdrop-blur-xl border border-[#DDE5D6] rounded-[28px] shadow-lg shadow-[#242923]/12 px-2 py-1.5 grid grid-cols-5 items-end gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);

            if (item.featured) {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-label="Start Hike"
                  aria-current={active ? 'page' : undefined}
                  className="min-h-[48px] pb-0.5 flex flex-col items-center justify-end -mt-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#304B37] rounded-[20px]"
                >
                  <span
                    className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 ${
                      active
                        ? 'bg-[#243D2D] text-[#FAFAF5] ring-3 ring-[#DDE5D6]'
                        : 'bg-[#304B37] text-[#FAFAF5] hover:bg-[#243D2D]'
                    }`}
                  >
                    <Icon className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
                  </span>
                  <span className="mt-1 text-[10px] leading-none font-semibold text-[#304B37] whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className={`min-h-[48px] px-1 rounded-[22px] flex flex-col items-center justify-center gap-1 transition-all duration-150 ${
                  active
                    ? 'bg-[#DDE5D6]/85 text-[#243D2D] font-semibold'
                    : 'text-[#858B80] hover:text-[#242923]'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                <span className="text-[10px] leading-none whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
