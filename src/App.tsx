import React, { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { BottomNavigation } from './components/BottomNavigation';
import { AppToast, OfflineIndicator, SWUpdateBanner } from './components/PWAOverlays';
import { TrailProvider } from './context/TrailContext';
import { ActivityPage } from './pages/ActivityPage';
import { ExploreMapPage } from './pages/ExploreMapPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { SavedTrailsPage } from './pages/SavedTrailsPage';
import { TrailDetailsPage } from './pages/TrailDetailsPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.1 }}>
      <TrailProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen bg-[#F4F3EC] text-[#242923] flex flex-col">
            <OfflineIndicator />
            <BottomNavigation />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExploreMapPage />} />
                <Route path="/trail/:id" element={<TrailDetailsPage />} />
                <Route path="/saved" element={<SavedTrailsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/activity" element={<ActivityPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <SWUpdateBanner />
            <AppToast />
          </div>
        </BrowserRouter>
      </TrailProvider>
    </MotionConfig>
  );
}
