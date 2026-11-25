import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  INITIAL_ACHIEVEMENTS,
  INITIAL_COMPLETED_HIKES,
  INITIAL_NOTIFICATIONS,
  INITIAL_TRAILS,
  INITIAL_USER_PROFILE,
} from '../data/trails';
import {
  Achievement,
  AppNotification,
  CompletedHike,
  Trail,
  TrailReview,
  UserProfile,
} from '../types/trail';
import {
  computeUserStats,
  evaluateAchievements,
  recalculateRating,
} from '../utils/trailLogic';

const STORAGE_KEY = 'trailscape_app_state_v1';

interface PersistedState {
  savedIds: string[];
  offlineIds: string[];
  recentIds: string[];
  profile: UserProfile;
  completedHikes: CompletedHike[];
  achievements: Achievement[];
  checklistChecked: Record<string, string[]>;
  customReviews: Record<string, TrailReview[]>;
  notifications: AppNotification[];
}

const DEFAULT_PERSISTED: PersistedState = {
  savedIds: ['morskie-oko', 'dolomites-seceda', 'lake-bled'],
  offlineIds: ['morskie-oko'],
  recentIds: ['lake-bled', 'dolomites-seceda', 'sol-duc-waterfall'],
  profile: INITIAL_USER_PROFILE,
  completedHikes: INITIAL_COMPLETED_HIKES,
  achievements: INITIAL_ACHIEVEMENTS,
  checklistChecked: {
    'morskie-oko': ['Waterproof alpine shell jacket', '2L insulated water bottle'],
  },
  customReviews: {},
  notifications: INITIAL_NOTIFICATIONS,
};

const TRAIL_IMAGE_BY_ID = new Map(INITIAL_TRAILS.map((t) => [t.id, t.imageUrl]));

function loadPersistedState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PERSISTED;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const syncedCompletedHikes = (parsed.completedHikes ?? DEFAULT_PERSISTED.completedHikes).map(
      (hike) => ({
        ...hike,
        imageUrl: TRAIL_IMAGE_BY_ID.get(hike.trailId) ?? hike.imageUrl,
      })
    );
    return {
      ...DEFAULT_PERSISTED,
      ...parsed,
      completedHikes: syncedCompletedHikes,
      profile: { ...DEFAULT_PERSISTED.profile, ...(parsed.profile ?? {}) },
    };
  } catch {
    return DEFAULT_PERSISTED;
  }
}

