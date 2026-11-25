export type TrailCategory = 'Mountains' | 'Lakes' | 'Forests' | 'Coastal' | 'Waterfalls';

export type DifficultyLevel = 'Easy' | 'Moderate' | 'Hard';

export type RegionName =
  | 'All Regions'
  | 'Tatra & Alps'
  | 'Himalayas & Karakoram'
  | 'North America'
  | 'Coastal Europe';

export interface TrailWaypoint {
  id: string;
  label: string;
  distanceKm: number;
  elevationM: number;
  x: number; // 0-100 percentage on map canvas
  y: number; // 0-100 percentage on map canvas
}

export interface TrailWeather {
  tempC: number;
  condition: string;
  windKmh: number;
  humidityPct: number;
  visibility: string;
  trailCondition: string;
}

export interface TrailReview {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
  conditions: string;
}

export interface Trail {
  id: string;
  name: string;
  park: string;
  country: string;
  region: Exclude<RegionName, 'All Regions'>;
  category: TrailCategory;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  durationMinutes: number;
  durationLabel: string;
  elevationGainM: number;
  maxAltitudeM: number;
  difficulty: DifficultyLevel;
  routeType: 'Loop' | 'Out & Back' | 'Point to Point';
  bestSeason: string;
  surface: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapPosition: {
    x: number; // 0-100 on Explore vector map
    y: number;
  };
  imageUrl: string;
  featured: boolean;
  popularNearUser: boolean;
  summary: string;
  description: string;
  highlights: string[];
  checklist: string[];
  weather: TrailWeather;
  elevationProfile: { distanceKm: number; elevationM: number }[];
  waypoints: TrailWaypoint[];
  reviews: TrailReview[];
}

export interface CompletedHike {
  id: string;
  trailId: string;
  trailName: string;
  location: string;
  country: string;
  imageUrl: string;
  completedDate: string;
  distanceKm: number;
  durationMinutes: number;
  elevationGainM: number;
  avgSpeedKmh: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  unit: string;
  metric: 'hikes' | 'mountains' | 'distance' | 'elevation';
  unlocked: boolean;
  unlockedDate?: string;
}

export interface UserProfile {
  name: string;
  location: string;
  memberSince: string;
  avatarUrl: string;
  monthlyTargetKm: number;
  preferredRegion: RegionName;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  trailId?: string;
}
