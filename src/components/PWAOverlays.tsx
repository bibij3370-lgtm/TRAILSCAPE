import React, { useState } from 'react';
import { Download, RefreshCw, WifiOff, X } from 'lucide-react';
import { useTrails } from '../context/TrailContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useServiceWorkerUpdate } from '../hooks/useServiceWorkerUpdate';

interface PWAInstallButtonProps {
  variant?: 'default' | 'primary';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'default',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowInstallGuide(true);
      }
      return;
    }
    setShowInstallGuide(true);
  };

  const buttonClasses =
    variant === 'primary'
      ? 'min-h-[44px] px-4 py-2 rounded-[14px] bg-[#304B37] text-[#FAFAF5] text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-[#243D2D] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-sm'
      : 'min-h-[44px] sm:min-h-[40px] px-3.5 py-2 rounded-[14px] bg-[#FAFAF5] border border-[#DDE5D6] text-xs font-semibold text-[#304B37] inline-flex items-center justify-center gap-1.5 hover:bg-[#DDE5D6]/60 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer';

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={`${buttonClasses} ${className}`}
      >
        <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>Install App</span>
      </button>

      {showInstallGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Install TRAILSCAPE App"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#242923]/55 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-sm rounded-[24px] bg-[#FAFAF5] border border-[#DDE5D6] p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-[#242923]">
                Install TRAILSCAPE
              </h3>
              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                aria-label="Close install instructions"
                className="min-w-[40px] min-h-[40px] rounded-full text-[#858B80] hover:text-[#242923] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <ol className="mt-3 space-y-2 text-sm text-[#242923]/85 leading-relaxed list-decimal list-inside">
                <li>
                  Tap the <strong>Share</strong> icon in Safari’s toolbar.
                </li>
                <li>
                  Scroll down and tap <strong>Add to Home Screen</strong> for instant offline trail
                  access.
                </li>
              </ol>
            ) : (
              <ol className="mt-3 space-y-2 text-sm text-[#242923]/85 leading-relaxed list-decimal list-inside">
                <li>
                  Open your mobile browser menu (<strong>⋮</strong> or <strong>Share</strong>).
                </li>
                <li>
                  Select <strong>Install app</strong> or <strong>Add to Home screen</strong> to
                  launch TRAILSCAPE full-screen offline.
                </li>
              </ol>
            )}

            <button
              type="button"
              onClick={() => setShowInstallGuide(false)}
              className="mt-5 w-full min-h-[44px] rounded-[16px] bg-[#304B37] text-[#FAFAF5] text-sm font-medium hover:bg-[#243D2D] transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

interface MobileInstallBannerProps {
  className?: string;
}

export const MobileInstallBanner: React.FC<MobileInstallBannerProps> = ({ className = '' }) => {
  const { isInstalled } = usePWAInstall();
  if (isInstalled) return null;

  return (
    <div
      className={`bg-[#FAFAF5]/95 border border-[#DDE5D6] rounded-[18px] px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-xs ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <img
          src="/icon.svg"
          alt=""
          className="w-9 h-9 rounded-[10px] shrink-0 border border-[#DDE5D6]"
        />
        <div className="min-w-0">
          <p className="font-display text-xs font-bold text-[#242923] truncate">
            TRAILSCAPE App
          </p>
          <p className="text-[11px] text-[#858B80] truncate">
            Offline trail maps &amp; GPS ready
          </p>
        </div>
      </div>
      <PWAInstallButton variant="primary" />
    </div>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#243D2D] text-[#FAFAF5] px-4 py-2 rounded-full shadow-lg text-xs font-medium inline-flex items-center gap-2"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#DDE5D6]" aria-hidden="true" />
      <span>Offline Mode — Cached trails &amp; maps active</span>
    </div>
  );
};

export const SWUpdateBanner: React.FC = () => {
  const { needRefresh, applyUpdate, dismissUpdate } = useServiceWorkerUpdate();
  if (!needRefresh) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-24 md:bottom-6 right-4 z-50 max-w-xs bg-[#FAFAF5] border border-[#A6B79B] rounded-[18px] p-3.5 shadow-xl flex items-center gap-3"
    >
      <RefreshCw className="w-4 h-4 text-[#304B37] shrink-0" aria-hidden="true" />
      <div className="flex-1 text-xs">
        <p className="font-semibold text-[#242923]">Update available</p>
        <p className="text-[#858B80]">Refresh for the latest trail maps.</p>
      </div>
      <button
        type="button"
        onClick={applyUpdate}
        className="min-h-[34px] px-3 rounded-[12px] bg-[#304B37] text-[#FAFAF5] text-xs font-semibold hover:bg-[#243D2D] cursor-pointer"
      >
        Update
      </button>
      <button
        type="button"
        onClick={dismissUpdate}
        aria-label="Dismiss update notification"
        className="p-1 text-[#858B80] hover:text-[#242923] cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const AppToast: React.FC = () => {
  const { toastMessage } = useTrails();
  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#242923] text-[#FAFAF5] px-4 py-2.5 rounded-full shadow-lg text-xs font-medium whitespace-nowrap"
    >
      {toastMessage}
    </div>
  );
};