interface TrailContextValue {
  trails: Trail[];
  savedIds: string[];
  offlineIds: string[];
  recentIds: string[];
  profile: UserProfile;
  completedHikes: CompletedHike[];
  achievements: Achievement[];
  notifications: AppNotification[];
  unreadCount: number;
  userStats: ReturnType<typeof computeUserStats>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  toggleSaved: (trailId: string) => void;
  toggleOfflineDownload: (trailId: string) => Promise<void>;
  markExplored: (trailId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleChecklistItem: (trailId: string, item: string) => void;
  getCheckedItems: (trailId: string) => string[];
  addTrailReview: (trailId: string, rating: number, comment: string, conditions: string) => void;
  recordCompletedHike: (hike: Omit<CompletedHike, 'id'>) => Achievement[];
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
}

const TrailContext = createContext<TrailContextValue | null>(null);

export const TrailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedState>(() => loadPersistedState());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Warm browser image cache on mount for instant navigation & zero flicker
  useEffect(() => {
    const preload = () => {
      for (const trail of INITIAL_TRAILS) {
        const img = new Image();
        img.decoding = 'async';
        img.src = trail.imageUrl;
      }
      const avatar = new Image();
      avatar.decoding = 'async';
      avatar.src = INITIAL_USER_PROFILE.avatarUrl;
    };
    if (typeof window !== 'undefined') {
      preload();
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const trails = useMemo(() => {
    return INITIAL_TRAILS.map((trail) => {
      const added = state.customReviews[trail.id] ?? [];
      if (added.length === 0) return trail;
      let rating = trail.rating;
      let reviewCount = trail.reviewCount;
      for (const r of added) {
        const next = recalculateRating(rating, reviewCount, r.rating);
        rating = next.rating;
        reviewCount = next.reviewCount;
      }
      return {
        ...trail,
        rating,
        reviewCount,
        reviews: [...added, ...trail.reviews],
      };
    });
  }, [state.customReviews]);

  const userStats = useMemo(() => {
    return computeUserStats({
      baseCompletedCount: 23,
      baseTotalDistanceKm: 248.6,
      baseLongestTrailKm: 21.4,
      completedHikes: state.completedHikes,
      monthlyTargetKm: state.profile.monthlyTargetKm,
    });
  }, [state.completedHikes, state.profile.monthlyTargetKm]);

  const toggleSaved = useCallback(
    (trailId: string) => {
      const willSave = !stateRef.current.savedIds.includes(trailId);
      setState((prev) => {
        const exists = prev.savedIds.includes(trailId);
        const savedIds = exists
          ? prev.savedIds.filter((id) => id !== trailId)
          : [trailId, ...prev.savedIds];
        return { ...prev, savedIds };
      });
      const trail = INITIAL_TRAILS.find((t) => t.id === trailId);
      if (trail) {
        showToast(willSave ? `Saved "${trail.name}"` : `Removed "${trail.name}" from saved`);
      }
    },
    [showToast]
  );

  const toggleOfflineDownload = useCallback(
    async (trailId: string) => {
      const trail = INITIAL_TRAILS.find((t) => t.id === trailId);
      const isCurrentlyOffline = stateRef.current.offlineIds.includes(trailId);

      setState((prev) => {
        const exists = prev.offlineIds.includes(trailId);
        const offlineIds = exists
          ? prev.offlineIds.filter((id) => id !== trailId)
          : [trailId, ...prev.offlineIds];
        return { ...prev, offlineIds };
      });

      if (trail) {
        showToast(
          isCurrentlyOffline
            ? `Removed offline copy of "${trail.name}"`
            : `"${trail.name}" downloaded for offline access`
        );
      }

      if (!isCurrentlyOffline && typeof caches !== 'undefined' && trail) {
        try {
          const cache = await caches.open('trailscape-offline-trails-v1');
          await cache.add(trail.imageUrl);
        } catch {
          // Cache API fallback handled via localStorage persistence
        }
      }
    },
    [showToast]
  );

  const markExplored = useCallback((trailId: string) => {
    setState((prev) => {
      if (prev.recentIds[0] === trailId) return prev;
      const filtered = prev.recentIds.filter((id) => id !== trailId);
      return {
        ...prev,
        recentIds: [trailId, ...filtered].slice(0, 6),
      };
    });
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...updates },
      }));
      showToast('Profile preferences updated');
    },
    [showToast]
  );

  const toggleChecklistItem = useCallback((trailId: string, item: string) => {
    setState((prev) => {
      const current = prev.checklistChecked[trailId] ?? [];
      const exists = current.includes(item);
      const updated = exists ? current.filter((i) => i !== item) : [...current, item];
      return {
        ...prev,
        checklistChecked: {
          ...prev.checklistChecked,
          [trailId]: updated,
        },
      };
    });
  }, []);

  const getCheckedItems = useCallback(
    (trailId: string) => state.checklistChecked[trailId] ?? [],
    [state.checklistChecked]
  );

  const addTrailReview = useCallback(
    (trailId: string, rating: number, comment: string, conditions: string) => {
      const review: TrailReview = {
        id: `rev-${Date.now()}`,
        author: stateRef.current.profile.name || 'Alex',
        date: 'Nov 25, 2026',
        rating,
        comment: comment.trim(),
        conditions: conditions.trim() || 'Clear trail conditions',
      };
      setState((prev) => ({
        ...prev,
        customReviews: {
          ...prev.customReviews,
          [trailId]: [review, ...(prev.customReviews[trailId] ?? [])],
        },
      }));
      showToast('Trail review published');
    },
    [showToast]
  );

  const recordCompletedHike = useCallback(
    (hike: Omit<CompletedHike, 'id'>): Achievement[] => {
      const curr = stateRef.current;
      const newHike: CompletedHike = {
        ...hike,
        id: `ch-${Date.now()}`,
      };
      const nextHikes = [newHike, ...curr.completedHikes];
      const nextStats = computeUserStats({
        baseCompletedCount: 23,
        baseTotalDistanceKm: 248.6,
        baseLongestTrailKm: 21.4,
        completedHikes: nextHikes,
        monthlyTargetKm: curr.profile.monthlyTargetKm,
      });

      const totalElevation = nextHikes.reduce((sum, h) => sum + h.elevationGainM, 1400);
      const nextAchievements = evaluateAchievements(curr.achievements, {
        trailsCompleted: nextStats.trailsCompleted,
        totalDistanceKm: nextStats.totalDistanceKm,
        totalElevationM: totalElevation,
      });

      const newlyUnlocked = nextAchievements.filter(
        (a, i) => a.unlocked && !curr.achievements[i]?.unlocked
      );

      setState((prev) => ({
        ...prev,
        completedHikes: nextHikes,
        achievements: nextAchievements,
      }));

      return newlyUnlocked;
    },
    []
  );

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const unreadCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications]
  );

  const value: TrailContextValue = useMemo(
    () => ({
      trails,
      savedIds: state.savedIds,
      offlineIds: state.offlineIds,
      recentIds: state.recentIds,
      profile: state.profile,
      completedHikes: state.completedHikes,
      achievements: state.achievements,
      notifications: state.notifications,
      unreadCount,
      userStats,
      toastMessage,
      showToast,
      toggleSaved,
      toggleOfflineDownload,
      markExplored,
      updateProfile,
      toggleChecklistItem,
      getCheckedItems,
      addTrailReview,
      recordCompletedHike,
      markAllNotificationsRead,
      markNotificationRead,
    }),
    [
      trails,
      state.savedIds,
      state.offlineIds,
      state.recentIds,
      state.profile,
      state.completedHikes,
      state.achievements,
      state.notifications,
      unreadCount,
      userStats,
      toastMessage,
      showToast,
      toggleSaved,
      toggleOfflineDownload,
      markExplored,
      updateProfile,
      toggleChecklistItem,
      getCheckedItems,
      addTrailReview,
      recordCompletedHike,
      markAllNotificationsRead,
      markNotificationRead,
    ]
  );

  return <TrailContext.Provider value={value}>{children}</TrailContext.Provider>;
};

export function useTrails() {
  const ctx = useContext(TrailContext);
  if (!ctx) throw new Error('useTrails must be used within TrailProvider');
  return ctx;
}
